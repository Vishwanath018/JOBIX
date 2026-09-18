const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 1000
    }
  });

  await page.goto(
    "http://localhost:3000/resume-builder/preview",
    {
      waitUntil: "networkidle"
    }
  );

  const iframe = page.locator("iframe");

  if (await iframe.count()) {
    const frame = page.frames()[1];

    if (!frame) {
      throw new Error("Resume iframe was not found.");
    }

    await frame.waitForSelector(".jobix-t4-page", {
      timeout: 15000
    });

    await frame.evaluate(() => {
      document.body.style.zoom = "1";

      document.querySelectorAll(".jb-resume-wrap").forEach((element) => {
        element.style.zoom = "1";
        element.style.transform = "none";
      });
    });
  } else {
    await page.waitForSelector(".jobix-t4-page", {
      timeout: 15000
    });
  }

  const output = "C:\\Users\\vishw\\Downloads\\JOBIX-terminal-test.pdf";

  await page.pdf({
    path: output,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0"
    }
  });

  console.log("");
  console.log("PDF CREATED:");
  console.log(output);
  console.log("");

  await browser.close();
})();
