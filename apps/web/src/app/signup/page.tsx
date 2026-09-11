"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

function Arrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 20c.7-3.1 3.2-5 7-5s6.3 1.9 7 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 7l7 5 7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 3.5h2.1l1.2 4.1-2 1.7c1 2.1 2.6 3.7 4.7 4.7l1.7-2 4.1 1.2v2.1c0 1.2-1 2.2-2.2 2.2C10.2 17.5 6.5 13.8 6.5 9.2c0-1.2 1-2.2 2.2-2.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="12.5" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 12h17M10 12v2h4v-2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 6.2A9.4 9.4 0 0 1 12 6c5.8 0 9 6 9 6a16.7 16.7 0 0 1-3.2 3.7M6.1 6.8C4.1 8.2 3 10.1 3 12c0 0 3.2 6 9 6 1.6 0 3-.4 4.2-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.7 9.7a3.2 3.2 0 0 0 4.6 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function SignupPage() {
  ;

  ;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!agree) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      // Account has been created successfully.
      // Send the user directly to Login with a success state.
      window.location.href = "/login?registered=1";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#07143b]">
      <div className="mx-auto flex min-h-screen w-full max-w-[980px] flex-col px-6 py-7">
        <div className="flex flex-col items-center">
          <Link href="/" aria-label="JOBIX home">
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="h-[100px] w-[100px] object-contain"
            />
          </Link>

          <p className="mt-1 text-[18px] font-medium text-slate-400">
            Your Career, Smarter.
          </p>

          <h1 className="mt-5 text-center text-[34px] font-extrabold tracking-tight text-[#07143b]">
            Create Your Account
          </h1>

          <p className="mt-2 text-center text-[16px] text-slate-500">
            Join JOBIX and unlock better opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-slate-700">
                Full Name
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserIcon />
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-[15px] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-slate-700">
                Email Address
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <MailIcon />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-[15px] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-slate-700">
                Phone Number <span className="font-normal text-slate-400">(Optional)</span>
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <PhoneIcon />
                </span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-[15px] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[14px] font-semibold text-slate-700">
                Password
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Create a strong password"
                  className="h-[50px] w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-[15px] outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </label>

            <label className="col-span-2 block">
              <span className="mb-2 block text-[14px] font-semibold text-slate-700">
                I am a
              </span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <BriefcaseIcon />
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="h-[50px] w-full appearance-none rounded-xl border border-slate-200 bg-white pl-12 pr-10 text-[15px] text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select your current status</option>
                  <option value="student">Student</option>
                  <option value="fresher">Fresher</option>
                  <option value="job_seeker">Job Seeker</option>
                  <option value="professional">Working Professional</option>
                  <option value="career_switcher">Career Switcher</option>
                </select>
              </div>
            </label>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-5 text-slate-500">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-blue-600"
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="font-semibold text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-semibold text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-[14px] font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-[17px] font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Arrow />
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="whitespace-nowrap text-[15px] font-medium text-slate-500">
            Or sign up with
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <button
            type="button"
            onClick={() => window.location.href = "http://127.0.0.1:8000/auth/google"}
            className="flex h-[76px] items-center justify-center gap-5 rounded-2xl border-2 border-[#d8e3f0] bg-white text-[19px] font-semibold text-[#111827] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <img src="/google-g.svg" alt="Google" className="h-[38px] w-[38px]" />
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "http://127.0.0.1:8000/auth/linkedin"}
            className="flex h-[76px] items-center justify-center gap-5 rounded-2xl border-2 border-[#d8e3f0] bg-white text-[19px] font-semibold text-[#111827] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="h-[38px] w-[38px]" />
            <span>LinkedIn</span>
          </button>
        </div>

        <p className="mt-6 text-center text-[16px] text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </p>

        <footer className="mt-7 border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between text-[14px] text-slate-500">
            <span>© 2026 JOBIX. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <Link href="/terms" className="hover:text-blue-600">Terms</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
              <span>|</span>
              <Link href="/help" className="hover:text-blue-600">Help</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}