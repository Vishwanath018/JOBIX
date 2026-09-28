"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function MockInterviewSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subject = searchParams.get("subject") || "dsa";
  const difficulty = searchParams.get("difficulty") || "medium";

  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [remaining, setRemaining] = useState(210);
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const finishedRef = useRef(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const finishingRef = useRef(false);

  useEffect(() => {
    const storedToken =
      localStorage.getItem("jobix_access_token_v2") ||
      localStorage.getItem("jobix_access_token") ||
      localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/");
      return;
    }

    setToken(storedToken);
  }, [router]);

  const finishInterview = useCallback(async () => {
    if (!token || !sessionId || finishingRef.current) return;

    finishingRef.current = true;

    try {
      await fetch(`${API_BASE}/api/mock-interview/finish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });
    } catch {
      // The backend expiration still protects the session.
    }

    setFinished(true);
  }, [token, sessionId]);

  useEffect(() => {
    if (!token) return;

    const startInterview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE}/api/mock-interview/start`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            difficulty,
          }),
        });

        const data = await response.json();

      

        setSessionId(data.session_id);
        setQuestion(data.interviewer);
        setRemaining(data.remaining_seconds ?? 210);
        setProvider(data.provider || "unknown");
        setModel(data.model || "unknown");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to start mock interview."
        );
      } finally {
        setLoading(false);
      }
    };

    startInterview();
  }, [token, subject, difficulty]);

  useEffect(() => {
    if (!sessionId || finished) return;

    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          void finishInterview();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [sessionId, finished, finishInterview]);

  const sendAnswer = async () => {
    if (!token || !sessionId || !answer.trim() || sending || finished) return;

    try {
      setSending(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/mock-interview/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          answer: answer.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to continue interview.");
      }

      setQuestion(data.interviewer);
      setRemaining(data.remaining_seconds ?? remaining);
      setProvider(data.provider || "unknown");
      setModel(data.model || "unknown");
      setAnswer("");

      if ("speechSynthesis" in window && data.interviewer) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(data.interviewer);
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue interview."
      );
    } finally {
      setSending(false);
    }
  };

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setAnswer((current) =>
        current ? `${current} ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Microphone recognition failed. You can type your answer.");
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-white/60">Starting your interview...</p>
        </div>
      </main>
    );
  }

  if (error && !sessionId) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0b0b] p-8 text-center">
          <h1 className="text-2xl font-bold">Unable to start</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">{error}</p>

          <button
            onClick={() => router.push("/interview-kit/mock-interview")}
            className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black"
          >
            Back to Mock Interview
          </button>
        </div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b0b0b] p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10 text-3xl text-emerald-400">
            ✓
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Interview Complete
          </h1>

          <p className="mt-3 text-white/60">
            Your 3.5-minute free mock interview has ended.
          </p>

          <button
            onClick={() => router.push("/interview-kit/mock-interview")}
            className="mt-8 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black"
          >
            Back to Interview Kit
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              JOBIX Mock Interview
            </p>

            <h1 className="mt-2 text-2xl font-black">
              {subject === "dsa"
                ? "Data Structures & Algorithms"
                : subject.toUpperCase()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Time left
              </p>
              <p
                className={`mt-1 text-xl font-black ${
                  remaining <= 30 ? "text-orange-400" : "text-white"
                }`}
              >
                {formatTime(remaining)}
              </p>
            </div>

            <button
              onClick={() => void finishInterview()}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white/70 hover:bg-white/5 hover:text-white"
            >
              Finish
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/10 bg-[#080808] p-7 lg:p-9">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
                Interviewer
              </span>

              <span className="text-xs font-medium text-white/30">
                {difficulty}
              </span>
            </div>

            <div className="mt-8 min-h-[180px]">
              <p className="text-xl font-semibold leading-9 text-white lg:text-2xl">
                {question}
              </p>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-[#080808] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Your response
            </p>

            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Explain your approach..."
              disabled={sending || finished}
              className="mt-4 min-h-[240px] w-full resize-none rounded-2xl border border-white/10 bg-black p-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-blue-400/50"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={toggleMic}
                disabled={sending || finished}
                className={`rounded-xl border px-4 py-3 text-sm font-bold ${
                  listening
                    ? "border-orange-400/40 bg-orange-400/10 text-orange-400"
                    : "border-white/10 text-white/70 hover:bg-white/5"
                }`}
              >
                {listening ? "Listening..." : "Mic"}
              </button>

              <button
                onClick={sendAnswer}
                disabled={!answer.trim() || sending || finished}
                className="flex-1 rounded-xl bg-white px-5 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                {sending ? "Thinking..." : "Send Answer"}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-xs leading-5 text-orange-400">
                {error}
              </p>
            )}
          </aside>
        </section>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 text-center text-xs text-white/40">
          Free mock interview · 1 interview · 1 topic · 3 minutes 30 seconds
        </div>
      </div>
    </main>
  );
}

export default function MockInterviewSessionPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-sm font-medium text-white/50">
            Preparing your interview...
          </div>
        </main>
      }
    >
      <MockInterviewSessionContent />
    </Suspense>
  );
}