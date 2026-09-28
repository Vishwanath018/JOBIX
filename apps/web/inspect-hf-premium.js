const https = require("https");

const url =
  "https://huggingface.co/api/datasets/kaysss/leetcode-problem-set/tree/main?recursive=true&expand=false";

https.get(
  url,
  {
    headers: {
      "User-Agent": "JOBIX-Premium-Dataset-Inspector/1.0"
    }
  },
  (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode !== 200) {
        console.error(`HTTP ${res.statusCode}`);
        console.error(data);
        process.exit(1);
      }

      const files = JSON.parse(data);

      console.log("HUGGING FACE REPOSITORY FILES");
      console.log("==============================");

      files
        .filter((x) => x.type === "file")
        .forEach((x) => console.log(x.path));
    });
  }
).on("error", (err) => {
  console.error("REQUEST FAILED");
  console.error(err.message);
  process.exit(1);
});
