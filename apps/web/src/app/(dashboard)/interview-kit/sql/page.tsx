"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Flame,
  Search,
  Shuffle,
  SlidersHorizontal,
  Star,
  Trophy,
} from "lucide-react";
import questionsData from "./sql-questions.json";

type SQLQuestion = {
  id: string;
  number: string;
  title: string;
  slug: string;
  difficulty: string;
  topic?: string;
  topics?: string[];
  leetcodeUrl: string;
  statement?: string;
};

const SOLVED_KEY = "jobix_sql_solved_questions";

export default function SQLPracticePage() {
  const questions = questionsData as SQLQuestion[];

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [topic, setTopic] = useState("All");
  const [showMustPractice, setShowMustPractice] = useState(true);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SOLVED_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSolvedIds(parsed);
        }
      }
    } catch {
      setSolvedIds([]);
    }
  }, []);

  const topics = useMemo(() => {
    const values = new Set<string>();

    questions.forEach((question) => {
      question.topics?.forEach((item) => values.add(item));
      if (question.topic) values.add(question.topic);
    });

    return Array.from(values).sort();
  }, [questions]);

  const mustPractice = useMemo(() => {
    const easy = questions
      .filter((q) => q.difficulty === "Easy")
      .slice(0, 8);

    const medium = questions
      .filter((q) => q.difficulty === "Medium")
      .slice(0, 12);

    const hard = questions
      .filter((q) => q.difficulty === "Hard")
      .slice(0, 5);

    return [...easy, ...medium, ...hard];
  }, [questions]);

  const mostRepeated = useMemo(() => {
    return questions.filter(
      (question) =>
        Array.isArray(question.topics) &&
        question.topics.some((item) =>
          item.toLowerCase().includes("company")
        )
    );
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        !search ||
        question.title.toLowerCase().includes(search.toLowerCase()) ||
        question.number.toLowerCase().includes(search.toLowerCase()) ||
        question.slug.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" || question.difficulty === difficulty;

      const questionTopics = [
        ...(question.topics || []),
        ...(question.topic ? [question.topic] : []),
      ];

      const matchesTopic =
        topic === "All" ||
        questionTopics.some(
          (item) => item.toLowerCase() === topic.toLowerCase()
        );

      const matchesPractice =
        !showMustPractice ||
        mustPractice.some((item) => item.id === question.id);

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTopic &&
        matchesPractice
      );
    });
  }, [
    questions,
    search,
    difficulty,
    topic,
    showMustPractice,
    mustPractice,
  ]);

  const solvedCount = solvedIds.length;
  const progress =
    questions.length > 0
      ? Math.min((solvedCount / questions.length) * 100, 100)
      : 0;

  const toggleSolved = (question: SQLQuestion) => {
    const exists = solvedIds.includes(question.id);

    const updated = exists
      ? solvedIds.filter((id) => id !== question.id)
      : [...solvedIds, question.id];

    setSolvedIds(updated);
    localStorage.setItem(SOLVED_KEY, JSON.stringify(updated));
  };

  const randomQuestion = () => {
    const pool = filteredQuestions.length
      ? filteredQuestions
      : questions;

    if (!pool.length) return;

    const question =
      pool[Math.floor(Math.random() * pool.length)];

    window.location.href = `/interview-kit/sql/${question.slug || question.id}`;
  };

  const resetFilters = () => {
    setSearch("");
    setDifficulty("All");
    setTopic("All");
    setShowMustPractice(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1500px] px-8 py-5">
        <Link
          href="/interview-kit"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Interview Kit
        </Link>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              SQL Practice
            </h1>

            <p className="mt-2 text-base text-zinc-500">
              LeetCode SQL &amp; Database interview problems
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-zinc-800 bg-[#080808] px-6 py-3 shadow-sm">
              <p className="text-xs text-zinc-500">Solved</p>
              <p className="mt-1 text-xl font-semibold">
                <span className="text-white">{solvedCount}</span>
                <span className="text-zinc-600">
                  {" "}
                  / {questions.length}
                </span>
              </p>
            </div>

            <button
              onClick={randomQuestion}
              className="inline-flex h-14 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-6 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              <Shuffle size={17} />
              Random
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <button
            onClick={() => setShowMustPractice(true)}
            className={`group rounded-2xl border p-6 text-left transition ${
              showMustPractice
                ? "border-zinc-600 bg-[#0b0b0b]"
                : "border-zinc-800 bg-[#070707] hover:border-zinc-600"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-zinc-200">
                <BookOpen size={24} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition group-hover:text-white">
                <ArrowRight size={18} />
              </div>
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Must Practice
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Core SQL questions selected from the LeetCode dataset.
            </p>

            <p className="mt-5 text-sm font-semibold text-white">
              {mustPractice.length} questions
            </p>
          </button>

          <button
            onClick={() => {
              setShowMustPractice(false);
              if (mostRepeated.length > 0) {
                const first = mostRepeated[0];
                setSearch(first.title);
              }
            }}
            className="group rounded-2xl border border-zinc-800 bg-[#070707] p-6 text-left transition hover:border-zinc-600"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-orange-400">
                <Flame size={24} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 transition group-hover:text-white">
                <ArrowRight size={18} />
              </div>
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Most Repeated
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Questions with company information in the source dataset.
            </p>

            <p className="mt-5 text-sm font-semibold text-orange-400">
              {mostRepeated.length} questions
            </p>
          </button>

          <div className="rounded-2xl border border-zinc-800 bg-[#070707] p-6">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-purple-400">
                <Trophy size={24} />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400">
                <Star size={18} />
              </div>
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              SQL Progress
            </h2>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-4 text-sm text-zinc-500">
              Keep solving to complete the SQL set.
            </p>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-[#050505] p-5">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search SQL questions..."
                className="h-14 w-full rounded-xl border border-zinc-800 bg-black pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-500"
              />
            </div>

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-14 rounded-xl border border-zinc-800 bg-black px-5 text-sm text-zinc-300 outline-none focus:border-zinc-500"
            >
              <option value="All">All Topics</option>
              {topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="h-14 rounded-xl border border-zinc-800 bg-black px-5 text-sm text-zinc-300 outline-none focus:border-zinc-500"
            >
              <option value="All">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <button
              onClick={resetFilters}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-black px-5 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              <SlidersHorizontal size={17} />
              Reset
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
            <span>{filteredQuestions.length} questions</span>

            {showMustPractice && (
              <button
                onClick={() => setShowMustPractice(false)}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-white"
              >
                Must Practice
              </button>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-[#050505]">
          <div className="grid grid-cols-[70px_minmax(0,1fr)_150px_220px_110px] border-b border-zinc-800 bg-[#090909] px-5 py-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <span>#</span>
            <span>Question</span>
            <span>Difficulty</span>
            <span>Topics</span>
            <span className="text-right">Action</span>
          </div>

          {filteredQuestions.map((question) => {
            const solved = solvedIds.includes(question.id);

            return (
              <div
                key={question.id}
                className="grid grid-cols-[70px_minmax(0,1fr)_150px_220px_110px] items-center border-b border-zinc-900 px-5 py-4 transition hover:bg-zinc-950"
              >
                <span className="text-sm text-zinc-500">
                  {question.number}
                </span>

                <Link
                  href={`/interview-kit/sql/${question.slug || question.id}`}
                  className="truncate pr-5 text-[15px] font-medium text-white hover:underline"
                >
                  {question.title}
                </Link>

                <span>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                      question.difficulty === "Easy"
                        ? "border-emerald-900 bg-emerald-950/40 text-emerald-400"
                        : question.difficulty === "Medium"
                          ? "border-yellow-900 bg-yellow-950/40 text-yellow-400"
                          : "border-red-900 bg-red-950/40 text-red-400"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </span>

                <div className="flex flex-wrap gap-2">
                  {(question.topics?.length
                    ? question.topics
                    : [question.topic || "Database"]
                  )
                    .slice(0, 3)
                    .map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400"
                      >
                        {item}
                      </span>
                    ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => toggleSolved(question)}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium transition ${
                      solved
                        ? "border-emerald-900 bg-emerald-950/40 text-emerald-400"
                        : "border-zinc-700 bg-black text-zinc-300 hover:border-zinc-500 hover:text-white"
                    }`}
                  >
                    {solved ? "Solved" : "Mark"}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredQuestions.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-zinc-500">
                No SQL questions found.
              </p>

              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
