"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveAuth } from "@/lib/auth";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(
      window.location.hash.replace(/^#/, "")
    );

    const token =
      query.get("access_token") ||
      hash.get("access_token");

    const email =
      query.get("email") ||
      hash.get("email") ||
      "";

    const fullName =
      query.get("full_name") ||
      hash.get("full_name") ||
      "";

    if (token) {
      saveAuth(
        token,
        {
          email,
          full_name: fullName,
        },
        true
      );

      sessionStorage.setItem("jobix_oauth_processed", "1");

      router.replace("/home");
      return;
    }

    if (sessionStorage.getItem("jobix_oauth_processed") === "1") {
      router.replace("/home");
      return;
    }

    router.replace("/login?oauth_error=1");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f8ff]">
      <div className="rounded-2xl bg-white px-10 py-8 text-center shadow-xl">
        <p className="text-xl font-semibold text-[#07143b]">
          Completing your login...
        </p>
      </div>
    </main>
  );
}
