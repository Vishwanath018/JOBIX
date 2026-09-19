"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3;

type Option = {
  id: string;
  label: string;
  icon: string;
};

const steps: Record<Step, { title: string; subtitle?: string; options: Option[] }> = {
  1: {
    title: "What’s your experience level?",
    subtitle: "We'll provide expert tips and recommendations based on your answer",
    options: [
      { id: "student", label: "Student", icon: "student" },
      { id: "fresher", label: "Fresher", icon: "fresher" },
      { id: "experienced", label: "Experienced", icon: "experienced" }
    ]
  },
  2: {
    title: "What kind of companies are you applying to?",
    subtitle: "Select all that apply",
    options: [
      { id: "local", label: "Local", icon: "local" },
      { id: "multinational", label: "Multinational", icon: "multinational" },
      { id: "abroad", label: "Abroad", icon: "abroad" },
      { id: "other", label: "Other", icon: "other" }
    ]
  },
  3: {
    title: "What industries are you interested in?",
    subtitle: "Select all that apply",
    options: [
      { id: "technology", label: "Technology", icon: "technology" },
      { id: "finance", label: "Finance and business", icon: "finance" },
      { id: "healthcare", label: "Healthcare", icon: "healthcare" },
      { id: "education", label: "Education", icon: "education" },
      { id: "other", label: "Other", icon: "other" }
    ]
  }
};

