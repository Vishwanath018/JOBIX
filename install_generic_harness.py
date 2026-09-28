from pathlib import Path

p = Path(r"D:\Jobix\apps\api\app\routers\dsa.py")
s = p.read_text(encoding="utf-8")

# Remove the old question-specific Java harness section.
start = s.find('    if normalized == "java":')
end = s.find('    payload: dict[str, Any] = {', start)

if start == -1 or end == -1:
    raise SystemExit("Could not locate Java harness section.")

new_java = r'''    if normalized == "java":
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

'''

s = s[:start] + new_java + s[end:]

p.write_text(s, encoding="utf-8")

print("Automatic Java harness installed.")
