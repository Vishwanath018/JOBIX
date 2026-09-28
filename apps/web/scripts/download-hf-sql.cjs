const fs = require("fs");

const url =
  "https://huggingface.co/datasets/kaysss/leetcode-problem-detailed/resolve/main/questions_detailed.csv";

async function main() {
  console.log("Downloading questions_detailed.csv...");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "JOBIX"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Hugging Face HTTP ${response.status}: ${await response.text()}`
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(
    "scripts\\questions_detailed.csv",
    buffer
  );

  console.log(
    `Downloaded ${(buffer.length / 1024 / 1024).toFixed(2)} MB`
  );

  const text = buffer.toString("utf8");

  const firstLines = text
    .split(/\r?\n/)
    .slice(0, 3);

  console.log("");
  console.log("CSV preview:");
  console.log("----------------------------------------");

  for (const line of firstLines) {
    console.log(line.slice(0, 3000));
  }

  console.log("----------------------------------------");
}

main().catch(error => {
  console.error("ERROR:", error.message);
  process.exit(1);
});
