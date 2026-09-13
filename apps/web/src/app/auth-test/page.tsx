"use client";

import { useEffect, useState } from "react";

export default function AuthTestPage() {
  const [result, setResult] = useState("Testing authentication...");

  useEffect(() => {
    async function test() {
      const token =
        localStorage.getItem("jobix_access_token") ||
        sessionStorage.getItem("jobix_access_token");

      if (!token) {
        setResult("NO TOKEN FOUND IN BROWSER STORAGE");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        setResult(
          JSON.stringify(
            {
              status: response.status,
              response: data,
              token_present: true,
              token_length: token.length,
            },
            null,
            2
          )
        );
      } catch (error) {
        setResult(
          error instanceof Error
            ? error.message
            : "Authentication test failed."
        );
      }
    }

    test();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f8ff] p-8">
      <pre className="max-w-3xl whitespace-pre-wrap rounded-2xl bg-white p-8 shadow-xl">
        {result}
      </pre>
    </main>
  );
}
