"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  BarChart3,
  Brain,
  Check,
  Code2,
  Database,
  Globe,
  Layers3,
  Monitor,
  Shuffle,
  Timer,
  Play,
} from "lucide-react";
import { useState } from "react";

const subjects = [
  { id: "dsa", title: "DSA", subtitle: "Data Structures & Algorithms", icon: Code2, accent: "blue" },
  { id: "sql", title: "SQL", subtitle: "Queries & Databases", icon: Database, accent: "teal" },
  { id: "dbms", title: "DBMS", subtitle: "Database Management", icon: Layers3, accent: "purple" },
  { id: "oops", title: "OOPs", subtitle: "Object Oriented Programming", icon: Brain, accent: "orange" },
  { id: "networks", title: "Networks", subtitle: "Computer Networks", icon: Globe, accent: "blue" },
  { id: "os", title: "Operating Systems", subtitle: "OS Fundamentals", icon: Monitor, accent: "purple" },
  { id: "mixed", title: "Mixed", subtitle: "Multiple technical topics", icon: Shuffle, accent: "teal" },
];

const difficulties = [
  { id: "easy", title: "Easy", accent: "teal" },
  { id: "medium", title: "Medium", accent: "purple" },
  { id: "hard", title: "Hard", accent: "orange" },
];

const durations = [
  { id: "1", title: "1 min", accent: "teal" },
  { id: "5", title: "5 min", accent: "teal" },
  { id: "10", title: "10 min", accent: "teal" },
  { id: "20", title: "20 min", accent: "purple" },
  { id: "30", title: "30 min", accent: "blue" },
  { id: "45", title: "45 min", accent: "orange" },
  { id: "60", title: "60 min", accent: "orange" },
];

const accents = {
  blue: {
    icon: "bg-blue-500/10 text-blue-400",
    border: "border-blue-500",
    soft: "bg-blue-500/[0.07]",
    text: "text-blue-400",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-400",
    border: "border-purple-500",
    soft: "bg-purple-500/[0.07]",
    text: "text-purple-400",
  },
  teal: {
    icon: "bg-teal-500/10 text-teal-400",
    border: "border-teal-500",
    soft: "bg-teal-500/[0.07]",
    text: "text-teal-400",
  },
  orange: {
    icon: "bg-orange-500/10 text-orange-400",
    border: "border-orange-500",
    soft: "bg-orange-500/[0.07]",
    text: "text-orange-400",
  },
};

const questionCounts: Record<string, Record<string, number>> = {
  dsa: {
    "1": 1,
    "5": 2,
    "10": 3,
    "20": 5,
    "30": 7,
    "45": 10,
    "60": 12,
  },
  sql: {
    "1": 1,
    "5": 2,
    "10": 3,
    "20": 4,
    "30": 6,
    "45": 8,
    "60": 10,
  },
  dbms: {
    "1": 1,
    "5": 2,
    "10": 4,
    "20": 6,
    "30": 8,
    "45": 10,
    "60": 12,
  },
  oops: {
    "1": 1,
    "5": 2,
    "10": 4,
    "20": 6,
    "30": 8,
    "45": 10,
    "60": 12,
  },
  networks: {
    "1": 1,
    "5": 2,
    "10": 4,
    "20": 6,
    "30": 8,
    "45": 10,
    "60": 12,
  },
  os: {
    "1": 1,
    "5": 2,
    "10": 4,
    "20": 6,
    "30": 8,
    "45": 10,
    "60": 12,
  },
  mixed: {
    "1": 1,
    "5": 2,
    "10": 4,
    "20": 6,
    "30": 8,
    "45": 12,
    "60": 15,
  },
};

