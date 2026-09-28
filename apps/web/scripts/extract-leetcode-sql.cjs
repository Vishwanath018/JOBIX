const fs = require("fs");

const input = "scripts\\questions_detailed.csv";
const output = "src\\app\\(dashboard)\\interview-kit\\sql\\sql-questions.json";

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (quoted && next === '"') {
        field += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;

      row.push(field);
      field = "";

      if (row.some(x => x.trim() !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function cleanHtml(html) {
  return (html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseJSON(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function isSQL(row, header) {
  const category = String(
    row[header.category] || ""
  ).toLowerCase();

  const tags = String(
    row[header.topicTags] || ""
  ).toLowerCase();

  const schema = String(
    row[header.mysqlSchemas] || ""
  ).toLowerCase();

  const codeDefinition = String(
    row[header.codeDefinition] || ""
  ).toLowerCase();

  return (
    category.includes("database") ||
    category.includes("sql") ||
    tags.includes("database") ||
    tags.includes("sql") ||
    schema.includes("create table") ||
    codeDefinition.includes("mysql")
  );
}

function parseTags(value) {
  if (!value) return [];

  const parsed = parseJSON(value, null);

  if (Array.isArray(parsed)) {
    return parsed
      .map(x => {
        if (typeof x === "string") return x;

        return (
          x?.name ||
          x?.slug ||
          ""
        );
      })
      .filter(Boolean);
  }

  return String(value)
    .split(/[;,|]/)
    .map(x => x.trim())
    .filter(Boolean);
}

const csv = fs.readFileSync(input, "utf8");

const rows = parseCSV(csv);

if (rows.length < 2) {
  throw new Error("CSV contains no usable records.");
}

const columns = rows[0];

const header = {};

columns.forEach((name, index) => {
  header[name.trim()] = index;
});

console.log("CSV columns:");
console.log(columns.join(", "));

console.log("");
console.log(`Total records: ${rows.length - 1}`);

const sqlQuestions = [];

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];

  if (!isSQL(row, header)) {
    continue;
  }

  const id =
    row[header.questionFrontendId]?.trim();

  const title =
    row[header.questionTitle]?.trim();

  const slug =
    row[header.TitleSlug]?.trim();

  if (!id || !title || !slug) {
    continue;
  }

  const content =
    row[header.content] || "";

  const tags =
    parseTags(row[header.topicTags]);

  const mysqlSchema =
    row[header.mysqlSchemas] || "";

  const codeDefinition =
    row[header.codeDefinition] || "";

  const sampleTestCase =
    row[header.sampleTestCase] || "";

  const metadata =
    row[header.metaData] || "";

  sqlQuestions.push({
    id: `sql-${id}-${slug}`,

    number: id,

    title,

    slug,

    difficulty:
      row[header.difficulty] ||
      "Unknown",

    topic: "Database",

    topics: tags,

    leetcodeUrl:
      `https://leetcode.com/problems/${slug}/`,

    statement:
      cleanHtml(content),

    mysqlSchema,

    sampleTestCase,

    codeDefinition,

    metadata,

    acceptanceRate:
      Number(row[header.acRate]) || 0,

    totalAccepted:
      Number(row[header.totalAcceptedRaw]) || 0,

    totalSubmission:
      Number(row[header.totalSubmissionRaw]) || 0,

    source:
      "LeetCode dataset: kaysss/leetcode-problem-detailed"
  });
}

const unique = [];
const seen = new Set();

for (const question of sqlQuestions) {
  const key = question.slug.toLowerCase();

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

fs.mkdirSync(
  require("path").dirname(output),
  { recursive: true }
);

fs.writeFileSync(
  output,
  JSON.stringify(unique, null, 2),
  "utf8"
);

console.log("");
console.log(
  `SQL questions extracted: ${unique.length}`
);

console.log(
  `Saved: ${output}`
);

console.log("");

const difficulty = {};

for (const question of unique) {
  difficulty[question.difficulty] =
    (difficulty[question.difficulty] || 0) + 1;
}

console.log("Difficulty:");
console.log(difficulty);

console.log("");

if (unique.length < 300) {
  console.log(
    "NOTE: The source dataset contains fewer than 300 SQL/database records."
  );
  console.log(
    "We will not fabricate additional LeetCode questions."
  );
}
