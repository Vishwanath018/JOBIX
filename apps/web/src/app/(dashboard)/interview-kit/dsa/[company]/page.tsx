"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Search , Shuffle} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import CompanyLogo from "../../company-logo";
import CompanyHero from "../../company-hero";
import { companies } from "../../companies-data";
import {
  dsaQuestions,
  dsaTopics,
  type DsaDifficulty,
} from "../../dsa-questions";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const companyQuestionIds: Record<string, string[]> = {
  google: [
    "two-sum",
    "longest-substring-without-repeating",
    "merge-intervals",
    "number-of-islands",
    "course-schedule",
    "validate-bst",
    "longest-increasing-subsequence",
    "three-sum",
  ],

  amazon: [
    "two-sum",
    "best-time-to-buy-and-sell-stock",
    "number-of-islands",
    "binary-tree-level-order",
    "validate-bst",
    "course-schedule",
    "top-k-frequent-elements",
    "house-robber",
  ],

  microsoft: [
    "two-sum",
    "valid-parentheses",
    "reverse-linked-list",
    "binary-search",
    "number-of-islands",
    "maximum-depth-binary-tree",
    "house-robber",
    "three-sum",
  ],

  apple: [
    "two-sum",
    "valid-palindrome",
    "merge-two-sorted-lists",
    "binary-search",
    "maximum-depth-binary-tree",
    "number-of-islands",
    "coin-change",
  ],

  meta: [
    "two-sum",
    "valid-palindrome",
    "longest-substring-without-repeating",
    "binary-tree-level-order",
    "number-of-islands",
    "three-sum",
    "top-k-frequent-elements",
  ],

  netflix: [
    "two-sum",
    "merge-intervals",
    "longest-substring-without-repeating",
    "binary-search",
    "number-of-islands",
    "top-k-frequent-elements",
    "house-robber",
  ],

  tcs: [
    "two-sum",
    "valid-anagram",
    "reverse-linked-list",
    "binary-search",
    "valid-parentheses",
    "maximum-depth-binary-tree",
    "climbing-stairs",
  ],

  infosys: [
    "two-sum",
    "best-time-to-buy-and-sell-stock",
    "valid-anagram",
    "reverse-linked-list",
    "binary-search",
    "valid-parentheses",
    "climbing-stairs",
  ],

  wipro: [
    "two-sum",
    "contains-duplicate",
    "valid-palindrome",
    "reverse-linked-list",
    "binary-search",
    "maximum-depth-binary-tree",
    "climbing-stairs",
  ],

  accenture: [
    "two-sum",
    "contains-duplicate",
    "valid-anagram",
    "valid-parentheses",
    "binary-search",
    "reverse-linked-list",
    "climbing-stairs",
  ],
};

function getQuestions(slug: string) {
  return dsaQuestions.filter((question) =>
    (Array.isArray(question.companies) ? question.companies : []).includes(slug)
  );
}

const difficultyStyle: Record<DsaDifficulty, string> = {
  Easy: "bg-[#e8f8ef] text-[#0a8f5b]",
  Medium: "bg-[#fff4df] text-[#c77800]",
  Hard: "bg-[#ffe9eb] text-[#d93445]",
};