export default function MockInterviewPage() {
  const router = useRouter();

  const [selectedSubject, setSelectedSubject] = useState("dsa");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [selectedDuration, setSelectedDuration] = useState("30");

  const subject = subjects.find((item) => item.id === selectedSubject)!;
  const difficulty = difficulties.find(
    (item) => item.id === selectedDifficulty
  )!;
  const duration = durations.find(
    (item) => item.id === selectedDuration
  )!;

  const questionCount =
    questionCounts[selectedSubject]?.[selectedDuration] ?? 1;

  const startInterview = () => {
    router.push(
      `/interview-kit/mock-interview/session?subject=${selectedSubject}&difficulty=${selectedDifficulty}&duration=${selectedDuration}&questions=${questionCount}`
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="w-full px-5 py-5 sm:px-6 lg:px-7">

        {/* HEADER */}
        <div className="mb-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55">
                <Play className="h-3.5 w-3.5 fill-current text-blue-400" />
                Technical Interview Practice
              </div>

              <h1 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Mock{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Interview
                </span>
              </h1>

              <p className="mt-2 max-w-[720px] text-sm font-medium leading-6 text-white/50">
                Simulate a technical interview with questions from your
                Interview Kit. Choose your topic, difficulty and duration.
              </p>
            </div>

            <div className="flex items-center gap-2">
  <button
    onClick={() => router.push("/home")}
    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-black text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
  >
    <Home className="h-4 w-4" />
    Home
  </button>

  <button
    onClick={() => router.push("/interview-kit")}
    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-black text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
  >
    <ArrowLeft className="h-4 w-4" />
    Back
  </button>
</div>
          </div>
        </div>

        {/* SUBJECT */}
        <section className="rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-sm font-black text-blue-400">
              1
            </div>

            <div>
              <h2 className="text-xl font-black tracking-tight">
                What do you want to practice?
              </h2>
              <p className="mt-0.5 text-xs font-medium text-white/40">
                Select one subject or take a mixed technical interview.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((item) => {
              const Icon = item.icon;
              const isSelected = item.id === selectedSubject;
              const colors = accents[item.accent as keyof typeof accents];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSubject(item.id)}
                  className={`group relative flex min-h-[88px] items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? `border-blue-500 ${colors.soft}`
                      : "border-white/10 bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-black">{item.title}</p>
                    <p className="mt-1 truncate text-[11px] font-medium text-white/40">
                      {item.subtitle}
                    </p>
                  </div>

                  <div
                    className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-white/20"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* DIFFICULTY + DURATION */}
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">

          <section className="rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-sm font-black text-purple-400">
                2
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">
                  Difficulty
                </h2>
                <p className="mt-0.5 text-xs font-medium text-white/40">
                  Choose the level of questions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {difficulties.map((item) => {
                const isSelected = item.id === selectedDifficulty;
                const colors = accents[item.accent as keyof typeof accents];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDifficulty(item.id)}
                    className={`relative flex h-[76px] items-center justify-center rounded-xl border text-sm font-black transition ${
                      isSelected
                        ? `${colors.border} ${colors.soft}`
                        : "border-white/10 bg-white/[0.015] text-white/65 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <BarChart3
                      className={`mr-2 h-4 w-4 ${
                        isSelected ? colors.text : "text-white/35"
                      }`}
                    />

                    {item.title}

                    {isSelected && (
                      <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-sm font-black text-orange-400">
                3
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">
                  Interview Length
                </h2>
                <p className="mt-0.5 text-xs font-medium text-white/40">
                  Select how long you want to practice.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {durations.map((item) => {
                const isSelected = item.id === selectedDuration;
                const colors = accents[item.accent as keyof typeof accents];
                const questions =
                  questionCounts[selectedSubject]?.[item.id] ?? 1;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDuration(item.id)}
                    className={`relative flex h-[76px] flex-col items-center justify-center rounded-xl border transition ${
                      isSelected
                        ? `${colors.border} ${colors.soft}`
                        : "border-white/10 bg-white/[0.015] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Timer
                        className={`h-3.5 w-3.5 ${
                          isSelected ? colors.text : "text-white/35"
                        }`}
                      />

                      <span className="text-xs font-black">
                        {item.title}
                      </span>
                    </div>

                    <span className="mt-1 text-[9px] font-medium text-white/35">
                      {questions} questions
                    </span>

                    {isSelected && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* SETUP */}
        <section className="mt-3 rounded-2xl border border-white/10 bg-[#090909] p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/70 sm:flex">
                <Play className="h-4 w-4 fill-current" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
                  Interview Setup
                </p>

                <p className="mt-1 text-sm font-bold text-white/75">
                  Ready to start your technical interview?
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2">
                <Code2 className="h-3.5 w-3.5 text-blue-400" />
                <span className="text-xs font-bold">{subject.title}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2">
                <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs font-bold">{difficulty.title}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2">
                <Timer className="h-3.5 w-3.5 text-orange-400" />
                <span className="text-xs font-bold">{duration.title}</span>
              </div>

              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-3 py-2">
                <Database className="h-3.5 w-3.5 text-teal-400" />
                <span className="text-xs font-bold">
                  {questionCount} questions
                </span>
              </div>
            </div>

            <button
              onClick={startInterview}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 text-sm font-black text-white shadow-[0_8px_30px_rgba(59,130,246,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_35px_rgba(59,130,246,0.28)]"
            >
              <Play className="h-4 w-4 fill-current" />
              Start Mock Interview
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
