"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const templates = [
  { id: 4, name: "Artistic", image: "/resume-templates/template-04.jpg" },
  { id: 5, name: "Soothing", image: "/resume-templates/template-05.jpg" },
  { id: 6, name: "Maverick", image: "/resume-templates/template-06.jpg" },
  { id: 7, name: "Executive", image: "/resume-templates/template-07.jpg" },
  { id: 8, name: "Superb", image: "/resume-templates/template-08.jpg" },
  { id: 9, name: "Trailblazer", image: "/resume-templates/template-09.jpg" },
  { id: 10, name: "Basic", image: "/resume-templates/template-10.jpg" },
  { id: 11, name: "Vertex", image: "/resume-templates/template-11.jpg" },
  { id: 12, name: "Magnetic", image: "/resume-templates/template-12.jpg" },
  { id: 13, name: "Classic", image: "/resume-templates/template-13.jpg" },
  { id: 14, name: "Stylish", image: "/resume-templates/template-14.jpg" },
  { id: 15, name: "Contemporary", image: "/resume-templates/template-15.jpg" },
  { id: 16, name: "Prism", image: "/resume-templates/template-16.jpg" },
  { id: 17, name: "Ledger", image: "/resume-templates/template-17.jpg" },
  { id: 18, name: "Summit", image: "/resume-templates/template-18.jpg" },
  { id: 19, name: "Horizon", image: "/resume-templates/template-19.jpg" },
  { id: 20, name: "Ignite", image: "/resume-templates/template-20.jpg" },
  { id: 21, name: "Fusion", image: "/resume-templates/template-21.jpg" },
  { id: 22, name: "Accord", image: "/resume-templates/template-22.jpg" },
  { id: 23, name: "Precision", image: "/resume-templates/template-23.jpg" },
  { id: 24, name: "Professional", image: "/resume-templates/template-24.jpg" },
  { id: 25, name: "Smart", image: "/resume-templates/template-25.jpg" },
  { id: 26, name: "Elegant", image: "/resume-templates/template-26.jpg" },
  { id: 27, name: "Cool", image: "/resume-templates/template-27.jpg" },
  { id: 28, name: "Catalyst", image: "/resume-templates/template-28.jpg" },
  { id: 29, name: "Essential", image: "/resume-templates/template-29.jpg" },
  { id: 30, name: "Modern", image: "/resume-templates/template-30.jpg" }
];

export default function ResumeTemplatesPage() {
  const router = useRouter();
  const [mode, setMode] = useState("scratch");
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setMode(params.get("mode") === "existing" ? "existing" : "scratch");
  }, []);

  const filteredTemplates = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return templates;
    }

    return templates.filter((template) =>
      template.name.toLowerCase().includes(value)
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#07143b]">
      <header className="border-b border-[#dce5ef] bg-white">
        <div className="mx-auto flex h-[78px] max-w-[1450px] items-center justify-between px-6 md:px-10">
          <button
            onClick={() => router.push("/resume-builder")}
            className="flex items-center gap-3"
          >
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="h-[50px] w-[50px] rounded-xl object-contain"
            />

            <div className="leading-none text-left">
              <div className="text-[24px] font-extrabold tracking-[-0.04em]">
                JOBIX
              </div>
              <div className="mt-1 text-[10px] font-semibold tracking-[0.2em]">
                CAREER
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/resume-builder")}
            className="rounded-xl border border-[#d9e2ed] bg-white px-5 py-3 text-sm font-extrabold transition hover:bg-[#f4f7fb]"
          >
            ← Back
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1450px] px-5 pb-28 pt-10 md:px-8">
        <div className="text-center">
          <div className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#1769ff]">
            Resume Builder
          </div>

          <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] md:text-5xl">
            Choose your resume template
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#7183a3]">
            Choose a professional template and continue to create your
            job-ready resume with JOBIX.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#dce5ef] bg-white p-4 shadow-sm md:flex-row md:items-center">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search templates..."
            className="w-full rounded-xl border border-[#dce5ef] bg-[#f9fbfe] px-5 py-3.5 text-sm font-semibold outline-none focus:border-[#1769ff] md:flex-1"
          />

          <div
            className={`rounded-xl px-5 py-3 text-center text-sm font-extrabold ${
              mode === "existing"
                ? "bg-[#eafaf1] text-[#0b9b58]"
                : "bg-[#eaf1ff] text-[#1769ff]"
            }`}
          >
            {mode === "existing"
              ? "Existing Resume"
              : "Build from Scratch"}
          </div>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="group">
              <button
                onClick={() => setSelected(template.id)}
                className="block w-full text-left"
              >
                <div
                  className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition ${
                    selected === template.id
                      ? "border-[#1769ff] ring-4 ring-[#1769ff]/15 shadow-lg"
                      : "border-[#d8e1ec] group-hover:-translate-y-1 group-hover:shadow-xl"
                  }`}
                >
                  <div className="aspect-[0.72] overflow-hidden bg-[#eef2f7]">
                    <img
                      src={template.image}
                      alt={`${template.name} resume template`}
                      className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.015]"
                    />
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 ${
                      selected === template.id
                        ? "bg-[#1769ff]"
                        : "translate-y-full bg-[#07143b] transition-transform group-hover:translate-y-0"
                    }`}
                  >
                    <span className="text-sm font-extrabold text-white">
                      {selected === template.id
                        ? "Selected"
                        : "Use Template"}
                    </span>

                    <span className="text-lg text-white">→</span>
                  </div>
                </div>
              </button>

              <div className="mt-3 flex items-center justify-between px-1">
                <div>
                  <h3 className="text-lg font-extrabold">
                    {template.name}
                  </h3>

                  <p className="mt-0.5 text-xs font-semibold text-[#7183a3]">
                    Template {template.id}/30
                  </p>
                </div>

                {selected === template.id && (
                  <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-extrabold text-[#1769ff]">
                    Selected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#dce5ef] bg-white px-5 py-4 shadow-[0_-8px_30px_rgba(7,20,59,0.08)]">
          <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7183a3]">
                Selected template
              </p>

              <p className="mt-1 text-lg font-extrabold">
                {templates.find((template) => template.id === selected)?.name}
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/resume-builder/editor?template=${selected}&mode=${mode}`
                )
              }
              className={`rounded-xl px-7 py-3.5 text-sm font-extrabold text-white ${
                mode === "existing"
                  ? "bg-[#0b9b58] hover:bg-[#087d48]"
                  : "bg-[#1769ff] hover:bg-[#0f5cdd]"
              }`}
            >
              Continue →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
