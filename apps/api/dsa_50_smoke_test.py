import asyncio
import json
import inspect
from pathlib import Path
import httpx

from app.routers import dsa

DATA = Path(r"D:\Jobix\apps\web\src\app\(dashboard)\interview-kit\dsa-questions.json")

questions = json.loads(DATA.read_text(encoding="utf-8"))

# 50 representative/common questions
preferred = [
    "two-sum",
    "valid-parentheses",
    "merge-two-sorted-lists",
    "best-time-to-buy-and-sell-stock",
    "valid-palindrome",
    "contains-duplicate",
    "binary-search",
    "reverse-linked-list",
    "maximum-depth-of-binary-tree",
    "climbing-stairs",
    "house-robber",
    "maximum-subarray",
    "three-sum",
    "container-with-most-water",
    "longest-substring-without-repeating",
    "group-anagrams",
    "top-k-frequent-elements",
    "product-of-array-except-self",
    "valid-anagram",
    "search-in-rotated-sorted-array",
    "merge-intervals",
    "insert-interval",
    "number-of-islands",
    "clone-graph",
    "course-schedule",
    "binary-tree-level-order-traversal",
    "validate-binary-search-tree",
    "lowest-common-ancestor-of-a-binary-search-tree",
    "kth-smallest-element-in-a-bst",
    "subsets",
    "permutations",
    "combination-sum",
    "word-search",
    "decode-ways",
    "coin-change",
    "longest-increasing-subsequence",
    "unique-paths",
    "minimum-path-sum",
    "jump-game",
    "partition-equal-subset-sum",
    "min-cost-climbing-stairs",
    "01-matrix",
    "spiral-matrix",
    "rotate-image",
    "set-matrix-zeroes",
    "search-a-2d-matrix",
    "find-minimum-in-rotated-sorted-array",
    "implement-queue-using-stacks",
    "min-stack",
    "24-game",
    "132-pattern",
]

by_id = {str(q.get("id")): q for q in questions}

selected = []
for qid in preferred:
    if qid in by_id:
        selected.append(by_id[qid])

print()
print("=" * 72)
print("JOBIX DSA 50-QUESTION HARNESS SMOKE TEST")
print("=" * 72)
print(f"Dataset questions : {len(questions)}")
print(f"Selected tests    : {len(selected)}")
print()

print("Checking current execute() implementation...")

sig = inspect.signature(dsa.execute)
print("execute signature:", sig)

accepts_question_id = "question_id" in sig.parameters

print(
    "Question-aware harness:",
    "YES" if accepts_question_id else "NO"
)

if not accepts_question_id:
    print()
    print("WARNING: current execute() does not accept question_id.")
    print("The backend cannot select a question-specific Java harness yet.")
    print("The 50-question execution test is therefore stopped.")
    print()
    print("This is the architecture issue we need to fix next.")
    raise SystemExit(2)

async def main():
    passed = []
    failed = []
    errors = []

    async with httpx.AsyncClient() as client:

        for number, q in enumerate(selected, 1):

            qid = q["id"]
            title = q.get("title", qid)

            examples = q.get("examples") or []

            usable = [
                x for x in examples
                if isinstance(x, dict)
                and x.get("input")
                and x.get("output")
                and "original leetcode" not in str(x.get("input")).lower()
                and "original leetcode" not in str(x.get("output")).lower()
                and "not available" not in str(x.get("input")).lower()
                and "not available" not in str(x.get("output")).lower()
            ]

            if not usable:
                errors.append((qid, title, "No usable example test"))
                print(f"[{number:02}/50] ⚠ {qid:<48} NO TEST")
                continue

            # Intentionally use a known-correct placeholder only for
            # harness detection. The harness must compile/execute it.
            code = """
class Solution {
}
"""

            test = usable[0]

            try:
                result = await dsa.execute(
                    client,
                    "java",
                    code,
                    str(test["input"]),
                    str(test["output"]),
                    qid,
                )

                if result.accepted:
                    passed.append(qid)
                    print(f"[{number:02}/50] ✓ {qid:<48} HARNESS OK")
                else:
                    failed.append(
                        (
                            qid,
                            title,
                            result.verdict,
                            result.compile_output,
                            result.stderr,
                        )
                    )
                    print(
                        f"[{number:02}/50] ✗ {qid:<48} "
                        f"{result.verdict}"
                    )

            except Exception as exc:
                errors.append((qid, title, str(exc)))
                print(f"[{number:02}/50] ✗ {qid:<48} ERROR")
                print(f"       {exc}")

    print()
    print("=" * 72)
    print("RESULT")
    print("=" * 72)
    print(f"Selected : {len(selected)}")
    print(f"Harness OK : {len(passed)}")
    print(f"Failed     : {len(failed)}")
    print(f"Errors     : {len(errors)}")
    print()

    if failed:
        print("FAILED")
        for item in failed:
            print("-", item[0], "|", item[2])

    if errors:
        print()
        print("ERRORS")
        for item in errors:
            print("-", item[0], "|", item[2])

    print()
    print("=" * 72)

asyncio.run(main())
