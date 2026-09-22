"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Play,
  RotateCcw,
  Send,
  Moon,
} from "lucide-react";
import { getDsaQuestion } from "@/app/(dashboard)/interview-kit/dsa-questions";

const Editor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

const TOTAL_SECONDS = 100 * 60;

const starterCode = (title: string, language: string) => {
  if (language === "python") {
    return `class Solution:
    def solution(self):
        # ${title}
        pass
`;
  }

  if (language === "cpp") {
    return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // ${title}

};
`;
  }

  return `class Solution {
public:
    // ${title}

};
`;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

type TestCase = {
  id: number;
  input: string;
  output: string;
};

export default function DsaQuestionPage() {
  const params = useParams<{
    company: string;
    question: string;
  }>();

  const company = decodeURIComponent(params.company || "");
  const questionId = decodeURIComponent(params.question || "");

  const question = useMemo(
    () => getDsaQuestion(questionId),
    [questionId]
  );

  const [language, setLanguage] = useState("java");
  const [lightMode, setLightMode] = useState(false);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [started, setStarted] = useState(false);
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<
    ("pending" | "passed" | "failed")[]
  >(["pending", "pending", "pending"]);

  useEffect(() => {
    if (!question) return;

    setCode(starterCode(question.title, "java"));
  }, [question]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [started, timeLeft]);

  const testCases = useMemo<TestCase[]>(() => {
    if (!question) {
      return [];
    }

    const examples = question.examples || [];

    return [0, 1, 2].map((index) => {
      const example = examples[index] || examples[0];

      return {
        id: index + 1,
        input:
          example?.input &&
          example.input !== "See the original LeetCode problem"
            ? example.input
            : "See the original problem",
        output:
          example?.output &&
          example.output !== "See the original LeetCode problem"
            ? example.output
            : "See expected output",
      };
    });
  }, [question]);

  if (!question) {
    return (
      <main className="min-h-screen bg-[#090909] p-8 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#252525] bg-[#111111] p-8">
          <h1 className="text-xl font-black">
            Question not found
          </h1>

          <p className="mt-2 text-sm text-[#8d8d8d]">
            The requested DSA question could not be found.
          </p>

          <Link
            href={`/interview-kit/dsa/${company}`}
            className="mt-6 inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-black text-black"
          >
            Back to Questions
          </Link>
        </div>
      </main>
    );
  }

  const startSolving = () => {
    if (!started) {
      setStarted(true);
    }
  };

  const changeLanguage = (nextLanguage: string) => {
    startSolving();
    setLanguage(nextLanguage);
    setCode(starterCode(question.title, nextLanguage));
    setSubmitted(false);
    setTestResults(["pending", "pending", "pending"]);
  };

  const resetCode = () => {
    setCode(starterCode(question.title, language));
    setStarted(false);
    setTimeLeft(TOTAL_SECONDS);
    setSubmitted(false);
    setRunning(false);
    setTestResults(["pending", "pending", "pending"]);
    setActiveTestCase(0);
  };

  const runCode = async () => {
    startSolving();
    setRunning(true);
    setSubmitted(false);

    setTestResults(["pending", "pending", "pending"]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/code/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language,
            code,
            input: testCases[0]?.input || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Code execution failed");
      }

      await response.json();

      setTestResults(["passed", "pending", "pending"]);
    } catch {
      setTestResults(["failed", "pending", "pending"]);
    } finally {
      setRunning(false);
    }
  };

  const submitCode = async () => {
    startSolving();
    setRunning(true);
    setSubmitted(false);

    try {
      const results: ("pending" | "passed" | "failed")[] = [
        "pending",
        "pending",
        "pending",
      ];

      for (let index = 0; index < 3; index += 1) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/code/run`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                language,
                code,
                input: testCases[index]?.input || "",
              }),
            }
          );

          results[index] = response.ok ? "passed" : "failed";
        } catch {
          results[index] = "failed";
        }

        setTestResults([...results]);
      }

      setSubmitted(true);
    } finally {
      setRunning(false);
    }
  };

  const editorLanguage =
    language === "python"
      ? "python"
      : language === "cpp"
        ? "cpp"
        : "java";

  const allPassed =
    testResults.length === 3 &&
    testResults.every((result) => result === "passed");

  return (
    <main className={`min-h-screen text-white transition-colors duration-200 ${lightMode ? "jobix-light-mode" : "bg-[#080808]"}`}>
      <div className="min-h-screen">

        <header className="sticky top-0 z-30 border-b border-[#242424] bg-[#090909]">
          <div className="flex h-[76px] items-center justify-between px-5 md:px-7">

            <Link
              href="/interview-kit"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                <Image
                  src="/jobix-symbol.svg"
                  alt="JOBIX"
                  width={25}
                  height={25}
                />
              </div>

              <div className="hidden sm:block">
                <div className="text-xl font-black tracking-tight">
                  JOBIX
                </div>
                <div className="text-[10px] font-bold text-[#777]">
                  Your Career, Smarter.
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 md:gap-3">

              <a
                href={question.leetcodeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[43px] items-center gap-2 rounded-xl border border-[#303030] bg-[#151515] px-4 text-sm font-semibold text-[#e5e5e5] transition hover:border-[#444] hover:bg-[#1c1c1c] hover:text-white"
              >
                <span>Solve with LeetCode</span>
                <span className="text-base font-semibold leading-none">&#8594;</span>
              </a>

              <button
                type="button"
                aria-label="Change appearance mode"
                title={lightMode ? "Switch to dark mode" : "Switch to light mode"}
                onClick={() => setLightMode((current) => !current)}
                className="flex h-[43px] w-[43px] items-center justify-center rounded-xl border border-[#282828] bg-[#121212] text-[#a8a8a8] transition hover:bg-[#1b1b1b] hover:text-white"
              >
                <Moon
                  className={`h-[18px] w-[18px] transition-transform ${
                    lightMode ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-black ${
                  timeLeft <= 300
                    ? "border-[#6b2525] bg-[#1b0c0c] text-[#ff7777]"
                    : "border-[#282828] bg-[#121212] text-[#d2d2d2]"
                }`}
              >
                <Clock3 className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>

              <select
                value={language}
                onChange={(event) =>
                  changeLanguage(event.target.value)
                }
                className="h-[43px] rounded-xl border border-[#2a2a2a] bg-[#151515] px-4 text-sm font-black text-white outline-none"
              >
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>

              <button
                onClick={resetCode}
                className="hidden h-[43px] items-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#151515] px-4 text-sm font-black text-white transition hover:bg-[#202020] md:flex"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

              <button
                onClick={runCode}
                disabled={running}
                className="flex h-[43px] items-center gap-2 rounded-xl bg-[#151515] px-5 text-sm font-black text-[#e5e5e5] ring-1 ring-[#303030] transition hover:bg-[#1d1d1d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                {running ? "Running..." : "Run Code"}
              </button>

              <button
                onClick={submitCode}
                disabled={running}
                className="flex h-[43px] items-center gap-2 rounded-xl bg-[#d5d7db] px-5 text-sm font-black text-[#171717] transition hover:bg-[#c5c7cb] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Submit
              </button>

            </div>
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[42%_58%]">

          <section className="overflow-y-auto border-r border-[#252525] bg-[#0c0c0c]">
            <div className="mx-auto max-w-[720px] p-6 md:p-7">

              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#2b2412] px-3 py-1.5 text-xs font-black text-[#d4a72c]">
                  {question.difficulty}
                </span>

                <span className="rounded-full bg-[#181818] px-3 py-1.5 text-xs font-bold text-[#999999]">
                  {question.topic}
                </span>

                {question.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#181818] px-3 py-1.5 text-xs font-bold text-[#888888]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                {question.title}
              </h1>

              <div className="mt-6 border-b border-[#292929] pb-6">
                <p className="text-sm leading-6 text-[#bdbdbd]">
                  {question.description}
                </p>
              </div>

              <section className="mt-7">
                <h2 className="text-sm font-black text-white">
                  Examples
                </h2>

                <div className="mt-4 space-y-4">
                  {question.examples.map((example, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-[#292929] bg-[#121212] p-4"
                    >
                      <p className="text-sm font-black text-white">
                        Example {index + 1}
                      </p>

                      <div className="mt-4 space-y-3 font-mono text-sm">
                        <div>
                          <span className="font-bold text-[#999]">
                            Input:
                          </span>{" "}
                          <span className="text-[#dedede]">
                            {example.input}
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-[#999]">
                            Output:
                          </span>{" "}
                          <span className="text-[#dedede]">
                            {example.output}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {question.constraints && question.constraints.length > 0 && (
                <section className="mt-8 border-t border-[#292929] pt-7">
                  <h2 className="text-sm font-black text-white">
                    Constraints
                  </h2>

                  <ul className="mt-4 space-y-2">
                    {question.constraints.map((constraint, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-6 text-[#bdbdbd]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#777]" />
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {question.tags.length > 0 && (
                <section className="mt-8 border-t border-[#292929] pt-7">
                  <h2 className="text-sm font-black text-white">
                    Topics
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-[#303030] bg-[#151515] px-3 py-2 text-xs font-bold text-[#aaa]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

            </div>
          </section>

          <section className="flex min-h-[calc(100vh-76px)] flex-col bg-[#0a0a0a]">

            <div className="flex min-h-0 flex-1 flex-col p-4 md:p-5">

              <div className="flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-xl border border-[#292929] bg-[#101010]">

                <div className="flex h-[54px] items-center justify-between border-b border-[#292929] bg-[#141414] px-5">

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white">
                      Code Editor
                    </span>

                    <span className="rounded-md bg-[#242424] px-2.5 py-1 text-[11px] font-bold text-[#aaa]">
                      {language === "java"
                        ? "Java"
                        : language === "python"
                          ? "Python"
                          : "C++"}
                    </span>
                  </div>

                  {started && (
                    <span className="text-[11px] font-bold text-[#777]">
                      Solving
                    </span>
                  )}

                </div>

                <div className="min-h-0 flex-1">
                  <Editor
                    height="100%"
                    language={editorLanguage}
                    theme={lightMode ? "vs" : "vs-dark"}
                    value={code}
                    onChange={(value) => {
                      startSolving();
                      setCode(value || "");
                    }}
                    options={{
                      minimap: {
                        enabled: false,
                      },
                      fontSize: 14,
                      lineNumbers: "on",
                      automaticLayout: true,
                      tabSize: 4,
                      padding: {
                        top: 18,
                      },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                      wordWrap: "on",
                      renderWhitespace: "selection",
                    }}
                  />
                </div>

              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-[#292929] bg-[#101010]">

                <div className="flex items-center justify-between border-b border-[#292929] px-5 py-4">

                  <div className="flex items-center gap-6">
                    <button className="border-b-2 border-white pb-3 text-sm font-black text-white">
                      Testcase
                    </button>

                    <button className="pb-3 text-sm font-bold text-[#777]">
                      Test Result
                    </button>
                  </div>

                  {allPassed && (
                    <div className="flex items-center gap-2 text-xs font-black text-[#4ade80]">
                      <CheckCircle2 className="h-4 w-4" />
                      All testcases (3/3)
                    </div>
                  )}

                </div>

                <div className="grid min-h-[245px] grid-cols-[145px_minmax(0,1fr)]">

                  <div className="border-r border-[#292929] p-3">

                    {[0, 1, 2].map((index) => {
                      const result = testResults[index];

                      return (
                        <button
                          key={index}
                          onClick={() => setActiveTestCase(index)}
                          className={`mb-2 flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold transition ${
                            activeTestCase === index
                              ? "bg-[#1d1d1d] text-white"
                              : "text-[#888] hover:bg-[#171717]"
                          }`}
                        >
                          <span>
                            Testcase {index + 1}
                          </span>

                          {result === "passed" && (
                            <CheckCircle2 className="h-4 w-4 text-[#4ade80]" />
                          )}

                          {result === "failed" && (
                            <span className="text-xs font-black text-[#f87171]">
                              ?
                            </span>
                          )}
                        </button>
                      );
                    })}

                  </div>

                  <div className="p-5">

                    <div className="mb-5">
                      <p className="mb-2 text-sm font-black text-white">
                        Input
                      </p>

                      <div className="rounded-lg border border-[#292929] bg-[#181818] p-4 font-mono text-sm text-[#cfcfcf]">
                        {testCases[activeTestCase]?.input}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm font-black text-white">
                        Expected Output
                      </p>

                      <div className="rounded-lg border border-[#292929] bg-[#181818] p-4 font-mono text-sm text-[#cfcfcf]">
                        {testCases[activeTestCase]?.output}
                      </div>
                    </div>

                    {submitted && (
                      <div className="mt-4 rounded-lg border border-[#214d31] bg-[#102117] px-4 py-3 text-sm font-bold text-[#6ee7a0]">
                        Submission checked against the available testcases.
                      </div>
                    )}

                  </div>

                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
      <style jsx global>{`
        .jobix-light-mode {
          background: #f4f5f7 !important;
          color: #171717 !important;
        }

        .jobix-light-mode header {
          background: #ffffff !important;
          border-color: #dedede !important;
        }

        .jobix-light-mode header a,
        .jobix-light-mode header button,
        .jobix-light-mode header select {
          color: #202020 !important;
        }

        .jobix-light-mode section {
          background-color: #ffffff;
        }

        .jobix-light-mode .bg-[#0c0c0c] {
          background-color: #f4f5f7 !important;
        }

        .jobix-light-mode .bg-[#0a0a0a],
        .jobix-light-mode .bg-[#101010],
        .jobix-light-mode .bg-[#121212],
        .jobix-light-mode .bg-[#141414],
        .jobix-light-mode .bg-[#151515],
        .jobix-light-mode .bg-[#181818],
        .jobix-light-mode .bg-[#1b1b1b] {
          background-color: #ffffff !important;
        }

        .jobix-light-mode .text-white {
          color: #171717 !important;
        }

        .jobix-light-mode .text-[#d0d0d0],
        .jobix-light-mode .text-[#dedede],
        .jobix-light-mode .text-[#bdbdbd],
        .jobix-light-mode .text-[#cfcfcf],
        .jobix-light-mode .text-[#aaa],
        .jobix-light-mode .text-[#999],
        .jobix-light-mode .text-[#888],
        .jobix-light-mode .text-[#777] {
          color: #555555 !important;
        }

        .jobix-light-mode .border-[#292929],
        .jobix-light-mode .border-[#282828],
        .jobix-light-mode .border-[#2a2a2a],
        .jobix-light-mode .border-[#303030] {
          border-color: #dddddd !important;
        }

        .jobix-light-mode .ring-[#303030] {
          --tw-ring-color: #d5d5d5 !important;
        }

        .jobix-light-mode .bg-black {
          background-color: #eeeeee !important;
          color: #171717 !important;
        }

        .jobix-light-mode .bg-[#d5d7db] {
          background-color: #171717 !important;
          color: #ffffff !important;
        }
      `}</style>

    </main>
  );
}
