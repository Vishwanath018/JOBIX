import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let browser;

  try {
    const body = await request.json();
    const resumeData = body.resumeData;
    const template = String(body.template || "4");
    const mode = String(body.mode || "scratch");

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is missing." },
        { status: 400 }
      );
    }

    browser = await chromium.launch({
      headless: true
    });

    const context = await browser.newContext({
      viewport: {
        width: 1400,
        height: 1200
      },
      deviceScaleFactor: 1
    });

    const page = await context.newPage();

    await page.addInitScript(
      ({ resumeData, template, mode }) => {
        sessionStorage.setItem(
          "jobix_resume_builder_data",
          JSON.stringify(resumeData)
        );
        sessionStorage.setItem(
          "jobix_resume_builder_template",
          template
        );
        sessionStorage.setItem(
          "jobix_resume_builder_mode",
          mode
        );
      },
      {
        resumeData,
        template,
        mode
      }
    );

    const url =
      `http://127.0.0.1:3000/resume-builder/editor` +
      `?preview=1&template=${encodeURIComponent(template)}` +
      `&mode=${encodeURIComponent(mode)}`;

    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000
    });

    if (!response || !response.ok()) {
      throw new Error(
        `Resume page failed to load. HTTP ${response?.status() || "unknown"}`
      );
    }

    await page.waitForSelector(".jobix-t4-preview", {
      state: "visible",
      timeout: 30000
    });

    await page.waitForSelector(".jobix-t4-page", {
      state: "visible",
      timeout: 30000
    });

    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
    });

    const info = await page.evaluate(() => {
      const preview = document.querySelector(".jobix-t4-preview");
      const pages = document.querySelectorAll(".jobix-t4-page");

      return {
        pages: pages.length,
        text: preview?.textContent?.trim().length || 0
      };
    });

    if (info.pages === 0) {
      throw new Error("No resume pages were rendered.");
    }

    if (info.text < 100) {
      throw new Error(
        `Resume rendered without enough content. Characters: ${info.text}`
      );
    }

    await page.evaluate(() => {
      const preview = document.querySelector(
        ".jobix-t4-preview"
      ) as HTMLElement | null;

      if (!preview) {
        throw new Error("Resume preview was not found.");
      }

      const printable = preview.cloneNode(true) as HTMLElement;

      document.body.innerHTML = "";
      document.body.appendChild(printable);

      const style = document.createElement("style");

      style.textContent = `
        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
        }

        body {
          overflow: visible !important;
        }

        .jobix-t4-preview {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #ffffff !important;
          transform: none !important;
          zoom: 1 !important;
          filter: none !important;
        }

        .jobix-t4-page {
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          padding: 5mm 6.5mm 7mm !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          background: #ffffff !important;
          box-shadow: none !important;
          position: relative !important;
          display: block !important;
          break-after: page !important;
          page-break-after: always !important;
        }

        .jobix-t4-page:last-child {
          break-after: auto !important;
          page-break-after: auto !important;
        }

        .jobix-t4-measure,
        .jobix-t4-page-number {
          display: none !important;
        }

        .jobix-t4-bullet-dot {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      `;

      document.head.appendChild(style);
    });

    await page.emulateMedia({
      media: "print"
    });

    await page.waitForTimeout(400);

    const finalInfo = await page.evaluate(() => ({
      pages: document.querySelectorAll(".jobix-t4-page").length,
      text: document.body.innerText.trim().length
    }));

    if (finalInfo.pages === 0 || finalInfo.text < 100) {
      throw new Error("Printable resume is empty.");
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm"
      }
    });

    if (!pdf.length) {
      throw new Error("Generated PDF is empty.");
    }

    await browser.close();
    browser = undefined;

    return new NextResponse(
      new Uint8Array(pdf),
      {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition":
            'attachment; filename="JOBIX-Resume.pdf"',
          "Cache-Control": "no-store",
          "Content-Length": String(pdf.length)
        }
      }
    );
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    const message =
      error instanceof Error
        ? error.message
        : "Unknown PDF generation error.";

    console.error(
      "JOBIX PDF EXPORT ERROR:",
      message
    );

    return NextResponse.json(
      {
        error: "PDF export failed.",
        message
      },
      {
        status: 500
      }
    );
  }
}
