"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { getDsaQuestion } from "@/app/(dashboard)/interview-kit/dsa-questions";

const Editor = dynamic(
  () => import("@monaco-editor/react"),
  { ssr: false }
);

const starterCode = (title: string, language: string) => {
  if (language === "python") {
    return `def solution():
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

  return `import java.util.*;

class Solution {
    public static void main(String[] args) {
        // ${title}

    }
}`;
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
  const [code, setCode] = useState(
    question ? starterCode(question.title, "java") : ""
  );
  const [submitted, setSubmitted] = useState(false);

  if (!question) {
    return (
      <main className="min-h-screen bg-[#f7f7f8] p-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-8">
          <h1 className="text-xl font-black text-gray-900">
            Question not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested DSA question could not be found.
          </p>

          <Link
            href={`/interview-kit/dsa/${company}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Back to Questions
          </Link>
        </div>
      </main>
    );
  }

  const changeLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    setCode(starterCode(question.title, nextLanguage));
    setSubmitted(false);
  };

  const resetCode = () => {
    setCode(starterCode(question.title, language));
    setSubmitted(false);
  };

  const editorLanguage =
    language === "python"
      ? "python"
      : language === "cpp"
        ? "cpp"
        : "java";

  return (
    <main className="min-h-screen bg-[#f7f7f8]">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-4">
          <Link
            href={`/interview-kit/dsa/${company}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black"
          >
            <ArrowLeft size={17} />
            Back to {company} DSA
          </Link>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold outline-none"
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>

            <button
              onClick={resetCode}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              onClick={() => setSubmitted(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-black text-white hover:bg-[#1f1f1f]"
            >
              <Play size={15} />
              Run Code
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-5 p-6 lg:grid-cols-[430px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-700">
                {question.difficulty}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                {question.topic}
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-gray-950">
              {question.title}
            </h1>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              {question.description}
            </p>
          </div>

          <div className="p-6">
            <h2 className="text-sm font-black text-gray-900">
              Examples
            </h2>

            <div className="mt-3 space-y-3">
              {question.examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-[#f7f7f8] p-4 text-sm"
                >
                  <p className="font-bold text-gray-800">
                    Example {index + 1}
                  </p>

                  <div className="mt-2 grid gap-2">
                    <div>
                      <span className="font-bold text-gray-500">
                        Input:
                      </span>{" "}
                      <span className="text-gray-700">
                        {example.input}
                      </span>
                    </div>

                    <div>
                      <span className="font-bold text-gray-500">
                        Output:
                      </span>{" "}
                      <span className="text-gray-700">
                        {example.output}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {question.tags.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-black text-gray-900">
                  Tags
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={question.leetcodeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block text-center text-sm font-bold text-gray-700 underline underline-offset-4 hover:text-black"
            >
              View original problem on LeetCode
            </a>
          </div>
        </section>

        <section className="flex min-h-[720px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-[#1e1e1e]">
          <div className="flex items-center justify-between border-b border-[#333] bg-[#181818] px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-300">
                Code Editor
              </span>

              <span className="rounded-md bg-[#2a2a2a] px-2 py-1 text-[11px] font-bold text-gray-400">
                {language === "java"
                  ? "Java"
                  : language === "python"
                    ? "Python"
                    : "C++"}
              </span>
            </div>

            {submitted && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <CheckCircle2 size={15} />
                Code ready
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1">
            <Editor
              height="100%"
              language={editorLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                automaticLayout: true,
                tabSize: 4,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>

          <div className="border-t border-[#333] bg-[#181818] px-5 py-3 text-xs text-gray-500">
            Code execution will be connected to the judging backend in the next phase.
          </div>
        </section>
      </div>
    </main>
  );
}
