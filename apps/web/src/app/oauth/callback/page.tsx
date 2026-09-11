"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.hash.replace(/^#/, "")
    );

    const token = params.get("access_token");
    const email = params.get("email");
    const fullName = params.get("full_name");

    if (!token) {
      router.replace("/login?oauth_error=1");
      return;
    }

    localStorage.setItem("jobix_access_token", token);

    if (email || fullName) {
      localStorage.setItem(
        "jobix_user",
        JSON.stringify({
          email: email || "",
          full_name: fullName || "",
        })
      );
    }

    router.replace("/home");
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
