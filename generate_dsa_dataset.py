import csv
import json
import re
from pathlib import Path

ROOT = Path(r"D:\Jobix\leetcode-companywise-interview-questions")
OUT = Path(r"D:\Jobix\apps\web\src\app\(dashboard)\interview-kit\dsa-questions.ts")

difficulty_map = {
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard",
}

topic_map = {
    "array": "Array",
    "arrays": "Array",
    "string": "String",
    "strings": "String",
    "linked list": "Linked List",
    "linked-list": "Linked List",
    "binary tree": "Tree",
    "tree": "Tree",
    "trees": "Tree",
    "bst": "Tree",
    "graph": "Graph",
    "graphs": "Graph",
    "dynamic programming": "Dynamic Programming",
    "dp": "Dynamic Programming",
    "binary search": "Binary Search",
    "heap": "Heap",
    "priority queue": "Heap",
    "backtracking": "Backtracking",
    "two pointers": "Two Pointers",
    "sliding window": "Sliding Window",
    "stack": "Stack",
    "queue": "Queue",
    "trie": "Trie",
    "greedy": "Greedy",
    "interval": "Intervals",
    "intervals": "Intervals",
    "bit manipulation": "Bit Manipulation",
    "math": "Math",
    "matrix": "Matrix",
}

def clean(value):
    return str(value or "").strip()

def slug(title):
    value = title.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-")

def leetcode_url(title, url=""):
    url = clean(url)

    if "leetcode.com/problems/" in url:
        return url.split("?")[0].split("#")[0]

    return f"https://leetcode.com/problems/{slug(title)}/"

def find_column(row, candidates):
    normalized = {
        re.sub(r"[^a-z0-9]", "", str(key).lower()): key
        for key in row.keys()
    }

    for candidate in candidates:
        key = re.sub(r"[^a-z0-9]", "", candidate.lower())

        if key in normalized:
            return normalized[key]

    return None

def detect_topic(title, tags):
    text = f"{title} {tags}".lower()

    for key, value in topic_map.items():
        if key in text:
            return value

    if any(x in text for x in ["subarray", "array", "sum"]):
        return "Array"

    if any(x in text for x in ["substring", "string", "palindrome"]):
        return "String"

    if any(x in text for x in ["tree", "bst"]):
        return "Tree"

    if "graph" in text:
        return "Graph"

    return "Other"

questions = {}
csv_files = list(ROOT.rglob("*.csv"))

for csv_file in csv_files:
    try:
        with open(
            csv_file,
            "r",
            encoding="utf-8-sig",
            newline=""
        ) as file:

            reader = csv.DictReader(file)

            if not reader.fieldnames:
                continue

            for row in reader:
                title_col = find_column(
                    row,
                    [
                        "title",
                        "question title",
                        "problem",
                        "problem title",
                        "name",
                    ],
                )

                difficulty_col = find_column(
                    row,
                    [
                        "difficulty",
                        "level",
                    ],
                )

                url_col = find_column(
                    row,
                    [
                        "url",
                        "link",
                        "leetcode link",
                    ],
                )

                tags_col = find_column(
                    row,
                    [
                        "tags",
                        "topics",
                        "topic",
                    ],
                )

                frequency_col = find_column(
                    row,
                    [
                        "frequency",
                        "freq",
                        "frequency %",
                    ],
                )

                if not title_col:
                    continue

                title = clean(row.get(title_col))

                if not title:
                    continue

                raw_difficulty = clean(
                    row.get(difficulty_col)
                ).lower() if difficulty_col else ""

                difficulty = difficulty_map.get(
                    raw_difficulty,
                    "Medium",
                )

                raw_tags = clean(
                    row.get(tags_col)
                ) if tags_col else ""

                tags = [
                    item.strip()
                    for item in re.split(
                        r"[;,|]",
                        raw_tags,
                    )
                    if item.strip()
                ]

                topic = detect_topic(
                    title,
                    raw_tags,
                )

                url = leetcode_url(
                    title,
                    row.get(url_col, "")
                    if url_col
                    else "",
                )

                frequency = 0

                if frequency_col:
                    raw_frequency = clean(
                        row.get(frequency_col)
                    )

                    raw_frequency = (
                        raw_frequency
                        .replace("%", "")
                        .strip()
                    )

                    try:
                        frequency = float(
                            raw_frequency
                        )
                    except:
                        frequency = 0

                key = slug(title)

                if key not in questions:
                    questions[key] = {
                        "id": key,
                        "title": title,
                        "difficulty": difficulty,
                        "topic": topic,
                        "frequency": frequency,
                        "tags": tags[:8],
                        "description": (
                            f"Solve the {title} problem."
                        ),
                        "leetcodeUrl": url,
                    }

                if frequency > questions[key]["frequency"]:
                    questions[key]["frequency"] = frequency

                if (
                    questions[key]["leetcodeUrl"]
                    .startswith(
                        "https://leetcode.com/problems/"
                    )
                    and url
                    != questions[key]["leetcodeUrl"]
                ):
                    questions[key]["leetcodeUrl"] = url

    except Exception as error:
        print(
            f"Skipped {csv_file}: {error}"
        )

