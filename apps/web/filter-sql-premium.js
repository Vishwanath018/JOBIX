const fs = require("fs");
const https = require("https");

const sqlFile =
  "src/app/(dashboard)/interview-kit/sql/sql-questions.json";

const backupFile =
  "src/app/(dashboard)/interview-kit/sql/sql-questions.before-premium-filter.json";

const sourceUrl =
  "https://huggingface.co/api/resolve-cache/datasets/kaysss/leetcode-problem-set/81f5c9e681bbcc6d334a17fc7d8666c9a039d7a8/data.csv?download=true";

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "JOBIX-SQL-Practice/1.0"
        }
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return download(res.headers.location)
            .then(resolve)
            .catch(reject);
        }

        if (res.statusCode !== 200) {
          reject(
            new Error(`HTTP ${res.statusCode}: ${res.statusMessage || ""}`)
          );
          return;
        }

        const chunks = [];

        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }
    ).on("error", reject);
  });
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;

      row.push(cell);
      cell = "";

      if (row.length) rows.push(row);

      row = [];
      continue;
    }

    cell += c;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

async function main() {
  const questions = JSON.parse(
    fs.readFileSync(sqlFile, "utf8")
  );

  console.log(`JOBIX SQL questions before filter: ${questions.length}`);

  if (!fs.existsSync(backupFile)) {
    fs.copyFileSync(sqlFile, backupFile);
  }

  console.log("Downloading premium metadata...");

  const buffer = await download(sourceUrl);
  const csv = buffer.toString("utf8");

  console.log(
    `Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB`
  );

  const rows = parseCSV(csv);

  const headers = rows[0];

  console.log(`Metadata rows: ${rows.length - 1}`);

  const slugIndex = headers.indexOf("titleSlug");
  const paidIndex = headers.indexOf("paidOnly");

  if (slugIndex === -1) {
    throw new Error("titleSlug column not found.");
  }

  if (paidIndex === -1) {
    throw new Error("paidOnly column not found.");
  }

  const premiumSlugs = new Set();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const slug = row[slugIndex]?.trim();
    const paid = row[paidIndex]?.trim().toLowerCase();

    if (
      slug &&
      (paid === "true" ||
        paid === "1" ||
        paid === "yes")
    ) {
      premiumSlugs.add(slug);
    }
  }

  console.log(
    `Premium questions in source: ${premiumSlugs.size}`
  );

  const removed = questions.filter((q) =>
    premiumSlugs.has(q.slug)
  );

  const kept = questions.filter(
    (q) => !premiumSlugs.has(q.slug)
  );

  fs.writeFileSync(
    sqlFile,
    JSON.stringify(kept, null, 2),
    "utf8"
  );

  console.log("");
  console.log("========================================");
  console.log("JOBIX SQL PREMIUM FILTER");
  console.log("========================================");
  console.log(`Before:    ${questions.length}`);
  console.log(`Removed:   ${removed.length}`);
  console.log(`Remaining: ${kept.length}`);
  console.log("========================================");
  console.log("");

  removed.forEach((q) => {
    console.log(
      `REMOVED: ${q.number} - ${q.title} - ${q.slug}`
    );
  });

  console.log("");
  console.log(`Backup: ${backupFile}`);
}

main().catch((error) => {
  console.error("");
  console.error("FILTER FAILED");
  console.error(error.message);
  process.exit(1);
});
