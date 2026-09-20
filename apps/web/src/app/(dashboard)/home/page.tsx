"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const heroImages = [
  "/hero/1.png",
  "/hero/2.png",
  "/hero/3.png",
  "/hero/4.png",
];

export default function HomePage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  const logout = () => {
    localStorage.removeItem("jobix_access_token");
    localStorage.removeItem("jobix_user");
    localStorage.removeItem("jobix_access_token_v2");
    localStorage.removeItem("jobix_user_v2");

    sessionStorage.removeItem("jobix_access_token");
    sessionStorage.removeItem("jobix_user");
    sessionStorage.removeItem("jobix_access_token_v2");
    sessionStorage.removeItem("jobix_user_v2");

    router.replace("/login");
  };

  return (
    <main
      className={
        darkMode
          ? "jobix-home jobix-home-dark min-h-screen"
          : "jobix-home min-h-screen"
      }
    >
      <header className="home-topbar relative z-50">
        <div className="home-brand">
          <img
            src="/jobix-logo.png"
            alt="JOBIX"
            className="home-brand-logo"
          />

          <div className="home-brand-text">
            <div className="home-brand-name">JOBIX</div>
            <div className="home-brand-subtitle">CAREER</div>
          </div>
        </div>

        <div className="home-topnav">
          <button
            type="button"
            className="home-pricing-button"
            onClick={() => router.push("/subscription")}
          >
            Pricing
          </button>

          <div className="home-notification-wrap">
            <button
              type="button"
              className="home-icon-button"
              onClick={() =>
                setNotificationsOpen((current) => !current)
              }
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M10 21h4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>

              <span className="home-notification-dot" />
            </button>

            {notificationsOpen && (
              <div className="home-notification-panel">
                <strong>Notifications</strong>
                <p>No new notifications yet.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="home-icon-button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6 8.5 8.5 0 1 0 20.4 15.4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="home-logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-[1600px] px-5 pb-10 pt-5 md:px-8 md:pb-14 md:pt-7">
        <div className="relative min-h-[390px] overflow-hidden rounded-[30px] bg-[#07143b] text-white shadow-xl md:min-h-[420px]">
          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ${
                activeImage === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          <div className="absolute inset-0 bg-[#07143b]/60" />

          <div className="relative z-10 flex min-h-[390px] items-center px-7 py-12 md:min-h-[420px] md:px-12">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#7fb0ff]">
                Welcome to JOBIX
              </p>

              <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                Build your career smarter.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-[#e0e8f5]">
                Create stronger resumes, improve your applications and prepare
                for your next opportunity with JOBIX.
              </p>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {heroImages.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Show hero ${index + 1}`}
                onClick={() => setActiveImage(index)}
                className={`h-2 rounded-full transition-all ${
                  activeImage === index
                    ? "w-7 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1ff] text-xl font-extrabold text-[#1769ff]">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-extrabold !text-[#07143b]">
                ATS Resume Check
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#7183a3]">
                Check how well your resume matches a specific job description.
              </p>

              <button
                type="button"
                onClick={() => router.push("/ats-check")}
                className="mt-5 font-bold !text-[#1769ff] transition hover:translate-x-1"
              >
                Analyze Resume →
              </button>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eafaf1] text-xl font-extrabold text-[#0b9b58]">
                ▣
              </div>

              <h3 className="mt-5 text-xl font-extrabold !text-[#07143b]">
                Resume Builder
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#7183a3]">
                Create a professional resume from scratch or improve your
                existing resume.
              </p>

              <button
                type="button"
                onClick={() => router.push("/resume-builder")}
                className="mt-5 font-bold !text-[#0b9b58] transition hover:translate-x-1"
              >
                Open Resume Builder →
              </button>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4e5] text-xl font-extrabold text-[#e88a00]">
                ◉
              </div>

              <h3 className="mt-5 text-xl font-extrabold !text-[#07143b]">
                Interview Kit
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#7183a3]">
                Prepare answers and practice for your next interview.
              </p>

              <button
                type="button"
                onClick={() => router.push("/interview-kit")}
                className="mt-5 inline-flex items-center gap-2 font-bold !text-[#e88a00] transition hover:translate-x-1"
              >
                Open Interview Kit <span>→</span>
              </button>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2edff] text-xl font-extrabold text-[#7654d8]">
                ◈
              </div>

              <h3 className="mt-5 text-xl font-extrabold !text-[#07143b]">
                Resume Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#7183a3]">
                Understand your resume and identify areas that can be improved.
              </p>

              <span className="mt-5 inline-block font-bold !text-[#7654d8]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8ff] text-xl font-extrabold text-[#1684b8]">
                ⌕
              </div>

              <h3 className="mt-5 text-xl font-extrabold !text-[#07143b]">
                Job Finder
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#7183a3]">
                Discover relevant opportunities based on your profile.
              </p>

              <span className="mt-5 inline-block font-bold !text-[#1684b8]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2f4f8] text-xl font-extrabold text-[#52627d]">
                ◆
              </div>

              <h3 className="mt-5 text-xl font-extrabold !text-[#07143b]">
                Your Subscription
              </h3>

              <p className="mt-2 text-sm leading-6 !text-[#7183a3]">
                Manage your JOBIX plan and access your career tools.
              </p>

              <button
                type="button"
                onClick={() => router.push("/subscription")}
                className="mt-5 font-bold !text-[#52627d] transition hover:translate-x-1"
              >
                View Plans →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}