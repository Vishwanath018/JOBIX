"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumePreviewPage() {
  const router = useRouter();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [template, setTemplate] = useState("4");
  const [mode, setMode] = useState("scratch");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTemplate(params.get("template") || "4");
    setMode(params.get("mode") === "existing" ? "existing" : "scratch");
  }, []);

  const editResume = () => {
    router.push(
      `/resume-builder/editor?template=${template}&mode=${mode}`
    );
  };

  const getResumeDocument = () => {
    const frame = frameRef.current;
    const sourceDocument = frame?.contentDocument;

    if (!sourceDocument) {
      return null;
    }

    const pages = Array.from(
      sourceDocument.querySelectorAll(".jobix-t4-page")
    );

    if (!pages.length) {
      return null;
    }

    const styles = Array.from(
      sourceDocument.querySelectorAll("style")
    )
      .map((style) => style.textContent || "")
      .join("\n");

    const content = pages
      .map((page) => {
        const clone = page.cloneNode(true) as HTMLElement;

        clone
          .querySelectorAll(".jobix-t4-page-number")
          .forEach((element) => element.remove());

        return clone.innerHTML;
      })
      .join("\n");

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>JOBIX Resume</title>

<style>
${styles}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #ffffff;
  width: 100%;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #111111;
}

.jobix-export {
  width: 210mm;
  margin: 0 auto;
  padding: 0;
  background: #ffffff;
}

.jobix-export-content {
  width: 210mm;
  margin: 0;
  padding: 5mm 6.5mm 7mm;
  background: #ffffff;
  box-sizing: border-box;
  overflow: visible;
}

.jobix-export-content .jobix-t4-page {
  display: contents !important;
  width: auto !important;
  height: auto !important;
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: visible !important;
  background: transparent !important;
  box-shadow: none !important;
  position: static !important;
}

.jobix-export-content .jobix-t4-page-number {
  display: none !important;
}

.jobix-export-content .jobix-t4-measure {
  display: none !important;
}

.jobix-export-content .jobix-t4-header {
  break-inside: avoid;
  page-break-inside: avoid;
}

.jobix-export-content .jobix-t4-heading {
  break-after: avoid;
  page-break-after: avoid;
}

.jobix-export-content .jobix-t4-entry {
  break-inside: avoid;
  page-break-inside: avoid;
}

.jobix-export-content .jobix-t4-skills {
  break-inside: avoid;
  page-break-inside: avoid;
}

.jobix-export-content .jobix-t4-languages {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  break-inside: avoid;
  page-break-inside: avoid;
}

.jobix-export-content .jobix-t4-languages * {
  visibility: visible !important;
  opacity: 1 !important;
}

@page {
  size: A4;
  margin: 0;
}

@media print {
  html,
  body {
    width: 210mm;
    margin: 0;
    padding: 0;
  }

  .jobix-export {
    width: 210mm;
    margin: 0;
    padding: 0;
  }

  .jobix-export-content {
    width: 210mm;
    margin: 0;
    padding: 5mm 6.5mm 7mm;
  }
}
</style>
</head>

<body>
  <div class="jobix-export">
    <div class="jobix-export-content">
      ${content}
    </div>
  </div>
