from __future__ import annotations
import re

import asyncio
import os
from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.dsa_usage import DsaUsage


router = APIRouter(prefix="/api/dsa", tags=["dsa"])

JUDGE0_URL = os.getenv("JUDGE0_URL", "https://ce.judge0.com").rstrip("/")
JUDGE0_AUTH_TOKEN = os.getenv("JUDGE0_AUTH_TOKEN", "").strip()

DSA_QUESTION_LIMIT = 20
LEETCODE_QUESTION_LIMIT = 200

LANGUAGE_IDS = {
    "java": 91,
    "python": 113,
    "cpp": 105,
}


class TestCase(BaseModel):
    input: str
    expected_output: str


class RunTestsRequest(BaseModel):
    question_id: str = Field(min_length=1, max_length=255)
    language: str
    code: str = Field(min_length=1)
    tests: list[TestCase] = Field(min_length=1, max_length=3)


class SubmitRequest(BaseModel):
    question_id: str = Field(min_length=1, max_length=255)
    language: str
    code: str = Field(min_length=1)


class TestResult(BaseModel):
    index: int = 0
    status: str
    verdict: str
    accepted: bool
    stdout: str | None = None
    stderr: str | None = None
    compile_output: str | None = None
    time: str | None = None
    memory: int | None = None


class TestRunResponse(BaseModel):
    question_id: str
    total: int
    passed: int
    failed: int
    results: list[TestResult]


class UsageResponse(BaseModel):
    dsa_used: int
    dsa_limit: int
    leetcode_used: int
    leetcode_limit: int
    question_used: bool


def judge0_headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}

    if JUDGE0_AUTH_TOKEN:
        headers["X-Auth-Token"] = JUDGE0_AUTH_TOKEN

    return headers


def normalize_output(value):
    if value is None:
        return ""

    text = str(value).replace("\r\n", "\n").replace("\r", "\n")

    lines = []
    for line in text.split("\n"):
        line = line.strip()
        if line:
            lines.append(" ".join(line.split()))

    return "\n".join(lines).strip()


