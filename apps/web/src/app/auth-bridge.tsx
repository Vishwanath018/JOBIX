"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthBridge() {
  const router = useRouter();
  const [status, setStatus] = useState("Checking login...");

  useEffect(() => {
    const localToken = localStorage.getItem("jobix_access_token");
    const sessionToken = sessionStorage.getItem("jobix_access_token");
    const token = localToken || sessionToken;

    if (token) {
      document.cookie = `jobix_access_token=${encodeURIComponent(token)}; path=/; max-age=2592000; SameSite=Lax`;
      router.replace("/home");
      return;
    }

    setStatus("No login token found.");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f8ff]">
      <div className="rounded-2xl bg-white px-10 py-8 text-center shadow-xl">
        <p className="text-xl font-bold text-[#07143b]">{status}</p>
      </div>
    </main>
  );
}
