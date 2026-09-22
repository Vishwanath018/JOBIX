"use client";

import { useMemo, useState } from "react";
import CompanyLogo from "./company-logo";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  Flame,
  GitBranch,
  GraduationCap,
  LineChart,
  Play,
  Search,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const categories = [
  {
    title: "DSA",
    subtitle: "Data Structures & Algorithms",
    solved: 248,
    total: 500,
    icon: Code2,
    color: "blue",
    href: "/interview-kit/dsa",
  },
  {
    title: "SQL",
    subtitle: "Queries & Databases",
    solved: 42,
    total: 150,
    icon: Database,
    color: "emerald",
    href: "/interview-kit/sql",
  },
  {
    title: "OOPs",
    subtitle: "Object Oriented Programming",
    solved: 31,
    total: 80,
    icon: Target,
    color: "violet",
    href: "/interview-kit/oops",
  },
  {
    title: "MongoDB",
    subtitle: "NoSQL Database",
    solved: 18,
    total: 60,
    icon: Database,
    color: "green",
    href: "/interview-kit/mongodb",
  },
  {
    title: "Git & GitHub",
    subtitle: "Version Control",
    solved: 25,
    total: 50,
    icon: GitBranch,
    color: "orange",
    href: "/interview-kit/git-github",
  },
  {
    title: "AI / ML",
    subtitle: "Machine Learning",
    solved: 34,
    total: 100,
    icon: Brain,
    color: "purple",
    href: "/interview-kit/ai-ml",
  },
  {
    title: "Deep Learning",
    subtitle: "Neural Networks",
    solved: 12,
    total: 50,
    icon: Sparkles,
    color: "pink",
    href: "/interview-kit/deep-learning",
  },
  {
    title: "Aptitude",
    subtitle: "Quantitative & Logical",
    solved: 36,
    total: 100,
    icon: GraduationCap,
    color: "amber",
    href: "/interview-kit/aptitude",
  },
  {
    title: "Data Analysis",
    subtitle: "Analytics & Visualization",
    solved: 22,
    total: 70,
    icon: LineChart,
    color: "cyan",
    href: "/interview-kit/data-analysis",
  },
  {
    title: "Data Science",
    subtitle: "Statistics & DS Concepts",
    solved: 29,
    total: 80,
    icon: LineChart,
    color: "indigo",
    href: "/interview-kit/data-science",
  },
  {
    title: "Self Introduction",
    subtitle: "HR & Personal Questions",
    solved: 8,
    total: 30,
    icon: Users,
    color: "rose",
    href: "/interview-kit/self-introduction",
  },
];

const companies: [string, string, number][] = [
  ["Google", "DSA", 92],
  ["Microsoft", "DSA", 86],
  ["Amazon", "DSA", 118],
  ["Meta", "DSA", 74],
  ["Adobe", "DSA", 61],
  ["NVIDIA", "DSA", 58],
  ["Flipkart", "DSA", 76],
  ["PhonePe", "DSA", 64],
  ["Razorpay", "DSA", 52],
  ["Swiggy", "DSA", 57],
  ["Zomato", "DSA", 48],
  ["Meesho", "DSA", 45],
  ["Zoho", "DSA", 68],
  ["Freshworks", "DSA", 51],
  ["Postman", "DSA", 43],
  ["Zerodha", "DSA", 39],
  ["Atlassian", "DSA", 55],
  ["Salesforce", "DSA", 62],
  ["Oracle", "DSA", 71],
  ["Uber", "DSA", 69],
  ["Walmart", "DSA", 73],
  ["JPMorgan", "DSA", 82],
];

const colorMap: Record<string, string> = {
  blue: "bg-[#e8f2ff] text-[#1769ff]",
  emerald: "bg-[#e5f9f0] text-[#0da36a]",
  violet: "bg-[#eeeaff] text-[#7254e8]",
  green: "bg-[#e8f8e8] text-[#159447]",
  orange: "bg-[#fff0df] text-[#ec851d]",
  purple: "bg-[#f0e9ff] text-[#8b4de8]",
  pink: "bg-[#ffeaf1] text-[#e94b82]",
  amber: "bg-[#fff4d9] text-[#d99500]",
  cyan: "bg-[#e4f8fb] text-[#0797aa]",
  indigo: "bg-[#e9edff] text-[#5269df]",
  rose: "bg-[#ffe8e8] text-[#df4d5d]",
};

function ProgressBar({
  value,
  total,
  color = "bg-[#1769ff]",
}: {
  value: number;
  total: number;
  color?: string;
}) {
  const percentage = Math.round((value / total) * 100);

  return (
    <div className="mt-3">
      <div className="h-2 overflow-hidden rounded-full bg-[#edf2f8]">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] font-bold text-[#71819b]">
        <span>{percentage}% complete</span>
        <span>
          {value}/{total}
        </span>
      </div>
    </div>
  );
}