async def execute(
    client: httpx.AsyncClient,
    language: str,
    code: str,
    stdin: str,
    expected_output: str | None = None,
    question_id: str | None = None,
):
    normalized = language.lower().strip()

    if normalized not in LANGUAGE_IDS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported language: {language}",
        )

    # JOBIX function-only Java wrapper
    if normalized == "java":
        import re

        user_code = code.strip()

        # Accept either:
        # class Solution { ... }
        # OR only the methods inside Solution.
        if "class Solution" in user_code:
            class_start = user_code.find("class Solution")
            brace_start = user_code.find("{", class_start)

            if brace_start == -1:
                raise HTTPException(
                    status_code=422,
                    detail="Invalid Solution class."
                )

            depth = 0
            closing = -1

            for i in range(brace_start, len(user_code)):
                if user_code[i] == "{":
                    depth += 1
                elif user_code[i] == "}":
                    depth -= 1
                    if depth == 0:
                        closing = i
                        break

            if closing == -1:
                raise HTTPException(
                    status_code=422,
                    detail="Invalid Solution class braces."
                )

            user_body = user_code[brace_start + 1:closing].strip()
        else:
            user_body = user_code

        # Find the first public/protected/private method.
        method_match = re.search(
            r"(?:public|private|protected)?\s*"
            r"(?:static\s+)?"
            r"([A-Za-z_][A-Za-z0-9_<>,\[\]\s]*)\s+"
            r"([A-Za-z_][A-Za-z0-9_]*)\s*"
            r"\(([^)]*)\)",
            user_body,
        )

        if not method_match:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "METHOD_NOT_FOUND",
                    "question_id": question_id,
                    "message": "Could not detect the Solution method."
                },
            )

        return_type = " ".join(method_match.group(1).split())
        method_name = method_match.group(2)
        raw_params = method_match.group(3).strip()

        params = []

        if raw_params:
            for part in raw_params.split(","):
                part = part.strip()

                # Remove annotations/final.
                part = re.sub(
                    r"@\w+(?:\([^)]*\))?\s*",
                    "",
                    part
                )
                part = re.sub(r"\bfinal\b\s*", "", part)

                m = re.match(
                    r"(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)$",
                    part
                )

                if not m:
                    raise HTTPException(
                        status_code=422,
                        detail={
                            "code": "PARAMETER_PARSE_ERROR",
                            "question_id": question_id,
                            "parameter": part,
                        },
                    )

                params.append(
                    (
                        " ".join(m.group(1).split()),
                        m.group(2),
                    )
                )

        supported = {
            "int",
            "long",
            "double",
            "float",
            "boolean",
            "String",
            "int[]",
            "long[]",
            "double[]",
            "String[]",
            "int[][]",
            "long[][]",
            "double[][]",
            "String[][]",
        }

        unsupported = [
            ptype for ptype, _ in params
            if ptype not in supported
        ]

        if return_type not in supported and return_type != "void":
            unsupported.append(return_type)

        if unsupported:
            raise HTTPException(
                status_code=422,
                detail={
                    "code": "QUESTION_TYPE_NOT_SUPPORTED",
                    "question_id": question_id,
                    "types": unsupported,
                    "message": (
                        "This question uses a Java type that is not "
                        "supported by the automatic harness yet."
                    ),
                },
            )

        # Generate a token/JSON-friendly parser.
        parser_lines = []
        call_args = []

        for index, (ptype, pname) in enumerate(params):
            if ptype == "int":
                parser_lines.append(
                    f"int {pname} = Integer.parseInt(tokens[{index}]);"
                )

            elif ptype == "long":
                parser_lines.append(
                    f"long {pname} = Long.parseLong(tokens[{index}]);"
                )

            elif ptype == "double":
                parser_lines.append(
                    f"double {pname} = Double.parseDouble(tokens[{index}]);"
                )

            elif ptype == "float":
                parser_lines.append(
                    f"float {pname} = Float.parseFloat(tokens[{index}]);"
                )

            elif ptype == "boolean":
                parser_lines.append(
                    f"boolean {pname} = Boolean.parseBoolean(tokens[{index}]);"
                )

            elif ptype == "String":
                parser_lines.append(
                    f'String {pname} = tokens[{index}];'
                )

            elif ptype.endswith("[]") and not ptype.endswith("[][]"):
                base = ptype[:-2]

                if base == "int":
                    parser_lines.append(
                        f"int[] {pname} = parseIntArray(tokens[{index}]);"
                    )
                elif base == "long":
                    parser_lines.append(
                        f"long[] {pname} = parseLongArray(tokens[{index}]);"
                    )
                elif base == "double":
                    parser_lines.append(
                        f"double[] {pname} = parseDoubleArray(tokens[{index}]);"
                    )
                elif base == "String":
                    parser_lines.append(
                        f"String[] {pname} = parseStringArray(tokens[{index}]);"
                    )

            elif ptype.endswith("[][]"):
                base = ptype[:-4]

                if base == "int":
                    parser_lines.append(
                        f"int[][] {pname} = parseIntMatrix(input);"
                    )
                elif base == "long":
                    parser_lines.append(
                        f"long[][] {pname} = parseLongMatrix(input);"
                    )
                elif base == "double":
                    parser_lines.append(
                        f"double[][] {pname} = parseDoubleMatrix(input);"
                    )
                elif base == "String":
                    parser_lines.append(
                        f"String[][] {pname} = parseStringMatrix(input);"
                    )

            call_args.append(pname)

        call = f"solution.{method_name}({', '.join(call_args)})"

        if return_type == "void":
            output_code = f"{call};"
        elif return_type == "int":
            output_code = f"System.out.println({call});"
        elif return_type == "long":
            output_code = f"System.out.println({call});"
        elif return_type in ("double", "float", "boolean", "String"):
            output_code = f"System.out.println({call});"
        elif return_type.endswith("[]"):
            output_code = f"printArray({call});"
        elif return_type.endswith("[][]"):
            output_code = f"printMatrix({call});"
        else:
            raise HTTPException(
                status_code=422,
                detail="Unsupported return type."
            )

        parser_text = "\n        ".join(parser_lines)

        code = f"""
import java.util.*;

class Solution {{
{user_body}
}}

public class Main {{

    static int[] parseIntArray(String s) {{
        s = s.replaceAll("[\\\\[\\\\],]", " ").trim();

        if (s.isEmpty()) return new int[0];

        String[] a = s.split("\\\\s+");
        int[] r = new int[a.length];

        for (int i = 0; i < a.length; i++) {{
            r[i] = Integer.parseInt(a[i]);
        }}

        return r;
    }}

    static long[] parseLongArray(String s) {{
        s = s.replaceAll("[\\\\[\\\\],]", " ").trim();

        if (s.isEmpty()) return new long[0];

        String[] a = s.split("\\\\s+");
        long[] r = new long[a.length];

        for (int i = 0; i < a.length; i++) {{
            r[i] = Long.parseLong(a[i]);
        }}

        return r;
    }}

    static double[] parseDoubleArray(String s) {{
        s = s.replaceAll("[\\\\[\\\\],]", " ").trim();

        if (s.isEmpty()) return new double[0];

        String[] a = s.split("\\\\s+");
        double[] r = new double[a.length];

        for (int i = 0; i < a.length; i++) {{
            r[i] = Double.parseDouble(a[i]);
        }}

        return r;
    }}

    static String[] parseStringArray(String s) {{
        s = s.replaceAll("[\\\\[\\\\]\\\\\"]", "").trim();

        if (s.isEmpty()) return new String[0];

        String[] a = s.split("\\\\s*,\\\\s*");

        return a;
    }}

    static int[][] parseIntMatrix(String input) {{
        String cleaned = input.replaceAll("[\\\\[\\\\]]", " ").trim();

        String[] rows = cleaned.split("\\\\n+");

        List<int[]> result = new ArrayList<>();

        for (String row : rows) {{
            row = row.replace(",", " ").trim();

            if (row.isEmpty()) continue;

            String[] values = row.split("\\\\s+");
            int[] current = new int[values.length];

            for (int i = 0; i < values.length; i++) {{
                current[i] = Integer.parseInt(values[i]);
            }}

            result.add(current);
        }}

        return result.toArray(new int[0][]);
    }}

    static long[][] parseLongMatrix(String input) {{
        String cleaned = input.replaceAll("[\\\\[\\\\]]", " ").trim();
        String[] rows = cleaned.split("\\\\n+");

        List<long[]> result = new ArrayList<>();

        for (String row : rows) {{
            row = row.replace(",", " ").trim();

            if (row.isEmpty()) continue;

            String[] values = row.split("\\\\s+");
            long[] current = new long[values.length];

            for (int i = 0; i < values.length; i++) {{
                current[i] = Long.parseLong(values[i]);
            }}

            result.add(current);
        }}

        return result.toArray(new long[0][]);
    }}

    static double[][] parseDoubleMatrix(String input) {{
        String cleaned = input.replaceAll("[\\\\[\\\\]]", " ").trim();
        String[] rows = cleaned.split("\\\\n+");

        List<double[]> result = new ArrayList<>();

        for (String row : rows) {{
            row = row.replace(",", " ").trim();

            if (row.isEmpty()) continue;

            String[] values = row.split("\\\\s+");
            double[] current = new double[values.length];

            for (int i = 0; i < values.length; i++) {{
                current[i] = Double.parseDouble(values[i]);
            }}

            result.add(current);
        }}

        return result.toArray(new double[0][]);
    }}

    static String[][] parseStringMatrix(String input) {{
        String[] rows = input.split("\\\\n+");
        List<String[]> result = new ArrayList<>();

        for (String row : rows) {{
            row = row.replace("[", "")
                     .replace("]", "")
                     .replace("\"", "")
                     .trim();

            if (row.isEmpty()) continue;

            result.add(row.split("\\\\s*,\\\\s*"));
        }}

        return result.toArray(new String[0][]);
    }}

    static void printArray(int[] a) {{
        System.out.println(Arrays.toString(a));
    }}

    static void printArray(long[] a) {{
        System.out.println(Arrays.toString(a));
    }}

    static void printArray(double[] a) {{
        System.out.println(Arrays.toString(a));
    }}

    static void printArray(String[] a) {{
        System.out.println(Arrays.toString(a));
    }}

    static void printMatrix(int[][] a) {{
        for (int[] row : a) {{
            System.out.println(Arrays.toString(row));
        }}
    }}

    static void printMatrix(long[][] a) {{
        for (long[] row : a) {{
            System.out.println(Arrays.toString(row));
        }}
    }}

    static void printMatrix(double[][] a) {{
        for (double[] row : a) {{
            System.out.println(Arrays.toString(row));
        }}
    }}

    public static void main(String[] args) throws Exception {{

        String input = new String(
            System.in.readAllBytes()
        ).trim();

        String[] tokens = input
            .replace("[", "")
            .replace("]", "")
            .replace(",", " ")
            .trim()
            .split("\\\\s+");

        Solution solution = new Solution();

        {parser_text}

        {output_code}
    }}
}}
"""

    payload: dict[str, Any] = {
        "source_code": code,
        "language_id": LANGUAGE_IDS[normalized],
        "stdin": stdin,
        "cpu_time_limit": 2,
        "cpu_extra_time": 0.5,
        "wall_time_limit": 10,
        "memory_limit": 128000,
        "enable_network": False,
        "max_processes_and_or_threads": 50,
        "max_file_size": 1024,
    }

    headers = {"Content-Type": "application/json"}

    if JUDGE0_AUTH_TOKEN:
        headers["X-Auth-Token"] = JUDGE0_AUTH_TOKEN

    response = await client.post(
        f"{JUDGE0_URL}/submissions?base64_encoded=false&wait=false",
        json=payload,
        headers=headers,
        timeout=30,
    )

    response.raise_for_status()

    submission = response.json()
    token = submission.get("token")

    if not token:
        raise HTTPException(
            status_code=502,
            detail="Judge0 did not return a submission token.",
        )

    for _ in range(30):
        await asyncio.sleep(0.5)

        result_response = await client.get(
            f"{JUDGE0_URL}/submissions/{token}?base64_encoded=false",
            headers=headers,
            timeout=30,
        )

        result_response.raise_for_status()

        result = result_response.json()
        status_id = result.get("status", {}).get("id")

        if status_id in {1, 2}:
            continue

        status_description = result.get("status", {}).get(
            "description",
            "Unknown",
        )

        stdout = result.get("stdout")
        stderr = result.get("stderr")
        compile_output = result.get("compile_output")

        accepted = (
            status_id == 3
            and (
                expected_output is None
                or normalize_output(stdout) == normalize_output(expected_output)
            )
        )

        if status_id == 4:
            verdict = "Wrong Answer"
        elif status_id in {5, 6}:
            verdict = "Time Limit Exceeded"
        elif status_id not in {3}:
            verdict = status_description
        elif accepted:
            verdict = "Accepted"
        else:
            verdict = "Wrong Answer"

        return TestResult(
            index=0,
            status=verdict,
            status_id=status_id,
            stdout=stdout,
            stderr=stderr,
            compile_output=compile_output,
            message=result.get("message"),
            time=result.get("time"),
            memory=result.get("memory"),
            accepted=accepted,
            verdict=verdict,
        )

    raise HTTPException(
        status_code=504,
        detail="Judge0 execution timed out.",
    )



