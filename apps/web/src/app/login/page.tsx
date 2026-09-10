"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string | null;
  };
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      sessionStorage.setItem("jobix_access_token", result.access_token);
      sessionStorage.setItem("jobix_user", JSON.stringify(result.user));

      setMessage(`Welcome back, ${result.user.full_name || result.user.email}!`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-3xl font-black tracking-tight">
          JOB<span className="text-blue-600">IX</span>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <h1 className="text-3xl font-black text-slate-950">Welcome back</h1>
          <p className="mt-2 text-slate-500">
            Sign in to continue your career journey.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label className="text-sm font-semibold">Password</label>
                <button type="button" className="text-sm font-semibold text-blue-600">
                  Forgot password?
                </button>
              </div>

              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {message && (
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {message}
              </p>
            )}
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-blue-600">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