export default function CompanyDsaPage() {
  const params = useParams<{ company: string }>();
  const router = useRouter();

  const company = companies.find(
    (item) => slugify(item.name) === params.company
  );

  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const questions = useMemo(
    () => getQuestions(params.company),
    [params.company]
  );

  const filtered = questions
    .filter((question) =>
      question.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (question) =>
        topic === "All" || question.topic === topic
    )
    .filter(
      (question) =>
        difficulty === "All" ||
        (difficulty === "Most Repeated"
          ? question.frequency >= 90
          : question.difficulty === difficulty)
    )
    .sort((a, b) => b.frequency - a.frequency);

  if (!company) {
    return (
      <main className="min-h-screen bg-[#f5f8fc] p-8 text-[#10254e]">
        <button
          onClick={() => router.push("/interview-kit/companies")}
          className="flex items-center gap-2 text-sm font-black text-[#1769ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companies
        </button>

        <div className="mx-auto mt-20 max-w-xl rounded-3xl border border-[#dce6f1] bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-black">
            Company not found
          </h1>
        </div>
      </main>
    );
  }

  const mostRepeated = questions.filter(
    (question) => question.frequency >= 90
  ).length;

  const easy = questions.filter(
    (question) => question.difficulty === "Easy"
  ).length;

  const medium = questions.filter(
    (question) => question.difficulty === "Medium"
  ).length;

  const hard = questions.filter(
    (question) => question.difficulty === "Hard"
  ).length;

  const statCards = [
    ["Most Repeated", mostRepeated],
    ["Easy", easy],
    ["Medium", medium],
    ["Hard", hard],
  ];

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#10254e]">
      <div className="mx-auto max-w-[1450px] px-5 pb-16 pt-8 md:px-8">

        <button
          onClick={() =>
            router.push("/interview-kit/companies")
          }
          className="mb-6 flex items-center gap-2 text-sm font-black text-[#526783] hover:text-[#1769ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          All companies
        </button>

        <CompanyHero
          company={company.name}
          slug={params.company}
        />

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(([label, count]) => (
            <button
              key={label}
              onClick={() =>
                setDifficulty(
                  label === "Most Repeated"
                    ? "Most Repeated"
                    : String(label)
                )
              }
              className="rounded-2xl border border-[#dce6f1] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-black text-[#71819b]">
                {label}
              </p>

              <p className="mt-2 text-3xl font-black">
                {count}
              </p>

              <p className="text-xs font-bold text-[#9aa7b9]">
                Questions
              </p>
            </button>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-[#dce6f1] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="flex flex-1 items-center rounded-xl border border-[#dce6f1] px-4">
              <Search className="h-5 w-5 text-[#8a99ae]" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search DSA questions..."
                className="h-12 flex-1 bg-transparent px-3 text-sm font-bold outline-none placeholder:text-[#9aa7b9]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {dsaTopics.map((item) => (
                <button
                  key={item}
                  onClick={() => setTopic(item)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black transition ${
                    topic === item
                      ? "bg-[#07143b] text-white"
                      : "bg-[#f2f5f9] text-[#71819b] hover:bg-[#eaf0f7]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto">
            {["All", "Easy", "Medium", "Hard", "Most Repeated"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setDifficulty(item)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black transition ${
                    difficulty === item
                      ? item === "Most Repeated"
                        ? "bg-black text-white"
                        : "bg-[#1769ff] text-white"
                      : "bg-[#f2f5f9] text-[#71819b] hover:bg-[#eaf0f7]"
                  }`}
                >
                  {item === "Most Repeated" ? "Most Repeated 90%+" : item}
                </button>
              )
            )}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-black">
                DSA Questions
              </h2>

              <p className="mt-1 text-xs font-bold text-[#71819b]">
                {filtered.length} questions available
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                if (filtered.length === 0) return;
                const randomQuestion = filtered[Math.floor(Math.random() * filtered.length)];
                router.push(`/interview-kit/dsa/${params.company}/${randomQuestion.id}`);
              }}
              className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-xs font-black text-white transition hover:bg-[#1f1f1f]"
            >
              <Shuffle className="h-4 w-4" />
              Random Question
            </button>
          </div>


          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {filtered.map((question, index) => (
              <article
                key={question.id}
                className="rounded-2xl border border-[#dce6f1] bg-white p-5 shadow-sm transition hover:border-[#b9d4ff] hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f5fb] text-xs font-black text-[#71819b]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="font-black">
                        {question.title}
                      </h3>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${difficultyStyle[question.difficulty]}`}
                      >
                        {question.difficulty}
                      </span>

                      <span className="rounded-full bg-[#f0f4f8] px-2.5 py-1 text-[10px] font-black text-[#71819b]">
                        {question.topic}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-3">
                      {question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold text-[#8a99ae]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">

                    <div className="hidden text-right sm:block">
                      <p className="text-[9px] font-black text-[#9aa7b9]">
                        PRACTICE FREQUENCY
                      </p>

                      <p className="mt-1 text-sm font-black">
                        {question.frequency}%
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(
                          `/interview-kit/dsa/${params.company}/${question.id}`
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-black text-white transition hover:bg-[#1f1f1f]"
                    >
                      Solve
                      <ArrowRight className="h-4 w-4" />
                    </button>

                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-4 rounded-2xl border border-[#dce6f1] bg-white p-12 text-center">
              <p className="font-black">
                No questions found
              </p>

              <p className="mt-2 text-sm text-[#71819b]">
                Try another topic, difficulty or search term.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}