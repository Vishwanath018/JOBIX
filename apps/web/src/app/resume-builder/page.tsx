"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResumeBuilderPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f7faff] text-[#10245b]">
      <header className="h-[76px] border-b border-[#dfe7f2] bg-white">
        <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-8">
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="flex items-center gap-3"
          >
            <Image
              src="/jobix-logo.png"
              alt="JOBIX"
              width={52}
              height={52}
              priority
              className="h-[46px] w-[46px] rounded-[11px] object-contain"
            />

            <div className="flex flex-col leading-none">
              <span className="text-[25px] font-extrabold tracking-[-0.04em] text-[#10245b]">
                JOBIX
              </span>
              <span className="mt-[3px] text-[10px] font-semibold tracking-[0.28em] text-[#7183a3]">
                CAREER
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push("/home")}
            className="rounded-xl border border-[#cfdced] bg-white px-5 py-2.5 text-[15px] font-bold text-[#10245b] transition hover:border-[#1768ed] hover:text-[#1768ed]"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-76px)] overflow-hidden">
        <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#e9f2ff]" />
        <div className="pointer-events-none absolute -right-36 top-[310px] h-80 w-80 rounded-full bg-[#eef6ff]" />
        <div className="pointer-events-none absolute -bottom-44 -left-20 h-80 w-80 rounded-full bg-[#edf8f3]" />

        <div className="relative mx-auto max-w-[1040px] px-6 pb-8 pt-6">
          <div className="text-center">
            <div className="inline-flex rounded-full bg-[#e8f0ff] px-5 py-2 text-[14px] font-bold tracking-[0.08em] text-[#1768ed]">
              RESUME BUILDER
            </div>

            <h1 className="mx-auto mt-5 max-w-[950px] text-[34px] font-extrabold leading-[1.12] tracking-[-0.035em] text-[#10245b] md:text-[40px]">
              Let&apos;s get started with{" "}
              <span className="text-[#1768ed]">your resume</span>
            </h1>

            <p className="mx-auto mt-4 text-[14px] leading-5 text-[#657aa1]">
              Choose the best way to create or improve your resume. You can
              always switch later.
            </p>
          </div>

          <div className="mx-auto mt-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1768ed] text-[14px] font-bold text-white shadow-[0_5px_15px_rgba(23,104,237,0.18)]">
                1
              </div>

              <span className="text-[14px] font-bold text-[#1768ed]">
                Choose your starting point
              </span>
            </div>

            <div className="h-px w-14 bg-[#b9cef0]" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4dfef] bg-white text-[16px] font-bold text-[#7890b4]">
                2
              </div>

              <span className="text-[14px] font-semibold text-[#7890b4]">
                Build your resume
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-[#d9e6f7] bg-white p-5 shadow-[0_8px_28px_rgba(40,75,120,0.07)]">
              <div className="flex items-start justify-between">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] bg-[#e8f0ff]">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1768ed"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h8" />
                    <path d="M8 17h6" />
                  </svg>
                </div>

                <span className="rounded-full bg-[#e8f0ff] px-4 py-2 text-[13px] font-bold text-[#1768ed]">
                  Recommended
                </span>
              </div>

              <h2 className="mt-5 text-[21px] font-extrabold tracking-[-0.025em] text-[#10245b]">
                Build Resume from Scratch
              </h2>

              <p className="mt-2 text-[14px] leading-5 text-[#657aa1]">
                Start with a clean, professional layout and enter your details
                step by step.
              </p>

              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-3 text-[14px] text-[#1f3562]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5efff] text-[#1768ed]">
                    ✓
                  </span>
                  Professional templates
                </div>

                <div className="flex items-center gap-3 text-[14px] text-[#1f3562]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5efff] text-[#1768ed]">
                    ✓
                  </span>
                  Guided step-by-step builder
                </div>

                <div className="flex items-center gap-3 text-[14px] text-[#1f3562]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e5efff] text-[#1768ed]">
                    ✓
                  </span>
                  Tailored for your career goals
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/resume-builder/templates?mode=scratch")
                }
                className="mt-4 flex h-[50px] w-full items-center justify-center gap-4 rounded-[12px] bg-[#1768ed] text-[15px] font-bold text-white shadow-[0_7px_18px_rgba(23,104,237,0.18)] transition hover:bg-[#0f5fd8]"
              >
                Start Building
                <span className="text-[22px]">→</span>
              </button>
            </div>

            <div className="rounded-[20px] border border-[#d9e6f7] bg-white p-5 shadow-[0_8px_28px_rgba(40,75,120,0.07)]">
              <div className="flex items-start justify-between">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[17px] bg-[#e6f7ef]">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#07975a"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V4" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M5 20h14" />
                    <path d="M5 16v4" />
                    <path d="M19 16v4" />
                  </svg>
                </div>

                <span className="rounded-full bg-[#e5f7ee] px-4 py-2 text-[13px] font-bold text-[#07975a]">
                  Quick Start
                </span>
              </div>

              <h2 className="mt-5 text-[21px] font-extrabold tracking-[-0.025em] text-[#10245b]">
                Add Your Existing Resume
              </h2>

              <p className="mt-2 text-[14px] leading-5 text-[#657aa1]">
                Upload your current resume and continue editing with JOBIX.
              </p>

              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-3 text-[14px] text-[#1f3562]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e1f6eb] text-[#07975a]">
                    ✓
                  </span>
                  Upload PDF, DOCX or TXT
                </div>

                <div className="flex items-center gap-3 text-[14px] text-[#1f3562]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e1f6eb] text-[#07975a]">
                    ✓
                  </span>
                  Automatically extract your information
                </div>

                <div className="flex items-center gap-3 text-[14px] text-[#1f3562]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e1f6eb] text-[#07975a]">
                    ✓
                  </span>
                  Improve and optimize with AI
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/resume-builder/templates?mode=existing")
                }
                className="mt-4 flex h-[50px] w-full items-center justify-center gap-4 rounded-[12px] bg-[#07975a] text-[15px] font-bold text-white shadow-[0_7px_18px_rgba(7,151,90,0.16)] transition hover:bg-[#07814e]"
              >
                Upload Resume
                <span className="text-[22px]">→</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex min-h-[62px] items-center gap-5 rounded-[17px] border border-[#d9e6f5] bg-white px-5 py-2.5 shadow-[0_5px_18px_rgba(40,75,120,0.04)]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f0ff]">
              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1768ed"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15" r="1" />
              </svg>
            </div>

            <div>
              <p className="text-[15px] font-bold text-[#10245b]">
                Your resume is safe with JOBIX
              </p>
              <p className="mt-1 text-[13px] text-[#7183a3]">
                Your data is secure, private, and always accessible in your
                JOBIX workspace.
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-4 border-l border-[#e0e7f0] pl-8 text-[13px] text-[#7183a3] md:flex">
              <span className="h-px w-10 bg-[#cdd9e9]" />
              <span>Build today. A brighter tomorrow.</span>
              <span className="h-px w-10 bg-[#cdd9e9]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
