const fs = require("fs");

const file = "src/app/(dashboard)/interview-kit/sql/sql-questions.json";
const backup = "src/app/(dashboard)/interview-kit/sql/sql-questions.before-leetcode-lock-filter.json";

async function main() {
  const questions = JSON.parse(fs.readFileSync(file, "utf8"));

  if (!fs.existsSync(backup)) {
    fs.copyFileSync(file, backup);
  }

  const query = `
    query problemsetQuestionList(
      $categorySlug: String
      $limit: Int
      $skip: Int
      $filters: QuestionListFilterInput
    ) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          questionFrontendId
          title
          titleSlug
          isPaidOnly
          difficulty
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "JOBIX-SQL-Practice/1.0"
    },
    body: JSON.stringify({
      query,
      variables: {
        categorySlug: "database",
        skip: 0,
        limit: 1000,
        filters: {}
      },
      operationName: "problemsetQuestionList"
    })
  });

  if (!response.ok) {
    throw new Error(
      `LeetCode HTTP ${response.status}: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }

  const leetcodeQuestions =
    result?.data?.problemsetQuestionList?.questions || [];

  if (!leetcodeQuestions.length) {
    throw new Error("LeetCode returned 0 questions. Dataset was NOT modified.");
  }

  const paidSlugs = new Set(
    leetcodeQuestions
      .filter((q) => q.isPaidOnly === true)
      .map((q) => q.titleSlug)
  );

  const removed = questions.filter((q) => paidSlugs.has(q.slug));
  const kept = questions.filter((q) => !paidSlugs.has(q.slug));

  fs.writeFileSync(file, JSON.stringify(kept, null, 2), "utf8");

  console.log("");
  console.log("========================================");
  console.log("JOBIX SQL LEETCODE PREMIUM FILTER");
  console.log("========================================");
  console.log(`JOBIX questions before : ${questions.length}`);
  console.log(`LeetCode DB questions  : ${leetcodeQuestions.length}`);
  console.log(`Premium/locked found   : ${removed.length}`);
  console.log(`Free questions kept    : ${kept.length}`);
  console.log("========================================");
  console.log("");

  if (removed.length) {
    console.log("REMOVED PREMIUM QUESTIONS:");
    removed.forEach((q) => {
      console.log(`${q.number} - ${q.title} (${q.slug})`);
    });
  } else {
    console.log("No premium questions matched your JOBIX dataset.");
  }

  console.log("");
  console.log(`Backup: ${backup}`);
}

main().catch((error) => {
  console.error("");
  console.error("FILTER FAILED");
  console.error(error.message);
  process.exit(1);
});
