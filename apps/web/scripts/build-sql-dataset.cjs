const fs = require("fs");
const path = require("path");

const DATASET_URL =
  "https://huggingface.co/datasets/kaysss/leetcode-problem-detailed/resolve/main/data.json";

async function main() {
  console.log("Downloading LeetCode dataset from Hugging Face...");

  const response = await fetch(DATASET_URL, {
    headers: {
      "User-Agent": "JOBIX"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Hugging Face HTTP ${response.status}: ${await response.text()}`
    );
  }

  const raw = await response.text();

  let data;

  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      "Hugging Face response is not a JSON dataset."
    );
  }

  const rows = Array.isArray(data)
    ? data
    : data.data || data.rows || [];

  console.log(`Dataset records found: ${rows.length}`);

  const sqlQuestions = [];

  for (const row of rows) {
    const item = row?.question || row;

    if (!item || typeof item !== "object") continue;

    const title =
      item.title ||
      item.questionTitle ||
      item.name;

    const slug =
      item.titleSlug ||
      item.slug ||
      item.title_slug;

    const content =
      item.content ||
      item.description ||
      item.problem ||
      item.question;

    const topicTags =
      item.topicTags ||
      item.topic_tags ||
      item.topics ||
      [];

    const tags = Array.isArray(topicTags)
      ? topicTags.map(tag =>
          typeof tag === "string"
            ? tag
            : tag?.name || tag?.slug || ""
        )
      : [];

    const isSQL =
      tags.some(tag =>
        String(tag)
          .toLowerCase()
          .includes("database")
      ) ||
      tags.some(tag =>
        String(tag)
          .toLowerCase()
          .includes("sql")
      ) ||
      String(item.category || "")
        .toLowerCase()
        .includes("database") ||
      String(item.topic || "")
        .toLowerCase()
        .includes("database") ||
      String(item.title || "")
        .toLowerCase()
        .includes("sql");

    if (!isSQL || !title || !slug) continue;

    const examples =
      item.examples ||
      item.example ||
      [];

    const companies =
      item.companies ||
      item.companyTags ||
      item.company_tags ||
      [];

    const companyList = Array.isArray(companies)
      ? companies.map(company =>
          typeof company === "string"
            ? company
            : company?.name || ""
        ).filter(Boolean)
      : [];

    sqlQuestions.push({
      id:
        item.id ||
        `sql-${slug}`,

      number:
        item.questionFrontendId ||
        item.questionNumber ||
        item.id ||
        "",

      title,

      slug,

      difficulty:
        item.difficulty ||
        "Unknown",

      topic:
        "Database",

      topics:
        tags.filter(Boolean),

      companies:
        companyList,

      leetcodeUrl:
        item.leetcodeUrl ||
        item.url ||
        `https://leetcode.com/problems/${slug}/`,

      statement:
        content || "",

      examples,

      constraints:
        item.constraints ||
        [],

      schema:
        item.schema ||
        item.mysqlSchema ||
        item.mysqlSchemas ||
        item.dataSchema ||
        "",

      mysql:
        item.mysql ||
        item.mysqlCode ||
        item.solution ||
        "",

      starterCode:
        item.starterCode ||
        item.code ||
        "",

      source:
        "LeetCode / Hugging Face: kaysss/leetcode-problem-detailed"
    });
  }

  const unique = [];
  const seen = new Set();

  for (const question of sqlQuestions) {
    const key =
      question.slug ||
      question.title.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    unique.push(question);
  }

  unique.sort((a, b) => {
    const na = Number(a.number);
    const nb = Number(b.number);

    if (
      Number.isFinite(na) &&
      Number.isFinite(nb)
    ) {
      return na - nb;
    }

    return a.title.localeCompare(b.title);
  });

  const destination = path.resolve(
    "src/app/(dashboard)/interview-kit/sql/sql-questions.json"
  );

  fs.mkdirSync(
    path.dirname(destination),
    { recursive: true }
  );

  fs.writeFileSync(
    destination,
    JSON.stringify(unique, null, 2),
    "utf8"
  );

  console.log("");
  console.log(
    `SUCCESS: ${unique.length} SQL questions extracted.`
  );
  console.log(
    `Saved to: ${destination}`
  );

  if (unique.length < 300) {
    console.log("");
    console.log(
      "WARNING: This dataset contains fewer than 300 SQL questions."
    );
    console.log(
      "We will NOT invent questions to reach 300."
    );
  }
}

main().catch(error => {
  console.error("");
  console.error("ERROR:", error.message);
  process.exit(1);
});
