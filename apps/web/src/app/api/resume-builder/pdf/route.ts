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

    const resumeInfo = await page.evaluate(() => {
      const pages = document.querySelectorAll(".jobix-t4-page");
      const preview = document.querySelector(".jobix-t4-preview");

      return {
        pages: pages.length,
        text: preview?.textContent?.trim().length || 0
      };
    });

    console.log(
      "JOBIX PDF RENDER:",
      JSON.stringify(resumeInfo)
    );

    if (resumeInfo.pages === 0) {
      throw new Error("No A4 resume pages were rendered.");
    }

    if (resumeInfo.text < 100) {
      throw new Error(
        `Resume rendered without enough text. Characters: ${resumeInfo.text}`
      );
    }

    await page.emulateMedia({
      media: "print"
    });

    await page.evaluate(() => {
      const preview = document.querySelector(
        ".jobix-t4-preview"
      ) as HTMLElement | null;

      if (!preview) {
        throw new Error("Template 4 preview was not found.");
      }

      const printable = preview.cloneNode(true) as HTMLElement;

      document.body.innerHTML = "";
      document.body.appendChild(printable);

      document.documentElement.style.margin = "0";
      document.documentElement.style.padding = "0";
      document.documentElement.style.width = "210mm";
      document.documentElement.style.background = "#ffffff";

      document.body.style.margin = "0";
      document.body.style.padding = "0";
      document.body.style.width = "210mm";
      document.body.style.background = "#ffffff";
      document.body.style.overflow = "visible";

      printable.style.display = "block";
      printable.style.width = "210mm";
      printable.style.margin = "0";
      printable.style.padding = "0";
      printable.style.background = "#ffffff";
      printable.style.transform = "none";
      printable.style.zoom = "1";

      printable
        .querySelectorAll(".jobix-t4-page")
        .forEach((element) => {
          const resumePage = element as HTMLElement;

          resumePage.style.display = "block";
          resumePage.style.width = "210mm";
          resumePage.style.height = "297mm";
          resumePage.style.minHeight = "297mm";
          resumePage.style.maxHeight = "297mm";
          resumePage.style.margin = "0";
          resumePage.style.boxSizing = "border-box";
          resumePage.style.overflow = "hidden";
          resumePage.style.breakAfter = "page";
          resumePage.style.pageBreakAfter = "always";
        });

      const pages = printable.querySelectorAll(
        ".jobix-t4-page"
      );

      if (pages.length) {
        const lastPage = pages[pages.length - 1] as HTMLElement;
        lastPage.style.breakAfter = "auto";
        lastPage.style.pageBreakAfter = "auto";
      }

      const measure = printable.querySelector(
        ".jobix-t4-measure"
      ) as HTMLElement | null;

      if (measure) {
        measure.style.display = "none";
      }
    });

    await page.waitForTimeout(500);

    const finalInfo = await page.evaluate(() => ({
      pages: document.querySelectorAll(".jobix-t4-page").length,
      text: document.body.innerText.trim().length,
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    }));

    console.log(
      "JOBIX PDF FINAL:",
      JSON.stringify(finalInfo)
    );

    if (finalInfo.pages === 0 || finalInfo.text < 100) {
      throw new Error(
        `Printable resume is empty. Pages: ${finalInfo.pages}, characters: ${finalInfo.text}`
      );
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm"
      }
    });

    console.log(
      "JOBIX PDF CREATED:",
      pdf.length,
      "bytes"
    );

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