</body>
</html>`;
  };

  const exportPdf = () => {
    const html = getResumeDocument();

    if (!html) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=1200"
    );

    if (!printWindow) {
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
    };
  };

  const exportWord = () => {
    const html = getResumeDocument();

    if (!html) {
      return;
    }

    const blob = new Blob([html], {
      type: "application/msword;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "JOBIX_Resume.doc";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#f4f6f9] text-[#172033]">
      <style>{`
        .jobix-preview-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .jobix-preview-header {
          min-height: 76px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 0 32px;
          background: #ffffff;
          border-bottom: 1px solid #e4e7ec;
        }

        .jobix-preview-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .jobix-preview-logo {
          width: 42px;
          height: 42px;
          object-fit: contain;
          flex: 0 0 42px;
        }

        .jobix-preview-title {
          font-size: 21px;
          line-height: 26px;
          font-weight: 900;
          color: #101828;
        }

        .jobix-preview-subtitle {
          margin-top: 2px;
          font-size: 11px;
          color: #667085;
          font-weight: 600;
        }

        .jobix-preview-actions {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .jobix-preview-button {
          height: 42px;
          padding: 0 16px;
          border-radius: 9px;
          border: 1px solid #d0d5dd;
          background: #ffffff;
          color: #344054;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .jobix-preview-button:hover {
          background: #f8fafc;
        }

        .jobix-preview-button-primary {
          border-color: #111827;
          background: #111827;
          color: #ffffff;
        }

        .jobix-preview-button-primary:hover {
          background: #000000;
        }

        .jobix-preview-content {
          flex: 1;
          padding: 28px 24px 50px;
          overflow: auto;
        }

        .jobix-preview-heading {
          max-width: 1250px;
          margin: 0 auto 20px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .jobix-preview-heading h1 {
          margin: 0;
          font-size: 25px;
          line-height: 31px;
          font-weight: 900;
          color: #101828;
        }

        .jobix-preview-heading p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #667085;
        }

        .jobix-preview-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 11px;
          font-weight: 800;
        }

        .jobix-preview-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #12b76a;
        }

        .jobix-preview-frame-wrap {
          width: min(1250px, 100%);
          height: calc(100vh - 180px);
          min-height: 650px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid #dfe4ea;
          border-radius: 14px;
          background: #eef2f6;
          box-shadow: 0 8px 24px rgba(16,24,40,.08);
        }

        .jobix-preview-frame {
          width: 100%;
          height: 100%;
          border: 0;
          background: #eef2f6;
        }

        @media (max-width: 760px) {
          .jobix-preview-header {
            padding: 14px 16px;
            align-items: flex-start;
            flex-direction: column;
          }

          .jobix-preview-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .jobix-preview-content {
            padding: 20px 12px 30px;
          }

          .jobix-preview-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .jobix-preview-frame-wrap {
            min-height: 600px;
            height: 72vh;
          }
        }
      
        .jobix-export .jobix-t4-heading {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .jobix-export .jobix-t4-icon {
          width: 16px !important;
          height: 16px !important;
          min-width: 16px !important;
          min-height: 16px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: #111827 !important;
          color: #ffffff !important;
          font-size: 8px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          overflow: hidden !important;
          flex: 0 0 16px !important;
        }

        .jobix-export .jobix-t4-heading span:last-child {
          color: #111111 !important;
          font-weight: 800 !important;
        }


        .jobix-export-content .jobix-t4-heading {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .jobix-export-content .jobix-t4-heading .jobix-t4-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 16px !important;
          height: 16px !important;
          min-width: 16px !important;
          min-height: 16px !important;
          flex: 0 0 16px !important;
          border-radius: 50% !important;
          background: #111827 !important;
          color: #ffffff !important;
          font-size: 8px !important;
          line-height: 16px !important;
          font-weight: 800 !important;
          text-align: center !important;
          overflow: hidden !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .jobix-export-content .jobix-t4-heading .jobix-t4-icon svg {
          width: 9px !important;
          height: 9px !important;
          max-width: 9px !important;
          max-height: 9px !important;
          stroke: #ffffff !important;
          fill: none !important;
        }

        .jobix-export-content .jobix-t4-heading .jobix-t4-icon svg * {
          stroke: #ffffff !important;
          fill: none !important;
        }

        .jobix-export-content .jobix-t4-heading > span:last-child {
          color: #111111 !important;
          font-weight: 800 !important;
        }


        .jobix-export-content .jobix-t4-heading {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .jobix-export-content .jobix-t4-heading .jobix-t4-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 16px !important;
          height: 16px !important;
          min-width: 16px !important;
          min-height: 16px !important;
          flex: 0 0 16px !important;
          border-radius: 50% !important;
          background: #111827 !important;
          color: #ffffff !important;
          font-size: 8px !important;
          line-height: 16px !important;
          font-weight: 800 !important;
          text-align: center !important;
          overflow: hidden !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        .jobix-export-content .jobix-t4-heading .jobix-t4-icon svg {
          width: 9px !important;
          height: 9px !important;
          max-width: 9px !important;
          max-height: 9px !important;
          stroke: #ffffff !important;
          fill: none !important;
        }

        .jobix-export-content .jobix-t4-heading .jobix-t4-icon svg * {
          stroke: #ffffff !important;
          fill: none !important;
        }

        .jobix-export-content .jobix-t4-heading > span:last-child {
          color: #111111 !important;
          font-weight: 800 !important;
        }


        .jobix-export-content .jobix-t4-heading {
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }

        .jobix-export-content .jobix-t4-icon {
          width: 17px !important;
          height: 17px !important;
          min-width: 17px !important;
          min-height: 17px !important;
          flex: 0 0 17px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: #111827 !important;
          background-color: #111827 !important;
          color: #ffffff !important;
          border: 1px solid #111827 !important;
          box-shadow: inset 0 0 0 1px #111827 !important;
          font-size: 7px !important;
          line-height: 17px !important;
          font-weight: 800 !important;
          text-align: center !important;
          overflow: hidden !important;
          opacity: 1 !important;
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .jobix-export-content .jobix-t4-icon svg {
          width: 9px !important;
          height: 9px !important;
          min-width: 9px !important;
          min-height: 9px !important;
          display: block !important;
          stroke: #ffffff !important;
          fill: none !important;
          color: #ffffff !important;
        }

        .jobix-export-content .jobix-t4-icon svg *,
        .jobix-export-content .jobix-t4-icon svg path,
        .jobix-export-content .jobix-t4-icon svg line,
        .jobix-export-content .jobix-t4-icon svg circle,
        .jobix-export-content .jobix-t4-icon svg rect,
        .jobix-export-content .jobix-t4-icon svg polyline {
          stroke: #ffffff !important;
          fill: none !important;
        }

        .jobix-export-content .jobix-t4-heading > span:last-child {
          color: #111111 !important;
          font-weight: 800 !important;
        }

        @media print {
          .jobix-export-content .jobix-t4-icon {
            background: #111827 !important;
            background-color: #111827 !important;
            border-color: #111827 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

`}</style>

      <div className="jobix-preview-page">
        <header className="jobix-preview-header">
          <div className="jobix-preview-brand">
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="jobix-preview-logo"
            />
            <div>
              <div className="jobix-preview-title">
                Resume Preview
              </div>
              <div className="jobix-preview-subtitle">
                Your completed resume
              </div>
            </div>
          </div>

          <div className="jobix-preview-actions">
            <button
              type="button"
              className="jobix-preview-button"
              onClick={editResume}
            >
              Edit Resume
            </button>

            <button
              type="button"
              className="jobix-preview-button"
              onClick={exportPdf}
            >
              Export PDF
            </button>

            <button
              type="button"
              className="jobix-preview-button jobix-preview-button-primary"
              onClick={exportWord}
            >
              Export Word
            </button>
          </div>
        </header>

        <section className="jobix-preview-content">
          <div className="jobix-preview-heading">
            <div>
              <h1>Review your resume</h1>
              <p>
                Check the final layout before exporting your resume.
              </p>
            </div>

            <div className="jobix-preview-status">
              <span className="jobix-preview-status-dot" />
              {ready ? "Ready to export" : "Preparing preview"}
            </div>
          </div>

          <div className="jobix-preview-frame-wrap">
            <iframe
              ref={frameRef}
              className="jobix-preview-frame"
              title="JOBIX Resume Preview"
              src={`/resume-builder/editor?preview=1&template=${template}&mode=${mode}`}
              onLoad={() => setReady(true)}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
