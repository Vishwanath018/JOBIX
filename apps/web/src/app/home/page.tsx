"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  email?: string;
  full_name?: string;
};

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jobix_access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const storedUser = localStorage.getItem("jobix_user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("jobix_access_token");
    localStorage.removeItem("jobix_user");
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[#f3f8ff] px-6 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
            ✓
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-[#07143b]">
            Login Successful
          </h1>

          <p className="mt-3 text-lg text-[#61789f]">
            Welcome to JOBIX Career!
          </p>

          {user?.full_name && (
            <p className="mt-8 text-2xl font-bold text-[#07143b]">
              Hello, {user.full_name}
            </p>
          )}

          {user?.email && (
            <div className="mx-auto mt-5 max-w-md rounded-2xl bg-[#f3f8ff] px-6 py-5">
              <p className="text-sm font-semibold text-[#61789f]">
                Logged in email
              </p>
              <p className="mt-2 break-all text-base font-bold text-[#07143b]">
                {user.email}
              </p>
            </div>
          )}

          <p className="mt-8 text-sm text-[#61789f]">
            Your JOBIX authentication is working correctly.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 rounded-xl bg-[#07143b] px-7 py-3 font-semibold text-white transition hover:bg-[#10245b]"
          >
            Log Out
          </button>
        </div>
      </div>
    </main>
  );
}
