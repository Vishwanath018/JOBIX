const API = "https://huggingface.co/api/datasets/kaysss/leetcode-problem-detailed";

async function main() {
  console.log("Checking Hugging Face dataset...");

  const response = await fetch(API, {
    headers: {
      "User-Agent": "JOBIX"
    }
  });

  const text = await response.text();

  console.log("HTTP:", response.status);

  if (!response.ok) {
    console.log(text);
    process.exit(1);
  }

  const data = JSON.parse(text);

  console.log("");
  console.log("Dataset:", data.id);
  console.log("Private:", data.private);
  console.log("");

  console.log("Repository files:");

  for (const sibling of data.siblings || []) {
    console.log(sibling.rfilename);
  }
}

main().catch(error => {
  console.error("ERROR:", error.message);
  process.exit(1);
});
