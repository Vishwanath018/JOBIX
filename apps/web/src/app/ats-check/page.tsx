"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleAlert,
  Download,
  FileText,
  Lightbulb,
  ListChecks,
  Plus,
  Sparkles,
  Target,
  Upload,
  X,
} from "lucide-react";

type AtsItem = {
  title: string;
  explanation: string;
};

type AtsImprovement = {
  title: string;
  explanation: string;
  priority: string;
};

type AtsResult = {
  ats_score: number;
  score_label: string;
  role_match_score: number;
  role: string;
  summary: string;
  strengths: AtsItem[];
  missing_fields: AtsItem[];
  improvements: AtsImprovement[];
  keyword_gaps: string[];
  matched_keywords: string[];
  formatting_issues: string[];
  action_plan: string[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const roles = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Python Developer",
  "Java Developer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "Product Manager",
  "UI/UX Designer",
  "Business Analyst",
  "Marketing Specialist",
  "Other",
];

function getToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("jobix_access_token_v2") ||
    sessionStorage.getItem("jobix_access_token_v2") ||
    localStorage.getItem("jobix_access_token") ||
    sessionStorage.getItem("jobix_access_token")
  );
}

function clearAuth() {
  if (typeof window === "undefined") return;

  [
    "jobix_access_token_v2",
    "jobix_user_v2",
    "jobix_access_token",
    "jobix_user",
  ].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

function scoreText(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Improvement";
  return "Needs Work";
}

function ScoreRing({ score }: { score: number }) {
  const radius = 53;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg
        width="140"
        height="140"
        viewBox="0 0 140 140"
        className="-rotate-90"
      >
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#dbe6f2"
          strokeWidth="10"
        />

        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="url(#atsScoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />

        <defs>
          <linearGradient
            id="atsScoreGradient"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#1674e8" />
            <stop offset="55%" stopColor="#08b6c9" />
            <stop offset="100%" stopColor="#20b978" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[42px] font-extrabold leading-none text-[#10254e]">
          {score}
        </div>
        <div className="mt-1 text-[12px] font-bold text-[#526684]">
          / 100
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  count,
  color,
  expanded,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  count: number;
  color: "green" | "purple" | "yellow" | "red" | "blue";
  expanded: boolean;
  onToggle: () => void;
}) {
  const iconColors = {
    green: "bg-[#ddf7e9] text-[#12a96c]",
    purple: "bg-[#eee9ff] text-[#7756e9]",
    yellow: "bg-[#fff0ce] text-[#e39a00]",
    red: "bg-[#ffe5eb] text-[#ed4665]",
    blue: "bg-[#e5f0ff] text-[#1476e9]",
  };

  return (
    <div className="flex items-start justify-between border-b border-[#e3eaf2] px-5 py-4">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColors[color]}`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-[16px] font-extrabold text-[#102b55]">
            {title} ({count})
          </h2>

          <p className="mt-1 text-[12px] font-medium text-[#5c6f8d]">
            {subtitle}
          </p>
        </div>
      </div>

      {count > 0 && (
        <button
          onClick={onToggle}
          className="pt-1 text-[12px] font-extrabold text-[#0878ee] hover:underline"
        >
          {expanded ? "Show Less" : "View All"}
        </button>
      )}
    </div>
  );
}

function Metric({
  icon,
  number,
  label,
  badge,
  type,
}: {
  icon: React.ReactNode;
  number: number;
  label: string;
  badge: string;
  type: "green" | "red" | "blue" | "yellow";
}) {
  const styles = {
    green: {
      icon: "bg-[#def7ea] text-[#10a86b]",
      badge: "bg-[#e5f9f0] text-[#0c9d64]",
    },
    red: {
      icon: "bg-[#ffe5eb] text-[#ef4564]",
      badge: "bg-[#ffe9ee] text-[#df3b58]",
    },
    blue: {
      icon: "bg-[#e2efff] text-[#1975e7]",
      badge: "bg-[#e7f1ff] text-[#1970d7]",
    },
    yellow: {
      icon: "bg-[#fff0d0] text-[#e69a00]",
      badge: "bg-[#fff3d9] text-[#d88900]",
    },
  };

  return (
    <div className="rounded-xl border border-[#dce6f1] bg-white p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles[type].icon}`}
        >
          {icon}
        </div>

        <div>
          <div className="text-[26px] font-extrabold leading-none text-[#102b55]">
            {number}
          </div>

          <div className="mt-1 text-[12px] font-semibold text-[#536783]">
            {label}
          </div>
        </div>
      </div>

      <div
        className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ${styles[type].badge}`}
      >
        {badge}
      </div>
    </div>
  );
}

export default function AtsCheckPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<AtsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const selectFile = (file: File | null) => {
    if (!file) return;

    const name = file.name.toLowerCase();

    if (
      !name.endsWith(".pdf") &&
      !name.endsWith(".docx") &&
      !name.endsWith(".txt")
    ) {
      setError("Please upload a PDF, DOCX, or TXT resume.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Resume must be 10 MB or smaller.");
      return;
    }

    setResume(file);
    setError("");
  };

  const analyze = async () => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!jobRole) {
      setError("Please select a target role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const form = new FormData();

      form.append("resume", resume);
      form.append("job_role", jobRole);
      form.append(
        "job_description",
        jobDescription.trim()
      );

      const response = await fetch(
        `${API_URL}/ats/check`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        clearAuth();
        router.replace(
          "/login?reason=session_expired"
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to analyze this resume."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze this resume."
      );
    } finally {
      setLoading(false);
    }
  };

  const newAnalysis = () => {
    setResult(null);
    setResume(null);
    setJobRole("");
    setJobDescription("");
    setError("");
    setExpanded({});
  };

  const toggle = (name: string) => {
    setExpanded((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const downloadReport = () => {
    if (!result) return;

    const text = [
      "JOBIX ATS ANALYSIS REPORT",
      "",
      `ATS Score: ${result.ats_score}/100`,
      `Role Match: ${result.role_match_score}%`,
      `Target Role: ${result.role}`,
      "",
      "SUMMARY",
      result.summary,
      "",
      "STRENGTHS",
      ...result.strengths.map(
        (x) => `${x.title}: ${x.explanation}`
      ),
      "",
      "MATCHED KEYWORDS",
      ...result.matched_keywords.map(
        (x) => `- ${x}`
      ),
      "",
      "KEYWORD GAPS",
      ...result.keyword_gaps.map(
        (x) => `- ${x}`
      ),
      "",
      "MISSING FIELDS",
      ...result.missing_fields.map(
        (x) => `${x.title}: ${x.explanation}`
      ),
      "",
      "IMPROVEMENTS",
      ...result.improvements.map(
        (x) =>
          `${x.title} [${x.priority}]: ${x.explanation}`
      ),
      "",
      "ACTION PLAN",
      ...result.action_plan.map(
        (x, i) => `${i + 1}. ${x}`
      ),
    ].join("\n");

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "JOBIX-ATS-Analysis.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-[#f6f9fd] text-[#10254e]">
        <header className="h-[82px] border-b border-[#dce5ef] bg-white">
          <div className="flex h-full items-center px-8">
            <div className="flex items-center gap-4">
              <img
                src="/jobix-logo.png"
                alt="JOBIX Career"
                className="h-[62px] w-[62px] rounded-[13px] object-contain"
              />

              <div className="leading-none">
                <div className="text-[25px] font-extrabold tracking-[-0.045em] text-black">
                  JOBIX
                </div>

                <div className="mt-1 text-[13px] font-medium tracking-[0.16em] text-black">
                  CAREER
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1180px] px-7 py-9">
          <div className="mb-6">
            <div className="text-[11px] font-extrabold tracking-[0.18em] text-[#1475e9]">
              RESUME TO JOB MATCH
            </div>

            <h1 className="mt-2 text-[38px] font-extrabold tracking-[-0.045em] text-[#10254e]">
              ATS Resume Check
            </h1>

            <p className="mt-2 max-w-[720px] text-[14px] font-medium leading-6 text-[#61728d]">
              Upload your resume and select a target role to get a clear ATS
              score, keyword analysis and practical recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-[#d9e4ef] bg-white p-5 shadow-[0_7px_24px_rgba(24,67,112,0.045)]">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                selectFile(e.dataTransfer.files?.[0] || null);
              }}
              onClick={() => inputRef.current?.click()}
              className={`group cursor-pointer rounded-xl border-2 border-dashed px-6 py-9 text-center transition-all duration-200 ${
                dragging
                  ? "scale-[1.005] border-[#1475e9] bg-[#f0f7ff]"
                  : resume
                    ? "border-[#9bc7f7] bg-[#f8fbff]"
                    : "border-[#d5e2ef] bg-[#fbfdff] hover:border-[#9bc7f7] hover:bg-[#f8fbff]"
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                hidden
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.zip"
                onChange={(e) => {
                  e.stopPropagation();
                  selectFile(e.target.files?.[0] || null);
                }}
              />

              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:-translate-y-1 ${
                  resume
                    ? "bg-[#e8f5ef] text-[#10a66c]"
                    : "bg-[#eaf3ff] text-[#1475e9]"
                }`}
              >
                {resume ? (
                  <CheckCircle2 size={27} />
                ) : (
                  <Upload size={27} />
                )}
              </div>

              {resume ? (
                <>
                  <h2 className="mt-4 text-[17px] font-extrabold text-[#14325d]">
                    Resume selected
                  </h2>

                  <div className="mx-auto mt-2 flex max-w-[520px] items-center justify-center gap-2 rounded-lg bg-[#f1f6fb] px-4 py-2.5">
                    <FileText
                      size={16}
                      className="shrink-0 text-[#1475e9]"
                    />

                    <span className="truncate text-[12px] font-bold text-[#294666]">
                      {resume.name}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setResume(null);
                      }}
                      className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#71829c] transition hover:bg-white hover:text-[#e6425f]"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <p className="mt-3 text-[11px] font-medium text-[#70819b]">
                    Click anywhere here to choose a different resume
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-4 text-[20px] font-extrabold text-[#14325d]">
                    Upload your resume
                  </h2>

                  <p className="mt-2 text-[14px] font-medium text-[#687b96]">
                    Drag and drop your resume here or click to browse
                  </p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
                    className="mt-5 rounded-xl bg-[#1475e9] px-8 py-3 text-[13px] font-extrabold text-white shadow-[0_6px_16px_rgba(20,117,233,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#096bdc]"
                  >
                    Browse Files
                  </button>

                  <div className="mt-3 text-[11px] font-semibold text-[#8291a7]">
                    PDF, DOCX or TXT ? Maximum 10 MB
                  </div>
                </>
              )}
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[14px] font-extrabold text-[#15345e]">
                  Target Role
                </label>

                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="h-[52px] w-full rounded-xl border border-[#d5e0ec] bg-white px-4 text-[14px] font-semibold text-[#243e62] outline-none transition focus:border-[#1475e9] focus:ring-4 focus:ring-[#1475e9]/10"
                >
                  <option value="">
                    Select a target role
                  </option>

                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[13px] font-extrabold text-[#15345e]">
                    Job Description
                    <span className="ml-1.5 font-semibold text-[#8a98ab]">
                      (Optional)
                    </span>
                  </label>

                  <span className="text-[10px] font-semibold text-[#8795a9]">
                    {jobDescription.length}/6000
                  </span>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(e.target.value.slice(0, 6000))
                  }
                  placeholder="Paste the job description for a more accurate match..."
                  className="h-[120px] w-full resize-none rounded-xl border border-[#d5e0ec] bg-white p-4 text-[14px] font-medium text-[#243e62] outline-none transition placeholder:text-[#8a98ac] focus:border-[#1475e9] focus:ring-4 focus:ring-[#1475e9]/10"
                />
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#ffcbd4] bg-[#fff3f5] px-4 py-3 text-[12px] font-bold leading-5 text-[#d83c57]">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={analyze}
              disabled={loading}
              className="mt-6 flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#1475e9] text-[14px] font-extrabold text-white shadow-[0_7px_18px_rgba(20,117,233,0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#096bdc] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Check ATS Score
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-semibold text-[#8290a4]">
              <CheckCircle2 size={13} className="text-[#10a66c]" />
              Your resume is analyzed securely and used only for this ATS check.
            </div>
          </div>
        </main>
      </div>
    );
  }

  const strengths = result.strengths || [];
  const matched = result.matched_keywords || [];
  const gaps = result.keyword_gaps || [];
  const missing = result.missing_fields || [];
  const improvements = result.improvements || [];
  const actions = result.action_plan || [];

  return (
    <div className="min-h-screen bg-[#f4f8fd] text-[#10254e]">
      <header className="flex h-[76px] items-center border-b border-[#dce6f1] bg-white px-7">
        <div className="flex items-center gap-3">
          <img
            src="/jobix-symbol.svg"
            alt="JOBIX"
            className="h-10 w-10 object-contain"
          />

          <div>
            <div className="text-[23px] font-extrabold tracking-[-0.04em]">
              JOB<span className="text-[#126ce5]">IX</span>
            </div>

            <div className="text-[9px] font-medium text-[#62728d]">
              Build Today, Belong Tomorrow.
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-7 py-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[12px] font-semibold text-[#687995]">
              ATS Check <span className="mx-1">?</span>{" "}
              <span className="font-extrabold text-[#172f58]">
                Results
              </span>
            </div>

            <h1 className="mt-2 text-[32px] font-extrabold tracking-[-0.04em] text-[#10254e]">
              ATS Analysis Results
            </h1>

            <p className="mt-1 text-[13px] font-medium text-[#637591]">
              Here's a detailed analysis of your resume for the selected
              role. Use the insights below to improve your chances.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 rounded-xl border border-[#d4e0ec] bg-white px-5 py-3 text-[12px] font-extrabold text-[#183258] shadow-sm"
            >
              <Download size={16} />
              Download Report
            </button>

            <button
              onClick={newAnalysis}
              className="flex items-center gap-2 rounded-xl bg-[#0878ee] px-5 py-3 text-[12px] font-extrabold text-white shadow-[0_7px_18px_rgba(8,120,238,0.18)]"
            >
              <Plus size={16} />
              New Analysis
            </button>
          </div>
        </div>

        <section className="grid overflow-hidden rounded-2xl border border-[#d9e4ef] bg-white lg:grid-cols-[1.55fr_1.08fr_1fr]">
          <div className="p-5 lg:border-r">
            <div className="text-[14px] font-extrabold">
              Overall ATS Score
            </div>

            <div className="mt-3 flex items-center gap-6">
              <ScoreRing score={result.ats_score} />

              <div className="max-w-[330px]">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#def7e9] px-3 py-1.5 text-[11px] font-extrabold text-[#0c9d65]">
                  <CheckCircle2 size={14} />
                  {result.score_label ||
                    scoreText(result.ats_score)}
                </div>

                <p className="mt-3 text-[13px] font-semibold leading-6 text-[#405a7e]">
                  {result.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 lg:border-r">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-extrabold">
                Role Match
              </span>

              <span className="text-[21px] font-extrabold text-[#1675e9]">
                {result.role_match_score}%
              </span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-[#e7edf5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#655be9] to-[#9850e8]"
                style={{
                  width: `${result.role_match_score}%`,
                }}
              />
            </div>

            <p className="mt-3 text-[11px] font-semibold leading-5 text-[#5c708f]">
              Your skills and experience align with the selected role.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f2f7fd] p-3">
                <div className="text-[9px] font-semibold text-[#7787a0]">
                  Target Role
                </div>

                <div className="mt-1 text-[11px] font-extrabold text-[#17345e]">
                  {result.role}
                </div>
              </div>

              <div className="rounded-xl bg-[#f2f7fd] p-3">
                <div className="flex items-center gap-1 text-[9px] font-semibold text-[#7787a0]">
                  <CalendarDays size={11} />
                  Analysis Date
                </div>

                <div className="mt-1 text-[11px] font-extrabold text-[#17345e]">
                  {new Date().toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="h-full rounded-xl bg-[#e9f4ff] p-5">
              <div className="flex items-center gap-2 text-[16px] font-extrabold text-[#0876eb]">
                <Lightbulb size={20} />
                Almost There!
              </div>

              <p className="mt-3 text-[12px] font-semibold leading-6 text-[#385474]">
                You're on the right track. Address the highlighted gaps
                above and improve your chances of getting shortlisted.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-4">
          <Metric
            icon={<CheckCircle2 size={22} />}
            number={matched.length}
            label="Keywords Matched"
            badge="Relevant keywords found"
            type="green"
          />

          <Metric
            icon={<CircleAlert size={22} />}
            number={gaps.length}
            label="Keyword Gaps"
            badge="Needs Attention"
            type="red"
          />

          <Metric
            icon={<FileText size={22} />}
            number={missing.length}
            label="Missing Fields"
            badge="Add these details"
            type="blue"
          />

          <Metric
            icon={<Lightbulb size={22} />}
            number={improvements.length}
            label="Action Items"
            badge="Recommendations"
            type="yellow"
          />
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-[#d9e4ef] bg-white">
            <SectionHeader
              icon={<Check size={21} />}
              title="Strengths"
              subtitle="What you're doing well"
              count={strengths.length}
              color="green"
              expanded={!!expanded.Strengths}
              onToggle={() => toggle("Strengths")}
            />

            <div className="p-4">
              {strengths
                .slice(
                  0,
                  expanded.Strengths
                    ? strengths.length
                    : 5
                )
                .map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex gap-3 border-b border-[#edf1f6] py-3 last:border-0"
                  >
                    <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15ad70] text-white">
                      <Check size={12} strokeWidth={3} />
                    </div>

                    <div>
                      <div className="text-[13px] font-extrabold text-[#15325d]">
                        {item.title}
                      </div>

                      <div className="mt-1 text-[12px] font-semibold leading-5 text-[#4a6382]">
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#d9e4ef] bg-white">
            <SectionHeader
              icon={<Sparkles size={20} />}
              title="Matched Keywords"
              subtitle="Keywords found in your resume that match the job."
              count={matched.length}
              color="purple"
              expanded={!!expanded["Matched Keywords"]}
              onToggle={() => toggle("Matched Keywords")}
            />

            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {matched
                  .slice(
                    0,
                    expanded["Matched Keywords"]
                      ? matched.length
                      : 18
                  )
                  .map((keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="rounded-full bg-[#dff7ea] px-3 py-1.5 text-[11px] font-extrabold text-[#119b67]"
                    >
                      {keyword}
                    </span>
                  ))}
              </div>

              <div className="mt-4 rounded-lg border border-[#c8e1fb] bg-[#eaf5ff] px-3 py-2.5 text-[11px] font-semibold text-[#456482]">
                <span className="font-extrabold text-[#0878ee]">
                  Tip:
                </span>{" "}
                Keep using these keywords naturally in your resume.
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#d9e4ef] bg-white">
            <SectionHeader
              icon={<FileText size={20} />}
              title="Missing Fields"
              subtitle="Important sections that are missing or need more detail."
              count={missing.length}
              color="yellow"
              expanded={!!expanded["Missing Fields"]}
              onToggle={() => toggle("Missing Fields")}
            />

            <div className="p-4">
              {missing
                .slice(
                  0,
                  expanded["Missing Fields"]
                    ? missing.length
                    : 6
                )
                .map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="grid grid-cols-[155px_1fr] gap-3 border-b border-[#edf1f6] py-3 last:border-0"
                  >
                    <div className="flex items-start gap-2 text-[12px] font-extrabold text-[#18355e]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ffad12] text-[11px] font-extrabold text-white">
                        !
                      </span>
                      {item.title}
                    </div>

                    <div className="text-[12px] font-semibold leading-5 text-[#4a6382]">
                      {item.explanation}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#d9e4ef] bg-white">
            <SectionHeader
              icon={<X size={20} />}
              title="Keyword Gaps"
              subtitle="Important role or job-description keywords that are missing."
              count={gaps.length}
              color="red"
              expanded={!!expanded["Keyword Gaps"]}
              onToggle={() => toggle("Keyword Gaps")}
            />

            <div className="p-4">
              {gaps
                .slice(
                  0,
                  expanded["Keyword Gaps"]
                    ? gaps.length
                    : 6
                )
                .map((gap, index) => (
                  <div
                    key={`${gap}-${index}`}
                    className="grid grid-cols-[155px_1fr] gap-3 border-b border-[#edf1f6] py-3 last:border-0"
                  >
                    <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#18355e]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ef4967] text-white">
                        <X size={11} strokeWidth={3} />
                      </span>
                      {gap}
                    </div>

                    <div className="text-[12px] font-semibold leading-5 text-[#4a6382]">
                      Add this keyword naturally where your experience supports it.
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-[#d9e4ef] bg-white">
          <SectionHeader
            icon={<ArrowUpRight size={20} />}
            title="Improvements"
            subtitle="Specific changes that can improve your resume."
            count={improvements.length}
            color="blue"
            expanded={!!expanded.Improvements}
            onToggle={() => toggle("Improvements")}
          />

          <div className="grid gap-3 p-4 md:grid-cols-2">
            {improvements
              .slice(
                0,
                expanded.Improvements
                  ? improvements.length
                  : 6
              )
              .map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-xl bg-[#f6f9fd] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-[13px] font-extrabold text-[#17345e]">
                      {item.title}
                    </div>

                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-extrabold text-[#48627f]">
                      {item.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-[12px] font-semibold leading-5 text-[#4a6382]">
                    {item.explanation}
                  </p>
                </div>
              ))}
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-xl border border-[#cfe2f8] bg-white">
          <div className="flex items-center gap-3 border-b border-[#d9eaf9] bg-[#edf6ff] px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dceeff] text-[#1475e9]">
              <ListChecks size={21} />
            </div>

            <div>
              <h2 className="text-[16px] font-extrabold">
                Recommended Action Plan ({actions.length})
              </h2>

              <p className="mt-1 text-[11px] font-semibold text-[#637793]">
                Follow these steps to improve your ATS score.
              </p>
            </div>

            {actions.length > 6 && (
              <button
                onClick={() =>
                  toggle("Recommended Action Plan")
                }
                className="ml-auto text-[12px] font-extrabold text-[#0878ee]"
              >
                {expanded["Recommended Action Plan"]
                  ? "Show Less"
                  : "View All"}
              </button>
            )}
          </div>

          <div className="grid md:grid-cols-3">
            {actions
              .slice(
                0,
                expanded["Recommended Action Plan"]
                  ? actions.length
                  : 6
              )
              .map((action, index) => (
                <div
                  key={`${action}-${index}`}
                  className="flex gap-3 border-b border-r border-[#e5edf5] p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcecff] text-[12px] font-extrabold text-[#1475e9]">
                    {index + 1}
                  </div>

                  <div className="text-[12px] font-semibold leading-5 text-[#294768]">
                    {action}
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="mt-4 flex flex-col items-start justify-between gap-4 rounded-xl border border-[#bdebd7] bg-[#eafbf3] px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d8f7e8] text-[#0ca86b]">
              <Target size={21} />
            </div>

            <div>
              <div className="text-[12px] font-extrabold text-[#087b56]">
                Pro Tip
              </div>

              <div className="mt-1 text-[11px] font-semibold leading-5 text-[#386453]">
                Tailor your resume to the job description and keep relevant
                skills and achievements prominent.
              </div>
            </div>
          </div>

          <button
            onClick={() =>
              router.push("/resume-builder")
            }
            className="flex items-center gap-2 rounded-lg bg-[#10a96d] px-5 py-3 text-[11px] font-extrabold text-white"
          >
            Improve My Resume
            <ArrowRight size={14} />
          </button>
        </section>
      </main>
    </div>
  );
}
