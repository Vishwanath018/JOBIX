"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ExternalLink, Shuffle } from "lucide-react";
import questionsData from "../sql-questions.json";

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
  mysqlSchema?: string;
  sampleTestCase?: string;
};

const SOLVED_KEY = "jobix_sql_solved_questions";

export default function SQLQuestionPage() {
  const params = useParams();
  const questionId = decodeURIComponent(String(params.question));

  const questions = questionsData as SQLQuestion[];

  const question = useMemo(
    () =>
      questions.find(
        (q) => q.id === questionId || q.slug === questionId
      ),
    [questions, questionId]
  );

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

  const isSolved = question ? solvedIds.includes(question.id) : false;

  const markSolved = () => {
    if (!question || isSolved) return;

    const updated = [...solvedIds, question.id];
    setSolvedIds(updated);
    localStorage.setItem(SOLVED_KEY, JSON.stringify(updated));
  };

  const randomQuestion = () => {
    if (!questions.length) return;

    const random =
      questions[Math.floor(Math.random() * questions.length)];

    window.location.href = `/interview-kit/sql/${random.slug || random.id}`;
  };

  if (!question) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Question not found</h1>
          <Link
            href="/interview-kit/sql"
            className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to SQL
          </Link>
        </div>
      </main>
    );
  }

  const difficultyClass =
    question.difficulty === "Easy"
      ? "text-emerald-400"
      : question.difficulty === "Medium"
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 border-b border-zinc-900 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/interview-kit/sql"
              className="flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <ArrowLeft size={17} />
              SQL
            </Link>

            <div className="h-5 w-px bg-zinc-800" />

            <span className="text-sm font-medium text-zinc-300">
              Question {question.number}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm">
              <span className="text-zinc-500">Solved </span>
              <span className="font-semibold text-white">
                {solvedIds.length}
              </span>
              <span className="text-zinc-600"> / {questions.length}</span>
            </div>

            <button
              onClick={randomQuestion}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              <Shuffle size={15} />
              Random
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-400">
              SQL
            </span>

            <span className={`text-sm font-medium ${difficultyClass}`}>
              {question.difficulty}
            </span>

            {question.topics?.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs text-zinc-500"
              >
                {topic}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            {question.title}
          </h1>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markSolved}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Solve with LeetCode
            <ExternalLink size={16} />
          </a>

          <button
            onClick={markSolved}
            disabled={isSolved}
            className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition ${
              isSolved
                ? "border-emerald-900 bg-emerald-950/40 text-emerald-400"
                : "border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white"
            }`}
          >
            <CheckCircle2 size={16} />
            {isSolved ? "Solved" : "Mark as Solved"}
          </button>
        </div>

        <section className="rounded-xl border border-zinc-900 bg-[#050505]">
          <div className="border-b border-zinc-900 px-6 py-4">
            <h2 className="text-sm font-semibold text-zinc-200">
              Problem
            </h2>
          </div>

          <div className="px-6 py-7">
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-300">
              {question.statement || "Problem statement unavailable."}
            </div>
          </div>
        </section>

        {question.mysqlSchema && (
          <section className="mt-6 rounded-xl border border-zinc-900 bg-[#050505]">
            <div className="border-b border-zinc-900 px-6 py-4">
              <h2 className="text-sm font-semibold text-zinc-200">
                Database Schema
              </h2>
            </div>

            <pre className="overflow-x-auto px-6 py-6 text-sm leading-6 text-zinc-400">
              {question.mysqlSchema}
            </pre>
          </section>
        )}

        {question.sampleTestCase && (
          <section className="mt-6 rounded-xl border border-zinc-900 bg-[#050505]">
            <div className="border-b border-zinc-900 px-6 py-4">
              <h2 className="text-sm font-semibold text-zinc-200">
                Example
              </h2>
            </div>

            <pre className="overflow-x-auto whitespace-pre-wrap px-6 py-6 text-sm leading-6 text-zinc-400">
              {question.sampleTestCase}
            </pre>
          </section>
        )}

        <section className="mt-8 flex flex-col items-center justify-center rounded-xl border border-zinc-900 bg-[#050505] px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-white">
            Ready to solve?
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Open this exact SQL problem on LeetCode and solve it using the
            official SQL environment.
          </p>

          <a
            href={question.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={markSolved}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Open LeetCode
            <ExternalLink size={16} />
          </a>
        </section>
      </div>
    </main>
  );
}
