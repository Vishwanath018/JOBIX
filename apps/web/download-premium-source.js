const fs = require("fs");
const https = require("https");

const sqlFile =
  "src/app/(dashboard)/interview-kit/sql/sql-questions.json";

const backupFile =
  "src/app/(dashboard)/interview-kit/sql/sql-questions.before-premium-filter.json";

const hfUrl =
  "https://huggingface.co/datasets/whiskwhite/leetcode-complete/resolve/main/data/train-00000-of-00001.parquet";

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          "User-Agent": "JOBIX-SQL-Filter/1.0"
        }
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return download(res.headers.location).then(resolve).catch(reject);
        }

        if (res.statusCode !== 200) {
          reject(
            new Error(`HTTP ${res.statusCode} while downloading dataset`)
          );
          return;
        }

        const chunks = [];

        res.on("data", (chunk) => chunks.push(chunk));

        res.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
      }
    ).on("error", reject);
  });
}

async function main() {
  console.log("Loading JOBIX SQL questions...");

  const questions = JSON.parse(
    fs.readFileSync(sqlFile, "utf8")
  );

  console.log(`JOBIX SQL questions: ${questions.length}`);

  console.log("");
  console.log("Downloading premium-aware LeetCode dataset...");
  console.log("Source: whiskwhite/leetcode-complete");

  const parquet = await download(hfUrl);

  const tempFile =
    "leetcode-complete-premium-source.parquet";

  fs.writeFileSync(tempFile, parquet);

  console.log(
    `Downloaded ${(parquet.length / 1024 / 1024).toFixed(2)} MB`
  );

  console.log("");
  console.log(
    "The dataset contains is_paid_only, so we now need to read the parquet."
  );
}

main().catch((error) => {
  console.error("");
  console.error("FAILED:");
  console.error(error.message);
  process.exit(1);
});