export default function InterviewKitPage() {
  const router = useRouter();
  const [companySearch, setCompanySearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All");

  const totalSolved = categories.reduce((sum, item) => sum + item.solved, 0);
  const totalQuestions = categories.reduce((sum, item) => sum + item.total, 0);
  const overallProgress = Math.round((totalSolved / totalQuestions) * 100);

  const filteredCompanies = useMemo(() => {
    return companies.filter(([name, type]) => {
      const matchesSearch = name
        .toLowerCase()
        .includes(companySearch.toLowerCase());

      const matchesFilter =
        companyFilter === "All" || type === companyFilter;

      return matchesSearch && matchesFilter;
    });
  }, [companySearch, companyFilter]);

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#10254e]">
      <div className="mx-auto max-w-[1550px] px-5 pb-16 pt-8 md:px-8">
        <section className="interview-hero relative overflow-hidden rounded-[30px] bg-[#07143b] px-7 py-8 text-white shadow-[0_18px_50px_rgba(7,20,59,0.16)] md:px-10 md:py-10">

<a href="/home" className="interview-dashboard-button">
  Dashboard
</a>





<div className="interview-hero-copy interview-hero-copy-b2">
  <div className="interview-hero-label">INTERVIEW KIT</div>
  <h1>Prepare smarter.<br /><span>Interview with confidence.</span></h1>
  <p>Practice DSA, SQL, OOPs, AI/ML, Data Science, Aptitude and company-focused questions from one interview preparation workspace.</p>
</div>

<div className="interview-hero-copy interview-hero-copy-b3">
  <div className="interview-hero-label">INTERVIEW KIT</div>
  <h1>Practice today.<br /><span>Perform better tomorrow.</span></h1>
  <p>Strengthen DSA, SQL, OOPs, AI/ML, Data Science, Aptitude and company-focused interview preparation.</p>
</div>

<div className="interview-hero-progress">
  <div className="interview-progress-top">
    <span>OVERALL PROGRESS</span>
    <strong>{Math.round((505 / 1270) * 100)}%</strong>
  </div>

  <div className="interview-progress-main">
    <div
      className="interview-progress-ring"
      style={{
        background: `conic-gradient(#62a5ff 0 ${Math.round((505 / 1270) * 100)}%, rgba(255,255,255,.18) ${Math.round((505 / 1270) * 100)}% 100%)`
      }}
    >
      <span>505</span>
    </div>

    <div className="interview-progress-stats">
      <strong>Questions Solved</strong>
      <span>505 of 1270</span>
      <div className="interview-progress-bar">
        <div style={{ width: `${Math.round((505 / 1270) * 100)}%` }}></div>
      </div>
      <small>Keep practicing to improve your progress</small>
    </div>
  </div>

  <div className="interview-progress-bottom">
    <span>505 questions solved</span>
    <span>1270 total</span>
  </div>
</div>


          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#1769ff]/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-[#7c3aed]/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-extrabold tracking-[0.16em] text-[#b9d5ff]">
                <Sparkles className="h-4 w-4" />
                INTERVIEW KIT
              </div>

              <h1 className="mt-5 max-w-[720px] text-[38px] font-black tracking-[-0.045em] md:text-[50px]">
                Prepare smarter.
                <span className="block text-[#71a9ff]">
                  Interview with confidence.
                </span>
              </h1>

              <p className="mt-4 max-w-[670px] text-[14px] font-medium leading-7 text-white/65 md:text-[15px]">
                Practice DSA, SQL, OOPs, AI/ML, Data Science, Aptitude and
                company-focused questions from one interview preparation
                workspace.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/interview-kit/companies")}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#07143b] shadow-lg transition hover:-translate-y-0.5"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Continue Practice
                </button>

                <button
                  onClick={() => router.push("/interview-kit/mock-interview")}
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Mock Interview
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.08] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-white/55">
                    OVERALL PROGRESS
                  </p>
                  <p className="mt-2 text-4xl font-black">
                    {overallProgress}%
                  </p>
                </div>

                <div className="relative flex h-28 w-28 items-center justify-center">
                  <svg
                    viewBox="0 0 120 120"
                    className="-rotate-90"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#71a9ff"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={301.6}
                      strokeDashoffset={
                        301.6 - (301.6 * overallProgress) / 100
                      }
                    />
                  </svg>

                  <span className="absolute text-lg font-black">
                    {totalSolved}
                  </span>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[#71a9ff]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              <div className="mt-4 flex justify-between text-[11px] font-bold text-white/55">
                <span>{totalSolved} questions solved</span>
                <span>{totalQuestions} total</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#dce6f1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f2ff] text-[#1769ff]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-[#0da36a]">
                +12 this week
              </span>
            </div>
            <p className="mt-5 text-3xl font-black">{totalSolved}</p>
            <p className="mt-1 text-xs font-bold text-[#71819b]">
              Questions solved
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce6f1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0df] text-[#ec851d]">
                <Flame className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-[#ec851d]">
                Keep going
              </span>
            </div>
            <p className="mt-5 text-3xl font-black">7</p>
            <p className="mt-1 text-xs font-bold text-[#71819b]">
              Day streak
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce6f1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeeaff] text-[#7254e8]">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-[#7254e8]">
                100+
              </span>
            </div>
            <p className="mt-5 text-3xl font-black">22</p>
            <p className="mt-1 text-xs font-bold text-[#71819b]">
              Companies available
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce6f1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f9f0] text-[#0da36a]">
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xs font-extrabold text-[#0da36a]">
                Personal best
              </span>
            </div>
            <p className="mt-5 text-3xl font-black">84%</p>
            <p className="mt-1 text-xs font-bold text-[#71819b]">
              Practice accuracy
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#1769ff]">
                YOUR PREPARATION
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
                Practice by category
              </h2>
              <p className="mt-1 text-sm font-medium text-[#71819b]">
                Continue where you left off or explore a new topic.
              </p>
            </div>

            <button className="flex items-center gap-1 text-sm font-extrabold text-[#1769ff]">
              View all
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const percentage = Math.round(
                (category.solved / category.total) * 100
              );

              return (
                <button
                  key={category.title}
                  onClick={() => router.push(category.href)}
                  className="group rounded-2xl border border-[#dce6f1] bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorMap[category.color]}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f7fb] text-[#71819b] transition group-hover:bg-[#e8f2ff] group-hover:text-[#1769ff]">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  <h3 className="mt-5 text-[17px] font-black">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-[12px] font-medium text-[#71819b]">
                    {category.subtitle}
                  </p>

                  <ProgressBar
                    value={category.solved}
                    total={category.total}
                  />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#10254e]">
                      {category.solved} solved
                    </span>

                    <span className="text-xs font-bold text-[#71819b]">
                      {category.total - category.solved} remaining
                    </span>
                  </div>

                  <div className="mt-4 text-xs font-extrabold text-[#1769ff]">
                    {percentage < 100 ? "Continue practice" : "Completed"}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-[26px] border border-[#dce6f1] bg-white p-6 shadow-sm md:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#1769ff]">
                <BriefcaseBusiness className="h-5 w-5" />
                <span className="text-[11px] font-extrabold tracking-[0.16em]">
                  COMPANY PREPARATION
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-black">
                Practice by company
              </h2>

              <p className="mt-1 max-w-[680px] text-sm font-medium text-[#71819b]">
                Explore DSA-focused company practice sets across product
                companies, startups and established technology teams.
              </p>
            </div>

            <button
              onClick={() => router.push("/interview-kit/companies")}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#07143b] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#10245e]"
            >
              Explore all companies
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center rounded-xl border border-[#dce6f1] bg-[#f9fbfd] px-4">
              <Search className="h-5 w-5 text-[#8a99ae]" />
              <input
                value={companySearch}
                onChange={(event) => setCompanySearch(event.target.value)}
                placeholder="Search company..."
                className="h-12 flex-1 bg-transparent px-3 text-sm font-bold outline-none placeholder:text-[#9aa7b9]"
              />
            </div>

            <div className="flex rounded-xl border border-[#dce6f1] bg-[#f9fbfd] p-1">
              {["All", "DSA"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCompanyFilter(filter)}
                  className={`rounded-lg px-5 py-2 text-xs font-extrabold transition ${
                    companyFilter === filter
                      ? "bg-white text-[#1769ff] shadow-sm"
                      : "text-[#71819b]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCompanies.slice(0, 16).map(([company, , count]) => (
              <button
                key={company}
                onClick={() =>
                  router.push(
                    `/interview-kit/dsa/${company
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`
                  )
                }
                className="group flex items-center gap-3 rounded-2xl border border-[#e1e8f0] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#b9d4ff] hover:shadow-lg"
              >
                <CompanyLogo
  name={company}
  slug={company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")}
/>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold">
                    {company}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#71819b]">
                    DSA Interview Preparation
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-[#a1adbd] transition group-hover:text-[#1769ff]" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#1769ff]">
              INTERVIEW SIMULATION
            </p>
            <h2 className="mt-2 text-2xl font-black">
              Ready for the real interview?
            </h2>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#102a63] via-[#153c83] to-[#1769ff] p-7 text-white shadow-[0_18px_50px_rgba(23,105,255,0.18)] md:p-9">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-[#b9d5ff]">
                  <Zap className="h-5 w-5" />
                  <span className="text-xs font-extrabold tracking-[0.14em]">
                    MOCK INTERVIEW
                  </span>
                </div>

                <h3 className="mt-4 text-3xl font-black tracking-[-0.035em]">
                  Put your preparation to the test.
                </h3>

                <p className="mt-3 max-w-[650px] text-sm font-medium leading-6 text-white/70">
                  Choose a role, select your focus areas and enter a realistic
                  interview session with technical and HR questions.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Technical", "DSA", "SQL", "HR", "Mixed"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => router.push("/interview-kit/mock-interview")}
                className="flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-sm font-black text-[#102a63] shadow-xl transition hover:-translate-y-1"
              >
                <Play className="h-4 w-4 fill-current" />
                Start Mock Interview
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}



