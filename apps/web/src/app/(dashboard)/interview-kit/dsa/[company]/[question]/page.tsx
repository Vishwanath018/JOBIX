"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import questionsData from "../../../dsa-questions.json";

type Example = {
  input?: string;
  output?: string;
  explanation?: string;
};

type Question = {
  id: string;
  title: string;
  difficulty?: string;
  topic?: string;
  tags?: string[];
  description?: string;
  problemStatement?: string;
  examples?: Example[];
  constraints?: string[];
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  leetcodeUrl?: string;
};

function renderInline(text: string) {
  const parts = text.split(/(`[^`]+`|\b(?:0|1|10|11)\b)/);

  return parts.map((part, index) => {
    if (/^`[^`]+`$/.test(part) || /^(0|1|10|11)$/.test(part)) {
      return (
        <code
          key={index}
          className="rounded-md bg-[#202020] px-1.5 py-0.5 font-mono text-[13px] text-white"
        >
          {part.replace(/^`|`$/g, "")}
        </code>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function cleanConstraintText(text: string) {
  let value = text
    .replace(/\\-/g, "-")
    .replace(/`/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, " ")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  value = value
    .replace(/\bn\s+u\s+m\s+s\b/gi, "nums")
    .replace(/\bnums\s*\.\s*length\b/gi, "nums.length")
    .replace(/\bnums\s*\[\s*i\s*\]/gi, "nums[i]");

  for (let i = 0; i < 5; i++) {
    value = value.replace(/(-?\d)\s+(?=\d)/g, "$1");
  }

  value = value
    .replace(/\b(\d+)\s+4\b/g, "$1^4")
    .replace(/\b(\d+)\s+3\b/g, "$1^3")
    .replace(/\b(\d+)\s+2\b/g, "$1^2");

  value = value
    .replace(/\s*<=\s*/g, " <= ")
    .replace(/\s*>=\s*/g, " >= ")
    .replace(/\s*<\s*/g, " < ")
    .replace(/\s*>\s*/g, " > ")
    .replace(/\s*=\s*/g, " = ")
    .replace(/\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .trim();

  value = value
    .replace(/^\s*-\s+/, "-")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\[\s+/g, "[")
    .replace(/\s+\]/g, "]")
    .replace(/\s*,\s*/g, ", ")
    .trim();

  return value;
}

function cleanProblemText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function renderProblem(text: string) {
  const normalized = cleanProblemText(text);

  const constraintMatch = normalized.match(
    /(?:^|\s)Constraints?\s*:\s*(.*)$/i
  );

  let mainText = normalized;
  let constraintsText = "";

  if (constraintMatch) {
    mainText = normalized
      .slice(0, constraintMatch.index)
      .trim();

    constraintsText = constraintMatch[1].trim();
  }

  const exampleMatches = [
    ...mainText.matchAll(
      /(?:^|\s)(Example\s+\d+)\s*:/gi
    ),
  ];

  const sections: {
    title?: string;
    content: string;
  }[] = [];

  if (exampleMatches.length > 0) {
    const firstExampleIndex = exampleMatches[0].index ?? mainText.length;

    const intro = mainText
      .slice(0, firstExampleIndex)
      .trim();

    if (intro) {
      sections.push({
        content: intro,
      });
    }

    exampleMatches.forEach((match, index) => {
      const startIndex =
        (match.index ?? 0) + match[0].length;

      const endIndex =
        index + 1 < exampleMatches.length
          ? exampleMatches[index + 1].index ?? mainText.length
          : mainText.length;

      const content = mainText
        .slice(startIndex, endIndex)
        .trim();

      sections.push({
        title: match[1],
        content,
      });
    });
  } else {
    sections.push({
      content: mainText,
    });
  }

  return (
    <div className="space-y-8">
      {sections.map((section, sectionIndex) => {
        if (section.title) {
          const exampleText = section.content
            .replace(/\s+(Input\s*:)/i, "\n$1")
            .replace(/\s+(Output\s*:)/i, "\n$1")
            .replace(/\s+(Explanation\s*:)/i, "\n$1")
            .trim();

          const exampleLines = exampleText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);

          return (
            <div key={sectionIndex}>
              <h3 className="mb-4 text-[15px] font-black text-white">
                {section.title}
              </h3>

              <div className="ml-4 space-y-4 border-l border-[#303030] pl-5">
                {exampleLines.map((line, index) => {
                  const match = line.match(
                    /^(Input|Output|Explanation)\s*:\s*(.*)$/i
                  );

                  if (!match) {
                    return (
                      <p
                        key={index}
                        className="text-[15px] leading-7 text-[#c7c7c7]"
                      >
                        {renderInline(line)}
                      </p>
                    );
                  }

                  const label = match[1];
                  const value = match[2];

                  if (
                    label.toLowerCase() === "explanation"
                  ) {
                    return (
                      <div key={index}>
                        <div className="mb-1 text-xs font-black uppercase tracking-wide text-[#777]">
                          Explanation
                        </div>

                        <p className="text-[15px] leading-7 text-[#c7c7c7]">
                          {renderInline(value)}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div key={index}>
                      <div className="mb-1 text-xs font-black uppercase tracking-wide text-[#777]">
                        {label}
                      </div>

                      <pre className="overflow-x-auto rounded-lg border border-[#292929] bg-[#181818] px-4 py-3 font-mono text-sm leading-6 text-[#d7d7d7]">
                        {value}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <div key={sectionIndex}>
            {section.content
              .split(/(?<=[.!?])\s+(?=[A-Z])/)
              .map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-4 text-[15px] leading-7 text-[#c7c7c7]"
                >
                  {renderInline(paragraph.trim())}
                </p>
              ))}
          </div>
        );
      })}

      {constraintsText && (
        <div>
          <h3 className="mb-4 text-[15px] font-black text-white">
            Constraints
          </h3>

          <div className="ml-4 space-y-3 border-l border-[#303030] pl-5">
            {constraintsText
              .split(/(?=-?\d+\s*<=)|(?=-?\d+\s*>=)/)
              .map((constraint) =>
                cleanConstraintText(constraint)
              )
              .filter(Boolean)
              .map((constraint, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 text-[15px] leading-7 text-[#c7c7c7]"
                >
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#777]" />

                  <code className="font-mono text-[14px] text-[#d7d7d7]">
                    {constraint}
                  </code>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default function DsaQuestionPage() {
  const params = useParams();

  const company = decodeURIComponent(String(params.company ?? ""));
  const questionId = decodeURIComponent(String(params.question ?? ""));

  const [solvedCount, setSolvedCount] = useState(0);
  const [problemImages, setProblemImages] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jobix_dsa_solved_questions");
      const solved: string[] = stored ? JSON.parse(stored) : [];

      setSolvedCount(Math.min(solved.length, 100));
    } catch {
      setSolvedCount(0);
    }
  }, []);
  const question = useMemo(() => {
    return (questionsData as Question[]).find(
      (item) =>
        item.id === questionId ||
        item.id === decodeURIComponent(questionId)
    );
  }, [questionId]);
  useEffect(() => {
    if (!question?.leetcodeUrl) {
      setProblemImages([]);
      return;
    }

    const match = question.leetcodeUrl.match(
      /\/problems\/([^/?#]+)/
    );

    if (!match) {
      setProblemImages([]);
      return;
    }

    const slug = match[1];

    let cancelled = false;

    const loadProblemImages = async () => {
      try {
        const response = await fetch(
          `/api/dsa/leetcode-images?slug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Image request failed");
        }

        const data = await response.json();

        if (!cancelled) {
          setProblemImages(
            Array.isArray(data?.images)
              ? data.images
              : []
          );
        }
      } catch {
        if (!cancelled) {
          setProblemImages([]);
        }
      }
    };

    loadProblemImages();

    return () => {
      cancelled = true;
    };
  }, [question]);




  const handleSolve = () => {
    if (!question?.leetcodeUrl) return;

    try {
      const stored = localStorage.getItem("jobix_dsa_solved_questions");
      const solved: string[] = stored ? JSON.parse(stored) : [];

      if (!solved.includes(question.id) && solved.length < 100) {
        const updated = [...solved, question.id];

        localStorage.setItem(
          "jobix_dsa_solved_questions",
          JSON.stringify(updated)
        );

        setSolvedCount(updated.length);
      }

      if (solved.length >= 100 && !solved.includes(question.id)) {
        return;
      }

      window.open(
        question.leetcodeUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch {
      window.open(
        question.leetcodeUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };
  if (!question) {
    return (
      <main className="min-h-screen bg-[#080808] px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/interview-kit/dsa/${encodeURIComponent(company)}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#999] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to DSA
          </Link>

          <div className="mt-12 rounded-2xl border border-[#292929] bg-[#111] p-8">
            <h1 className="text-2xl font-black">Question not found</h1>
          </div>
        </div>
      </main>
    );
  }

  const examples = Array.isArray(question.examples)
    ? question.examples.slice(0, 3)
    : [];

  const constraints = Array.isArray(question.constraints)
    ? question.constraints
    : [];

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-30 border-b border-[#242424] bg-[#080808]/95 backdrop-blur">
        <div className="flex h-[72px] items-center justify-between px-5 md:px-8">
          <Link
            href={`/interview-kit/dsa/${encodeURIComponent(company)}`}
            className="flex items-center gap-3 text-sm font-bold text-[#999] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>DSA</span>
            <span className="text-[#555]">/</span>
            <span className="capitalize text-white">{company}</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-[#292929] bg-[#111111] px-4 py-2.5 sm:flex">
              <span className="text-xs font-bold text-[#777]">
                Solved
              </span>

              <span className="text-sm font-black text-white">
                {solvedCount}/100
              </span>

              <span className="text-[10px] font-bold text-[#666]">
                FREE
              </span>
            </div>

            <button
              type="button"
              onClick={handleSolve}
              disabled={solvedCount >= 100}
              className="inline-flex items-center gap-2 rounded-xl border border-[#303030] bg-[#151515] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#202020] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {solvedCount >= 100
                ? "Free Limit Reached"
                : "Solve with LeetCode"}

              {solvedCount < 100 && (
                <ExternalLink className="h-4 w-4" />
              )}
            </button>

            <Image
              src="/jobix-symbol.svg"
              alt="JOBIX"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 md:py-10">
        <article>
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {question.difficulty && (
              <span className="rounded-full bg-[#2b2412] px-3 py-1.5 text-xs font-black text-[#d4a72c]">
                {question.difficulty}
              </span>
            )}

            {question.topic && (
              <span className="rounded-full bg-[#181818] px-3 py-1.5 text-xs font-bold text-[#999]">
                {question.topic}
              </span>
            )}

            {(question.tags || []).slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#181818] px-3 py-1.5 text-xs font-bold text-[#888]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            {question.title}
          </h1>

          <div className="mt-8 border-t border-[#292929] pt-8">
            <h2 className="mb-5 text-xl font-black">Problem</h2>

            <div className="rounded-2xl border border-[#292929] bg-[#0d0d0d] p-6 md:p-8">
              {renderProblem(
                question.problemStatement ||
                  question.description ||
                  ""
              )}
            </div>
          </div>

          {examples.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-5 text-xl font-black">Examples</h2>

              <div className="space-y-4">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-[#292929] bg-[#111111] p-5 md:p-6"
                  >
                    <h3 className="text-base font-black">
                      Example {index + 1}
                    </h3>

                    <div className="mt-5 space-y-4">
                      {example.input && (
                        <div>
                          <div className="mb-2 text-xs font-black uppercase tracking-wide text-[#777]">
                            Input
                          </div>

                          <pre className="overflow-x-auto rounded-lg border border-[#292929] bg-[#181818] p-4 font-mono text-sm leading-6 text-[#d7d7d7]">
                            {example.input}
                          </pre>
                        </div>
                      )}

                      {example.output && (
                        <div>
                          <div className="mb-2 text-xs font-black uppercase tracking-wide text-[#777]">
                            Output
                          </div>

                          <pre className="overflow-x-auto rounded-lg border border-[#292929] bg-[#181818] p-4 font-mono text-sm leading-6 text-[#d7d7d7]">
                            {example.output}
                          </pre>
                        </div>
                      )}

                      {example.explanation && (
                        <div>
                          <div className="mb-2 text-xs font-black uppercase tracking-wide text-[#777]">
                            Explanation
                          </div>

                          <p className="text-sm leading-7 text-[#c7c7c7]">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {constraints.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-5 text-xl font-black">Constraints</h2>

              <div className="rounded-2xl border border-[#292929] bg-[#111111] p-6 md:p-8">
                <ul className="space-y-3">
                  {constraints.map((constraint, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-7 text-[#c7c7c7]"
                    >
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#777]" />
                      <span>{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {question.approach && (
            <section className="mt-10">
              <h2 className="mb-5 text-xl font-black">Approach</h2>

              <div className="rounded-2xl border border-[#292929] bg-[#111111] p-6 md:p-8">
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#c7c7c7]">
                  {question.approach}
                </p>
              </div>
            </section>
          )}

          {(question.timeComplexity || question.spaceComplexity) && (
            <section className="mt-10">
              <h2 className="mb-5 text-xl font-black">Complexity</h2>

              <div className="grid gap-4 md:grid-cols-2">
                {question.timeComplexity && (
                  <div className="rounded-2xl border border-[#292929] bg-[#111111] p-5">
                    <div className="text-xs font-black uppercase tracking-wide text-[#777]">
                      Time Complexity
                    </div>

                    <div className="mt-3 font-mono text-sm text-white">
                      {question.timeComplexity}
                    </div>
                  </div>
                )}

                {question.spaceComplexity && (
                  <div className="rounded-2xl border border-[#292929] bg-[#111111] p-5">
                    <div className="text-xs font-black uppercase tracking-wide text-[#777]">
                      Space Complexity
                    </div>

                    <div className="mt-3 font-mono text-sm text-white">
                      {question.spaceComplexity}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          <section className="mt-12 border-t border-[#292929] pt-10">
            <div className="flex flex-col items-center rounded-2xl border border-[#292929] bg-[#111111] px-6 py-10 text-center">
              <h2 className="text-xl font-black">Ready to solve?</h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-[#777]">
                Open the original problem on LeetCode and solve it there.
              </p>

              <a
                href={question.leetcodeUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-black text-black transition hover:bg-[#e5e5e5]"
              >
                Solve
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}