function OptionIcon({ type }: { type: string }) {
  if (type === "student" || type === "fresher" || type === "experienced") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <path d="M24 31C24 25 25 20 29 17" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M24 31C20 29 16 29 13 31" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M29 17C30 12 34 10 39 11C39 16 35 19 29 17Z" fill="#F7D34A" stroke="#111111" strokeWidth="2.2" />
        {type !== "student" && (
          <>
            <path d="M24 27C29 25 34 26 37 29" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M24 27C19 25 15 26 12 29" stroke="#111111" strokeWidth="2.8" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if (type === "local") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <path d="M24 43C24 43 35 32 35 22C35 15.9 30.1 11 24 11C17.9 11 13 15.9 13 22C13 32 24 43 24 43Z" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" />
        <circle cx="24" cy="22" r="4.5" fill="white" stroke="#111111" strokeWidth="2.5" />
      </svg>
    );
  }

  if (type === "multinational") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="13" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" />
        <path d="M11 24H37M24 11C28 15 30 19 30 24C30 29 28 33 24 37M24 11C20 15 18 19 18 24C18 29 20 33 24 37M15 16C18 18 21 19 24 19C27 19 30 18 33 16M15 32C18 30 21 29 24 29C27 29 30 30 33 32" stroke="#111111" strokeWidth="1.8" />
      </svg>
    );
  }

  if (type === "abroad") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <path d="M8 26L21 22L34 9L39 10L31 24L40 28L39 32L27 28L21 39L17 38L19 27L8 29V26Z" fill="#F7D34A" stroke="#111111" strokeWidth="2.2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "technology") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <rect x="11" y="10" width="26" height="28" rx="3" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" />
        <path d="M16 31L20 27L24 31L29 24L34 31" stroke="#111111" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 16H37" stroke="#111111" strokeWidth="2.3" />
      </svg>
    );
  }

  if (type === "finance") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="15" width="28" height="20" rx="3" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" />
        <path d="M17 15V12C17 10.9 17.9 10 19 10H29C30.1 10 31 10.9 31 12V15" stroke="#111111" strokeWidth="2.5" />
        <path d="M10 21H38" stroke="#111111" strokeWidth="2.2" />
        <circle cx="30" cy="27" r="2" fill="#111111" />
      </svg>
    );
  }

  if (type === "healthcare") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <path d="M24 37C21 34 10 27 10 18C10 13 14 10 18 10C21 10 23 12 24 15C25 12 27 10 30 10C34 10 38 13 38 18C38 27 27 34 24 37Z" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" />
        <path d="M16 23H21L23 18L26 28L28 23H33" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "education") {
    return (
      <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
        <path d="M10 16L24 10L38 16L24 22L10 16Z" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M15 19V30C20 34 28 34 33 30V19" stroke="#111111" strokeWidth="2.5" />
        <path d="M38 17V29" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="38" height="38" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="14" fill="#F7D34A" stroke="#111111" strokeWidth="2.5" />
      <path d="M24 17V31M17 24H31" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ResumeBuilderQuestions() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState({
    experience: "",
    companyType: [] as string[],
    industry: [] as string[]
  });
  const [template, setTemplate] = useState("");
  const [mode, setMode] = useState("scratch");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setTemplate(params.get("template") || "");
    setMode(params.get("mode") || "scratch");

    const saved = sessionStorage.getItem("jobix_resume_builder_answers");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        const restoredAnswers = {
          experience: parsed.experience || "",
          companyType: Array.isArray(parsed.companyType)
            ? parsed.companyType
            : [],
          industry: Array.isArray(parsed.industry)
            ? parsed.industry
            : []
        };

        setAnswers(restoredAnswers);

        if (step === 1 && restoredAnswers.experience) {
          setSelected([restoredAnswers.experience]);
        }

        if (step === 2) {
          setSelected(restoredAnswers.companyType);
        }

        if (step === 3) {
          setSelected(restoredAnswers.industry);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (step === 1) {
      setSelected(answers.experience ? [answers.experience] : []);
    }

    if (step === 2) {
      setSelected(answers.companyType);
    }

    if (step === 3) {
      setSelected(answers.industry);
    }
  }, [step, answers.experience, answers.companyType, answers.industry]);

  const currentStep = useMemo(() => steps[step], [step]);

  const isMultiSelect = step === 2 || step === 3;

  const handleSelection = (id: string) => {
    if (!isMultiSelect) {
      setSelected([id]);
      return;
    }

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;

    const nextAnswers = {
      ...answers,
      experience: answers.experience,
      companyType: [...answers.companyType],
      industry: [...answers.industry]
    };

    if (step === 1) {
      nextAnswers.experience = selected[0];
    }

    if (step === 2) {
      nextAnswers.companyType = [...selected];
    }

    if (step === 3) {
      nextAnswers.industry = [...selected];
    }

    setAnswers(nextAnswers);

    sessionStorage.setItem(
      "jobix_resume_builder_answers",
      JSON.stringify(nextAnswers)
    );

    if (step < 3) {
      setStep((step + 1) as Step);
      return;
    }

    const query = new URLSearchParams({
      template,
      mode,
      experience: nextAnswers.experience,
      companyType: nextAnswers.companyType.join(","),
      industry: nextAnswers.industry.join(",")
    });

    router.push(`/resume-builder/editor?${query.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-[1240px] flex-col px-6 py-10 sm:px-10 lg:px-12">
        <div className="flex flex-1 flex-col items-center">
          <section className="w-full max-w-[1180px]">
            <div className="flex min-h-[105px] items-center justify-center">
              <h1 className="text-center text-[38px] font-bold leading-[1.12] tracking-[-0.035em] sm:text-[44px] lg:text-[48px]">
                {currentStep.title}
              </h1>
            </div>

            <div
              className={`mt-10 grid gap-[18px] ${
                step === 1
                  ? "mx-auto max-w-[790px] grid-cols-1 sm:grid-cols-3"
                  : step === 2
                    ? "mx-auto max-w-[1035px] grid-cols-2 sm:grid-cols-4"
                    : "mx-auto max-w-[1210px] grid-cols-2 sm:grid-cols-5"
              }`}
            >
              {currentStep.options.map((option) => {
                const isSelected = selected.includes(option.id);

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelection(option.id)}
                    className={`relative flex h-[134px] flex-col items-center justify-center rounded-[10px] border px-4 text-center transition ${
                      isSelected
                        ? "border-[2px] border-black bg-[#eef0ff]"
                        : "border-[#b8c0d8] bg-white hover:border-black"
                    }`}
                  >
                    {isSelected && isMultiSelect && (
                      <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[13px] font-bold text-white">
                        ✓
                      </span>
                    )}

                    <div className="mb-3 flex h-[40px] items-center justify-center">
                      <OptionIcon type={option.icon} />
                    </div>

                    <span className="text-[20px] font-semibold leading-[1.15]">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {currentStep.subtitle && (
              <p className="mt-10 text-center text-[19px] font-normal leading-7 text-black">
                {currentStep.subtitle}
              </p>
            )}

            <div className="mt-12 flex items-center justify-center gap-[10px]">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`h-[10px] w-[80px] rounded-full ${
                    item <= step ? "bg-[#10e8a1]" : "bg-[#e5e9f2]"
                  }`}
                />
              ))}
            </div>
          </section>

          <div className="mt-auto flex w-full justify-center pt-14">
            <button
              type="button"
              onClick={handleContinue}
              disabled={selected.length === 0}
              className={`h-[60px] w-full max-w-[310px] rounded-full text-[22px] font-semibold transition ${
                selected.length > 0
                  ? "bg-black text-white hover:bg-[#202020]"
                  : "cursor-not-allowed bg-[#d9d9d9] text-[#888888]"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
