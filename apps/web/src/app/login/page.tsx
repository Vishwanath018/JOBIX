"use client";

import Script from "next/script";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

function MailIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="15" r="1" fill="currentColor"/>
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M2.5 12S6 5.5 12 5.5S21.5 12 21.5 12S18 18.5 12 18.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ) : (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M10.6 5.8C11.05 5.7 11.52 5.65 12 5.65C18 5.65 21.5 12 21.5 12C20.85 13.18 20 14.3 19 15.3M6.1 6.8C3.9 8.3 2.5 12 2.5 12C2.5 12 6 18.5 12 18.5C13.4 18.5 14.65 18.1 15.75 17.55" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  ;

  ;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("registered") === "1") {
      setRegistered(true);
      window.history.replaceState({}, "", "/login");
    }

    if (params.get("oauth_success") === "1") {
      setMessage("You logged in successfully. Welcome to JOBIX Career!");
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiRequest<{
        access_token: string;
        user: {
          id: string;
          email: string;
          full_name: string | null;
        };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (remember) {
        localStorage.setItem("jobix_access_token", data.access_token);
      localStorage.setItem("jobix_user", JSON.stringify(data.user));
        localStorage.setItem("jobix_user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("jobix_access_token", data.access_token);
        sessionStorage.setItem("jobix_user", JSON.stringify(data.user));
      }

      setMessage(`Welcome back${data.user.full_name ? `, ${data.user.full_name}` : ""}!`);
      setTimeout(() => router.push("/home"), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f8ff] px-6 py-5 text-[#07143b]">
      <div className="mx-auto min-h-[calc(100vh-40px)] max-w-[1400px] rounded-[30px] border border-white bg-white px-8 py-12 shadow-[0_10px_50px_rgba(48,104,180,0.10)] md:px-16 lg:px-20">

        <div className="mx-auto max-w-[850px]">

          <div className="text-center">
            <Link href="/" className="inline-flex">
              <img
                src="/jobix-logo.png"
                alt="JOBIX"
                className="mx-auto h-[104px] w-[104px] object-contain drop-shadow-[0_10px_20px_rgba(14,55,110,0.14)] transition-transform duration-300 hover:scale-[1.02]"
              />
            </Link>

            <p className="mt-1 text-[15px] font-medium text-[#7188ae]">
              Your Career, Smarter.
            </p>

            <h1 className="mt-5 text-[38px] font-extrabold tracking-[-1.8px] text-[#07143b] md:text-[42px]">
              Welcome Back
            </h1>

            <p className="mt-2 text-[15px] text-[#61789f]">
              Login to continue your career journey with JOBIX.
            </p>
          </div>

          {registered && (
          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-[15px] font-semibold text-green-700 shadow-sm">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
              âœ“
            </span>
            <span>Account created successfully. Please login to continue.</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-7">
            <label className="block text-[18px] font-medium">
              Email or Phone Number
            </label>

            <div className="mt-2 flex h-[60px] items-center rounded-2xl border border-[#d4deec] bg-white shadow-[0_4px_18px_rgba(32,73,130,0.055)] transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/70 px-5 text-[#5f7498]">
              <MailIcon />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Enter your email or phone number"
                className="ml-7 w-full bg-transparent text-[18px] outline-none placeholder:text-[#9aabc3] transition-colors"
              />
            </div>

            <label className="mt-10 block text-[18px] font-medium">
              Password
            </label>

            <div className="mt-2 flex h-[60px] items-center rounded-2xl border border-[#d4deec] bg-white shadow-[0_4px_18px_rgba(32,73,130,0.055)] transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/70 px-5 text-[#5f7498]">
              <LockIcon />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="ml-7 w-full bg-transparent text-[18px] outline-none placeholder:text-[#9aabc3] transition-colors"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-4 shrink-0"
                aria-label="Toggle password visibility"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRemember(!remember)}
                className="flex items-center gap-5 text-[17px]"
              >
                <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-md ${remember ? "bg-blue-600 text-white" : "border-2 border-[#b8c9df]"}`}>
                  {remember && "?"}
                </span>
                Remember me
              </button>

              <Link
                href="/forgot-password"
                className="text-[17px] font-medium text-blue-600"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex h-[64px] w-full items-center justify-center gap-5 rounded-xl bg-gradient-to-r from-[#1769ff] via-[#2379f5] to-[#2d9bf4] text-[21px] font-medium text-white shadow-[0_12px_28px_rgba(35,112,245,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(35,112,245,0.30)] active:translate-y-0 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
              <Arrow />
            </button>

            {message && (
              <p className={`mt-5 text-center text-lg ${message.toLowerCase().includes("welcome") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}

            <div className="my-6 flex items-center gap-6 text-[17px] text-[#61789f]">
              <div className="h-[2px] flex-1 bg-[#d6dfec]" />
              <span>Or continue with</span>
              <div className="h-[2px] flex-1 bg-[#d6dfec]" />
            </div>

            <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
              <button
                type="button"
                onClick={() => window.location.href = "http://127.0.0.1:8000/auth/google"}
                className="flex h-[62px] items-center justify-center gap-7 rounded-2xl border border-[#d4deec] bg-white shadow-[0_4px_18px_rgba(32,73,130,0.055)] transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/70 text-[19px] font-medium"
              >
                <img src="/google-g.svg" alt="Google" className="h-8 w-8 object-contain" />
                Google
              </button>
              <button
                type="button"
                onClick={() => window.location.href = "http://127.0.0.1:8000/auth/linkedin"}
                className="flex h-[62px] items-center justify-center gap-7 rounded-2xl border border-[#d4deec] bg-white shadow-[0_4px_18px_rgba(32,73,130,0.055)] transition-all duration-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/70 text-[19px] font-medium"
              >
                <span className="flex h-[42px] w-[42px] items-center justify-center rounded-md bg-[#1685c4] text-[31px] font-bold text-white">
                  in
                </span>
                LinkedIn
              </button>            </div>

            <p className="mt-6 text-center text-[17px] text-[#61789f]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="ml-2 font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline underline-offset-4">
                Sign Up
              </Link>
            </p>
          </form>

          <footer className="mt-7 border-t-2 border-[#d9e2ef] pt-4">
            <div className="flex flex-col justify-between gap-5 text-[15px] text-[#61789f] md:flex-row">
              <span>{"\u00A9"} 2026 JOBIX. All rights reserved.</span>
              <div className="flex gap-7">
                <span>Terms</span>
                <span>|</span>
                <span>Privacy</span>
                <span>|</span>
                <span>Help</span>
              </div>
            </div>
          </footer>

        </div>
      </div>
    </main>
  );
}
