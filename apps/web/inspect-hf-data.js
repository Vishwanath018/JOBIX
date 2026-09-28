const https = require("https");

const url =
  "https://huggingface.co/api/resolve-cache/datasets/kaysss/leetcode-problem-set/81f5c9e681bbcc6d334a17fc7d8666c9a039d7a8/data.csv?download=true";

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

      if (data.length >= 20000) {
        res.destroy();
      }
    });

    res.on("close", () => {
      console.log("HTTP:", res.statusCode);
      console.log("");
      console.log(data.slice(0, 20000));
    });

    res.on("error", (err) => {
      console.error(err.message);
      process.exit(1);
    });
  }
).on("error", (err) => {
  console.error("REQUEST FAILED");
  console.error(err.message);
  process.exit(1);
});