def get_usage_counts(db: Session, user_id):
    dsa_count = db.scalar(
        select(func.count())
        .select_from(DsaUsage)
        .where(
            DsaUsage.user_id == user_id,
            DsaUsage.kind == "question",
        )
    ) or 0

    leetcode_count = db.scalar(
        select(func.count())
        .select_from(DsaUsage)
        .where(
            DsaUsage.user_id == user_id,
            DsaUsage.kind == "leetcode",
        )
    ) or 0

    return int(dsa_count), int(leetcode_count)


@router.get("/usage", response_model=UsageResponse)
def usage(
    question_id: str | None = None,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    dsa_count, leetcode_count = get_usage_counts(db, current_user.id)

    question_used = False

    if question_id:
        question_used = (
            db.scalar(
                select(func.count())
                .select_from(DsaUsage)
                .where(
                    DsaUsage.user_id == current_user.id,
                    DsaUsage.question_id == question_id,
                    DsaUsage.kind == "question",
                )
            )
            or 0
        ) > 0

    return UsageResponse(
        dsa_used=dsa_count,
        dsa_limit=DSA_QUESTION_LIMIT,
        leetcode_used=leetcode_count,
        leetcode_limit=LEETCODE_QUESTION_LIMIT,
        question_used=question_used,
    )


@router.post("/run-public", response_model=TestRunResponse)
async def run_public(
    request: RunTestsRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    exists = db.scalar(
        select(func.count())
        .select_from(DsaUsage)
        .where(
            DsaUsage.user_id == current_user.id,
            DsaUsage.question_id == request.question_id,
            DsaUsage.kind == "question",
        )
    )

    if not exists:
        raise HTTPException(
            status_code=403,
            detail="DSA question access is required before running code.",
        )

    async with httpx.AsyncClient() as client:
        raw_results = []

        for index, test in enumerate(request.tests):
            result = await execute(
                client,
                request.language,
                request.code,
                test.input,
                test.expected_output,
                request.question_id,
            )

            result.index = index + 1
            raw_results.append(result)

    passed = sum(1 for result in raw_results if result.accepted)

    return TestRunResponse(
        question_id=request.question_id,
        total=len(raw_results),
        passed=passed,
        failed=len(raw_results) - passed,
        results=raw_results,
    )


@router.post("/access-question")
def access_question(
    question_id: str,
    company: str = "unknown",
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.scalar(
        select(DsaUsage)
        .where(
            DsaUsage.user_id == current_user.id,
            DsaUsage.question_id == question_id,
            DsaUsage.kind == "question",
        )
    )

    if existing:
        return {
            "allowed": True,
            "already_used": True,
            "used": get_usage_counts(db, current_user.id)[0],
            "limit": DSA_QUESTION_LIMIT,
        }

    dsa_count, _ = get_usage_counts(db, current_user.id)

    if dsa_count >= DSA_QUESTION_LIMIT:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "DSA_QUESTION_LIMIT_REACHED",
                "message": "You have reached the 20-question DSA practice limit.",
                "used": dsa_count,
                "limit": DSA_QUESTION_LIMIT,
            },
        )

    usage_record = DsaUsage(
        user_id=current_user.id,
        question_id=question_id,
        company=company,
        kind="question",
    )

    db.add(usage_record)

    try:
        db.commit()
    except IntegrityError:
        # Another request may have accessed the same question at the same time.
        # The unique constraint guarantees that the question is counted only once.
        db.rollback()

        existing = db.scalar(
            select(DsaUsage).where(
                DsaUsage.user_id == current_user.id,
                DsaUsage.question_id == question_id,
                DsaUsage.kind == "question",
            )
        )

        if existing:
            current_dsa_count, _ = get_usage_counts(db, current_user.id)

            return {
                "allowed": True,
                "already_used": True,
                "used": current_dsa_count,
                "limit": DSA_QUESTION_LIMIT,
            }

        raise

    return {
        "allowed": True,
        "already_used": False,
        "used": dsa_count + 1,
        "limit": DSA_QUESTION_LIMIT,
    }


@router.post("/leetcode-access")
def leetcode_access(
    question_id: str,
    company: str = "unknown",
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.scalar(
        select(DsaUsage)
        .where(
            DsaUsage.user_id == current_user.id,
            DsaUsage.question_id == question_id,
            DsaUsage.kind == "leetcode",
        )
    )

    if existing:
        return {
            "allowed": True,
            "already_used": True,
            "used": get_usage_counts(db, current_user.id)[1],
            "limit": LEETCODE_QUESTION_LIMIT,
        }

    _, leetcode_count = get_usage_counts(db, current_user.id)

    if leetcode_count >= LEETCODE_QUESTION_LIMIT:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "LEETCODE_QUESTION_LIMIT_REACHED",
                "message": "You have reached the 200-question LeetCode access limit.",
                "used": leetcode_count,
                "limit": LEETCODE_QUESTION_LIMIT,
            },
        )

    usage_record = DsaUsage(
        user_id=current_user.id,
        question_id=question_id,
        company=company,
        kind="leetcode",
    )

    db.add(usage_record)
    db.commit()

    return {
        "allowed": True,
        "already_used": False,
        "used": leetcode_count + 1,
        "limit": LEETCODE_QUESTION_LIMIT,
    }
