"use client";

import { useRouter } from "next/navigation";

export default function ResumeBuilderPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f5f8fd] text-[#07143b]">
      <header className="sticky top-0 z-40 border-b border-[#dce5ef] bg-white">
        <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-6 md:px-10">
          <button
            onClick={() => router.push("/home")}
            className="flex items-center gap-3"
          >
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="h-[50px] w-[50px] rounded-xl object-contain"
            />

            <div className="leading-none text-left">
              <div className="text-[23px] font-extrabold tracking-[-0.04em] text-[#07143b]">
                JOBIX
              </div>

              <div className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-[#07143b]">
                CAREER
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/home")}
            className="rounded-xl border border-[#d9e2ee] bg-white px-5 py-3 text-sm font-extrabold text-[#07143b] transition hover:bg-[#f5f8fd]"
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1180px] px-5 pb-16 pt-12 md:px-8 md:pt-16">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border border-[#d9e6fb] bg-[#eef4ff] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#1769ff]">
            Resume Builder
          </div>

          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-[-0.035em] md:text-5xl">
            Build a resume that gets you noticed
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#7183a3] md:text-lg">
            Start from a professional layout or bring your existing resume
            into JOBIX. Choose how you want to begin.
          </p>

          <div className="mt-7 flex items-center justify-center gap-3 text-sm font-bold text-[#7183a3]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#07143b] text-xs text-white">
              1
            </span>

            <span>Choose your starting point</span>

            <span className="h-px w-10 bg-[#d6dfeb]" />

            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d6dfeb] bg-white text-xs text-[#7183a3]">
              2
            </span>

            <span>Build your resume</span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <button
            onClick={() => router.push("/resume-builder/scratch")}
            className="group relative overflow-hidden rounded-[26px] border border-[#d9e3ef] bg-white p-8 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#1769ff] hover:shadow-xl md:p-10"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1ff] text-3xl font-extrabold text-[#1769ff]">
                +
              </div>

              <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-extrabold text-[#1769ff]">
                Recommended
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.02em]">
              Build Resume from Scratch
            </h2>

            <p className="mt-3 max-w-lg text-base leading-7 text-[#7183a3]">
              Create a fresh, professional resume using JOBIX's structured
              resume-building experience.
            </p>

            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#26385f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf1ff] text-xs font-extrabold text-[#1769ff]">
                  ✓
                </span>
                Start with a clean professional layout
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-[#26385f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf1ff] text-xs font-extrabold text-[#1769ff]">
                  ✓
                </span>
                Add experience, education and skills
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-[#26385f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eaf1ff] text-xs font-extrabold text-[#1769ff]">
                  ✓
                </span>
                Choose your resume structure and style
              </div>
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-[#edf1f6] pt-6">
              <span className="font-extrabold text-[#1769ff]">
                Start Building
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1769ff] text-lg font-bold text-white transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>

          <button
            onClick={() => router.push("/resume-builder/existing")}
            className="group relative overflow-hidden rounded-[26px] border border-[#d9e3ef] bg-white p-8 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#0b9b58] hover:shadow-xl md:p-10"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eafaf1] text-3xl font-extrabold text-[#0b9b58]">
                ↑
              </div>

              <span className="rounded-full bg-[#eafaf1] px-3 py-1.5 text-xs font-extrabold text-[#0b9b58]">
                Quick Start
              </span>
            </div>

            <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.02em]">
              Add Your Existing Resume
            </h2>

            <p className="mt-3 max-w-lg text-base leading-7 text-[#7183a3]">
              Bring your current resume into JOBIX and continue improving it
              instead of starting over.
            </p>

            <div className="mt-7 space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#26385f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eafaf1] text-xs font-extrabold text-[#0b9b58]">
                  ✓
                </span>
                Upload your existing resume
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-[#26385f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eafaf1] text-xs font-extrabold text-[#0b9b58]">
                  ✓
                </span>
                Continue editing your information
              </div>

              <div className="flex items-center gap-3 text-sm font-semibold text-[#26385f]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eafaf1] text-xs font-extrabold text-[#0b9b58]">
                  ✓
                </span>
                Improve and prepare it for applications
              </div>
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-[#edf1f6] pt-6">
              <span className="font-extrabold text-[#0b9b58]">
                Upload Resume
              </span>

              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b9b58] text-lg font-bold text-white transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </button>
        </div>

        <div className="mt-8 rounded-2xl border border-[#dce5ef] bg-white px-6 py-5 shadow-sm md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-extrabold text-[#07143b]">
                Your resume, your way
              </p>

              <p className="mt-1 text-sm leading-6 text-[#7183a3]">
                Start from scratch or use what you already have. You can
                continue improving your resume inside JOBIX.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-[#0b9b58]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eafaf1]">
                ✓
              </span>
              Ready when you are
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
