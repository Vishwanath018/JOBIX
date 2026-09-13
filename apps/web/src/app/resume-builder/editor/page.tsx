"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeEditorPage() {
  const router = useRouter();
  const [template, setTemplate] = useState<string | null>(null);
  const [mode, setMode] = useState("scratch");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setTemplate(params.get("template"));
    setMode(params.get("mode") === "existing" ? "existing" : "scratch");
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#07143b]">
      <header className="border-b border-[#dce5ef] bg-white">
        <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-3">
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="h-[50px] w-[50px] rounded-xl object-contain"
            />

            <div>
              <div className="text-[24px] font-extrabold">JOBIX</div>
              <div className="text-[10px] font-semibold tracking-[0.2em]">
                CAREER
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              router.push(
                "/resume-builder/templates?mode=" + mode
              )
            }
            className="rounded-xl border border-[#d9e2ed] bg-white px-5 py-3 text-sm font-extrabold transition hover:bg-[#f4f7fb]"
          >
            ← Templates
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1769ff]">
          Resume Editor
        </p>

        <h1 className="mt-3 text-4xl font-extrabold">
          {template ? "Template " + template + " selected" : "Resume Editor"}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-[#7183a3]">
          Your selected resume template is ready. The resume editing workspace
          will be connected here next.
        </p>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[#dce5ef] bg-white p-8 shadow-sm">
          <div className="aspect-[0.72] overflow-hidden rounded-xl bg-[#eef2f7]">
            {template && (
              <img
                src={`/resume-templates/template-${template.padStart(2, "0")}.jpg`}
                alt="Selected resume template"
                className="h-full w-full object-cover object-top"
              />
            )}
          </div>

          <button
            onClick={() =>
              router.push(
                "/resume-builder/templates?mode=" + mode
              )
            }
            className="mt-6 w-full rounded-xl bg-[#07143b] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#102252]"
          >
            Choose Another Template
          </button>
        </div>
      </section>
    </main>
  );
}
