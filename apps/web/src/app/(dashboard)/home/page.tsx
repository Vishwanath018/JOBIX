"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const heroImages = [
  "/hero/1.png",
  "/hero/2.png",
  "/hero/3.png",
  "/hero/4.png",
];

const navigation = [
  { title: "Dashboard", icon: "⌂" },
  { title: "ATS Check", icon: "✓" },
  { title: "Resume Analysis", icon: "◈" },
  { title: "Resume Builder", icon: "▣" },
  { title: "Interview Kit", icon: "◉" },
  { title: "Job Finder", icon: "⌕" },
  { title: "Your Subscription", icon: "◆" }
];

export default function HomePage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const [user, setUser] = useState<{
    full_name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("jobix_user_v2") ||
        localStorage.getItem("jobix_user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      setUser({});
    }
  }, []);

  const selectItem = (title: string) => {
    if (title === "ATS Check") {
      router.push("/ats-check");
      return;
    }

    if (title === "Resume Builder") {
      setDrawerOpen(false);
      router.push("/resume-builder");
      return;
    }

    setDrawerOpen(false);
  };

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

  const filteredNavigation = navigation.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07143b]">
      <header className="sticky top-0 z-40 border-b border-[#e4ebf7] bg-white/95 backdrop-blur">
        <div className="flex h-[78px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ff] text-2xl font-bold text-[#07143b] transition hover:bg-[#dfeaff]"
            >
              ☰
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/jobix-logo.png"
                alt="JOBIX"
                className="h-11 w-11 rounded-xl object-contain"
              />

              <div className="hidden sm:block">
                <div className="text-[23px] font-extrabold tracking-tight">
                  JOBIX
                </div>

                <div className="-mt-1 text-[10px] font-semibold tracking-[0.2em] text-[#6880a8]">
                  CAREER
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e3eaf5] bg-white text-xl shadow-sm">
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1769ff]" />
            </button>

            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl border border-[#e3eaf5] bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#07143b] text-sm font-bold text-white">
                {(user.full_name || user.email || "J")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <span className="hidden max-w-[130px] truncate text-sm font-bold sm:block">
                {user.full_name || "My Account"}
              </span>

              <span className="text-xs">⌄</span>
            </button>

            {profileOpen && (
              <div className="absolute right-5 top-[68px] w-60 rounded-2xl border border-[#e3eaf5] bg-white p-3 shadow-2xl">
                <div className="border-b border-[#edf1f7] px-3 pb-3">
                  <p className="font-bold">
                    {user.full_name || "JOBIX User"}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#7183a3]">
                    {user.email || "Welcome to JOBIX"}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="mt-2 w-full rounded-xl px-3 py-3 text-left font-bold text-red-600 transition hover:bg-red-50"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#07143b]/25 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="relative h-full w-[390px] max-w-[92vw] overflow-hidden border-r border-white/60 shadow-2xl"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: 'url("/sidebar.png")' }}
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/35 to-white/5" />

            <div className="relative z-10 flex h-full flex-col px-6 py-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src="/jobix-logo.png"
                      alt="JOBIX"
                      className="h-12 w-12 rounded-2xl object-contain shadow-lg"
                    />
                    <div>
                      <p className="text-[25px] font-black leading-none tracking-tight text-[#07143b]">
                        JOBIX
                      </p>
                      <p className="mt-1 text-[10px] font-bold tracking-[0.28em] text-[#52627f]">
                        CAREER
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[11px] font-bold tracking-[0.25em] text-[#53678c]">
                    YOUR CAREER, SMARTER.
                  </p>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black shadow-lg transition hover:scale-105"
                  aria-label="Close navigation"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  >
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div className="mt-7">
                <div className="flex h-14 items-center rounded-2xl border border-white/80 bg-white/95 px-4 shadow-md backdrop-blur-md">
                  <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#07143b]">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <circle cx="10.5" cy="10.5" r="6.5" />
                      <path d="m16 16 5 5" />
                    </svg>
                  </span>
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search anything..."
                    className="min-w-0 flex-1 bg-transparent text-sm font-bold text-[#07143b] outline-none placeholder:text-[#71809c]"
                  />
                  <span className="rounded-md border border-[#d5deeb] bg-white/70 px-2 py-1 text-[10px] font-bold text-[#52627f]">
                    Ctrl K
                  </span>
                </div>
              </div>

              <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
                {filteredNavigation.map((item) => {
                  const isDashboard = item.title === "Dashboard";

                  const icon =
                    item.title === "Dashboard"
                      ? "?"
                      : item.title === "ATS Check"
                        ? "?"
                        : item.title === "Resume Analysis"
                          ? "?"
                          : item.title === "Resume Builder"
                            ? "?"
                            : item.title === "Interview Kit"
                              ? "?"
                              : item.title === "Job Finder"
                                ? "?"
                                : "?";

                  return (
                    <button
                      key={item.title}
                      onClick={() => selectItem(item.title)}
                      className={`group flex min-h-[72px] w-full items-center gap-4 rounded-2xl px-4 text-left transition ${
                        isDashboard
                          ? "bg-black text-white shadow-xl"
                          : "bg-white/95 text-[#10285a] shadow-sm backdrop-blur-md hover:bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          isDashboard
                            ? "bg-black text-white ring-1 ring-white/20"
                            : "bg-[#e5efff] text-[#1769ff]"
                        }`}
                      >
                        {item.title === "Dashboard" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                            <path d="M3 10.8 12 3l9 7.8v9.2a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.2Z" />
                          </svg>
                        )}

                        {item.title === "ATS Check" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="3" width="16" height="18" rx="2" />
                            <path d="M8 7h8M8 11h5M8 15l2 2 5-5" />
                          </svg>
                        )}

                        {item.title === "Resume Analysis" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19V10M10 19V5M16 19v-8M22 19H2" />
                          </svg>
                        )}

                        {item.title === "Resume Builder" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h11v16H4zM8 8h4M8 12h4M8 16h3" />
                            <path d="m15 15 4-4 2 2-4 4-3 1z" />
                          </svg>
                        )}

                        {item.title === "Interview Kit" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                            <path d="M4 5h16v11H4zM9 19h6v2H9zM7 8h10v2H7zM7 12h7v2H7z" />
                          </svg>
                        )}

                        {item.title === "Job Finder" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.4" strokeLinecap="round">
                            <circle cx="10.5" cy="10.5" r="6.5" />
                            <path d="m16 16 5 5" />
                          </svg>
                        )}

                        {item.title === "Your Subscription" && (
                          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                            <path d="m12 2 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 2Z" />
                          </svg>
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[15px] font-extrabold ${
                            isDashboard ? "text-white" : "text-[#10285a]"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`mt-1 block text-[11px] font-medium ${
                            isDashboard ? "text-white/70" : "text-[#627493]"
                          }`}
                        >
                          {item.title === "Dashboard"
                            ? "Overview & insights"
                            : item.title === "ATS Check"
                              ? "Check and improve your resume"
                              : item.title === "Resume Analysis"
                                ? "Detailed feedback with insights"
                                : item.title === "Resume Builder"
                                  ? "Create professional resumes"
                                  : item.title === "Interview Kit"
                                    ? "Practice and get prepared"
                                    : item.title === "Job Finder"
                                      ? "Find your next opportunity"
                                      : "Manage your plan & benefits"}
                        </span>
                      </span>

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          isDashboard
                            ? "bg-black text-white"
                            : "bg-white text-[#07143b] shadow-sm"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 5 7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-5 rounded-2xl border border-white/60 bg-[#07143b]/90 p-4 text-white shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black text-lg font-black">
                    {(user.full_name || "N").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">
                      Hi, {user.full_name || "Nirgun"}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Keep Moving Forward
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <section className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-14">
        <div className="relative min-h-[360px] overflow-hidden rounded-[30px] bg-[#07143b] text-white shadow-xl">
          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                activeImage === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-[#07143b]/65" />
          <div className="relative z-10 px-7 py-10 md:px-12 md:py-14">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#7fb0ff]">
              Welcome to JOBIX
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight md:text-5xl">
              Build your career smarter.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#c9d5ea]">
              Create stronger resumes, improve your applications and prepare for
              your next opportunity with JOBIX.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#1769ff]">
              Career Tools
            </p>

            <h2 className="mt-1 text-3xl font-extrabold">
              Build your career smarter
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1ff] text-xl font-extrabold text-[#1769ff]">
                ✓
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                ATS Resume Check
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Check how well your resume matches a specific job description.
              </p>

              <button
                onClick={() => router.push("/ats-check")}
                className="mt-5 font-bold text-[#1769ff]"
              >
                Analyze Resume →
              </button>
            </div>

            <div className="relative rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eafaf1] text-xl font-extrabold text-[#0b9b58]">
                ▣
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                Resume Builder
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Create a professional resume from scratch or improve your
                existing resume.
              </p>

              <button
                onClick={() => router.push("/resume-builder")}
                className="mt-5 font-bold text-[#0b9b58] transition hover:text-[#087d48]"
              >
                Open Resume Builder →
              </button>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff4e5] text-xl font-extrabold text-[#e88a00]">
                ◉
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                Interview Kit
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Prepare answers and practice for your next interview.
              </p>

              <span className="mt-5 inline-block font-bold text-[#e88a00]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2edff] text-xl font-extrabold text-[#7654d8]">
                ◈
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                Resume Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Understand your resume and identify areas that can be improved.
              </p>

              <span className="mt-5 inline-block font-bold text-[#7654d8]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf8ff] text-xl font-extrabold text-[#1684b8]">
                ⌕
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                Job Finder
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Discover relevant opportunities based on your profile.
              </p>

              <span className="mt-5 inline-block font-bold text-[#1684b8]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2f4f8] text-xl font-extrabold text-[#52627d]">
                ◆
              </div>

              <h3 className="mt-5 text-xl font-extrabold">
                Your Subscription
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Manage your JOBIX plan and access your career tools.
              </p>

              <span className="mt-5 inline-block font-bold text-[#52627d]">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