for question in questions.values():

    question["tags"] = list(
        dict.fromkeys(
            question["tags"]
        )
    )

    if question["frequency"] > 100:
        question["frequency"] = 100

    question["frequency"] = int(
        round(question["frequency"])
    )

difficulty_order = {
    "Easy": 0,
    "Medium": 1,
    "Hard": 2,
}

final_questions = sorted(
    questions.values(),
    key=lambda question: (
        difficulty_order.get(
            question["difficulty"],
            1,
        ),
        question["topic"],
        question["title"].lower(),
    ),
)

lines = []

lines.append(
    'export type DsaDifficulty = "Easy" | "Medium" | "Hard";'
)
lines.append("")

lines.append(
    "export type DsaExample = {"
)
lines.append(
    "  input: string;"
)
lines.append(
    "  output: string;"
)
lines.append("};")
lines.append("")

lines.append(
    "export type DsaQuestion = {"
)
lines.append(
    "  id: string;"
)
lines.append(
    "  title: string;"
)
lines.append(
    "  difficulty: DsaDifficulty;"
)
lines.append(
    "  topic: string;"
)
lines.append(
    "  frequency: number;"
)
lines.append(
    "  tags: string[];"
)
lines.append(
    "  description: string;"
)
lines.append(
    "  examples: DsaExample[];"
)
lines.append(
    "  leetcodeUrl: string;"
)
lines.append("};")
lines.append("")

lines.append(
    "export const dsaQuestions: DsaQuestion[] = ["
)

for question in final_questions:

    title = json.dumps(
        question["title"],
        ensure_ascii=False,
    )

    question_id = json.dumps(
        question["id"],
        ensure_ascii=False,
    )

    difficulty = json.dumps(
        question["difficulty"],
        ensure_ascii=False,
    )

    topic = json.dumps(
        question["topic"],
        ensure_ascii=False,
    )

    description = json.dumps(
        question["description"],
        ensure_ascii=False,
    )

    tags = json.dumps(
        question["tags"],
        ensure_ascii=False,
    )

    leetcode = json.dumps(
        question["leetcodeUrl"],
        ensure_ascii=False,
    )

    lines.append("  {")

    lines.append(
        f"    id: {question_id},"
    )

    lines.append(
        f"    title: {title},"
    )

    lines.append(
        f"    difficulty: {difficulty},"
    )

    lines.append(
        f"    topic: {topic},"
    )

    lines.append(
        f"    frequency: {question['frequency']},"
    )

    lines.append(
        f"    tags: {tags},"
    )

    lines.append(
        f"    description: {description},"
    )

    lines.append(
        '    examples: [{ input: "See the original LeetCode problem", output: "See the original LeetCode problem" }],'
    )

    lines.append(
        f"    leetcodeUrl: {leetcode},"
    )

    lines.append("  },")

lines.append("];")
lines.append("")

lines.append(
    "export const dsaTopics = ["
)

lines.append('  "All",')
lines.append('  "Array",')
lines.append('  "String",')
lines.append('  "Linked List",')
lines.append('  "Stack",')
lines.append('  "Queue",')
lines.append('  "Binary Search",')
lines.append('  "Tree",')
lines.append('  "Trie",')
lines.append('  "Graph",')
lines.append('  "Dynamic Programming",')
lines.append('  "Heap",')
lines.append('  "Backtracking",')
lines.append('  "Sliding Window",')
lines.append('  "Two Pointers",')
lines.append('  "Greedy",')
lines.append('  "Intervals",')
lines.append('  "Bit Manipulation",')
lines.append('  "Matrix",')
lines.append('  "Math",')
lines.append('  "Other",')

lines.append("];")
lines.append("")

lines.append(
    "export const getDsaQuestion = (id: string) =>"
)
lines.append(
    "  dsaQuestions.find((question) => question.id === id);"
)
lines.append("")

OUT.parent.mkdir(
    parents=True,
    exist_ok=True,
)

OUT.write_text(
    "\n".join(lines),
    encoding="utf-8",
)

print(
    f"Generated {len(final_questions)} unique DSA questions."
)

print(
    f"Source CSV files: {len(csv_files)}"
)

print(
    f"Output: {OUT}"
)