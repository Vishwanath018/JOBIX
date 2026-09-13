"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

type ATSResult = {
  ats_score: number;
  score_label: string;
  summary: string;
  strengths: string[];
  missing_fields: string[];
  improvements: string[];
  keyword_gaps: string[];
  formatting_issues: string[];
  action_plan: string[];
};

export default function ATSCheckPage() {
  const router = useRouter();
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);

  const runATSCheck = async () => {
    setError("");
    setResult(null);

    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    const token = getAccessToken() || (() => {
      const match = document.cookie.match(/(?:^|; )jobix_access_token=([^;]+)/);
      return match ? decodeURIComponent(match[1]) : null;
    })();

    if (!token) {
      setError("Your login session is missing. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    if (jobDescription.trim()) {
      formData.append("job_description", jobDescription.trim());
    }

    setLoading(true);
    setStage("Uploading resume...");

    try {
      setStage("Reading your resume...");

      const response = await fetch("http://127.0.0.1:8000/ats/check", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        localStorage.removeItem("jobix_access_token");
        localStorage.removeItem("jobix_user");
        setError("Your login session has expired. Please log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.detail || `ATS check failed (${response.status}).`);
      }

      setStage("Sarvam AI is analyzing your resume...");
      setResult(data);
      setStage("ATS analysis completed.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete the ATS check."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-5 py-8 text-[#07143b] md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 flex items-center justify-between">
          <button
            onClick={() => router.push("/home")}
            className="rounded-xl bg-white px-5 py-3 font-bold shadow-sm"
          >
            ← Dashboard
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="h-11 w-11 rounded-xl"
            />
            <span className="text-2xl font-extrabold">JOBIX</span>
          </div>
        </div>

        {!result && (
          <section className="rounded-[30px] bg-white p-7 shadow-xl md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#1769ff]">
                AI Resume Intelligence
              </p>

              <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
                ATS Resume Check
              </h1>

              <p className="mt-4 text-lg leading-8 text-[#7183a3]">
                Upload your resume and let JOBIX analyze its ATS compatibility,
                strengths, missing information, keywords, formatting, and
                improvement opportunities.
              </p>
            </div>

            <div className="mt-9 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-extrabold">
                  Upload Resume
                </label>

                <label className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd8eb] bg-[#f8fbff] px-6 text-center transition hover:border-[#1769ff] hover:bg-[#f2f7ff]">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) =>
                      setResume(e.target.files?.[0] || null)
                    }
                  />

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf2ff] text-3xl text-[#1769ff]">
                    ↑
                  </div>

                  <p className="mt-5 font-extrabold">
                    {resume ? resume.name : "Choose your resume"}
                  </p>

                  <p className="mt-2 text-sm text-[#7183a3]">
                    PDF, DOCX or TXT · Maximum 10 MB
                  </p>
                </label>
              </div>

              <div>
                <label className="mb-3 block text-sm font-extrabold">
                  Job Description
                  <span className="ml-2 font-medium text-[#8b9bb7]">
                    Optional
                  </span>
                </label>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a more targeted ATS analysis..."
                  className="min-h-[230px] w-full resize-none rounded-2xl border border-[#dce5f2] bg-[#f8fbff] p-5 text-sm leading-6 outline-none focus:border-[#1769ff]"
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={runATSCheck}
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-[#07143b] px-6 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-[#102252] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? stage || "Analyzing..." : "Check ATS Score →"}
            </button>

            {loading && (
              <div className="mt-5 rounded-2xl bg-[#f3f7ff] p-5 text-center">
                <div className="mx-auto mb-3 h-2 max-w-md overflow-hidden rounded-full bg-[#dbe5f5]">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-[#1769ff]" />
                </div>
                <p className="text-sm font-bold text-[#53698f]">{stage}</p>
              </div>
            )}
          </section>
        )}

        {result && (
          <section>
            <div className="rounded-[30px] bg-[#07143b] p-8 text-white shadow-xl md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9dbaff]">
                ATS Analysis Complete
              </p>

              <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-4xl font-extrabold md:text-5xl">
                    Your ATS Score
                  </h1>
                  <p className="mt-3 max-w-2xl text-[#b9c8e3]">
                    {result.summary}
                  </p>
                </div>

                <div className="flex h-36 w-36 shrink-0 flex-col items-center justify-center rounded-full bg-white text-[#07143b]">
                  <span className="text-5xl font-extrabold">
                    {result.ats_score}
                  </span>
                  <span className="text-sm font-bold">/ 100</span>
                </div>
              </div>

              <div className="mt-7 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-extrabold">
                {result.score_label}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <ResultCard
                title="Strengths"
                items={result.strengths}
                icon="✓"
              />
              <ResultCard
                title="Missing Fields"
                items={result.missing_fields}
                icon="!"
              />
              <ResultCard
                title="Improvements"
                items={result.improvements}
                icon="↗"
              />
              <ResultCard
                title="Keyword Gaps"
                items={result.keyword_gaps}
                icon="#"
              />
              <ResultCard
                title="Formatting Issues"
                items={result.formatting_issues}
                icon="▤"
              />
              <ResultCard
                title="Action Plan"
                items={result.action_plan}
                icon="→"
              />
            </div>

            <button
              onClick={() => {
                setResult(null);
                setResume(null);
                setJobDescription("");
                setError("");
              }}
              className="mt-7 w-full rounded-2xl bg-[#07143b] px-6 py-4 font-extrabold text-white"
            >
              Analyze Another Resume
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: unknown[];
  icon: string;
}) {
  return (
    <section className="rounded-3xl border border-[#dce8f7] bg-white p-6 shadow-[0_10px_35px_rgba(48,104,180,0.08)]">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6ff] text-lg font-bold text-[#1677ff]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-[#07143b]">{title}</h3>
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No items identified.</p>
        ) : (
          items.map((item, index) => {
            if (typeof item === "string") {
              return (
                <div key={index} className="rounded-2xl bg-[#f7faff] p-4">
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              );
            }

            if (item && typeof item === "object") {
              const value = item as Record<string, unknown>;
              const itemTitle =
                typeof value.title === "string" ? value.title : "";
              const description =
                typeof value.description === "string"
                  ? value.description
                  : "";
              const priority =
                typeof value.priority === "string" ? value.priority : "";

              return (
                <div key={index} className="rounded-2xl bg-[#f7faff] p-4">
                  {itemTitle && (
                    <p className="font-semibold text-[#07143b]">
                      {itemTitle}
                    </p>
                  )}

                  {description && (
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {description}
                    </p>
                  )}

                  {priority && (
                    <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {priority}
                    </span>
                  )}
                </div>
              );
            }

            return null;
          })
        )}
      </div>
    </section>
  );
}


