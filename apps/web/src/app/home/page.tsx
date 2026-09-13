"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const [user, setUser] = useState<{
    full_name?: string;
    email?: string;
  }>({});

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
      setDrawerOpen(false);
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

  const firstLetter = (
    user.full_name ||
    user.email ||
    "J"
  )
    .charAt(0)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07143b]">
      <header className="sticky top-0 z-40 border-b border-[#e4ebf7] bg-white">
        <div className="flex h-[78px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eef4ff] text-2xl font-bold text-[#07143b] transition hover:bg-[#dfeaff]"
              aria-label="Open navigation"
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
                <div className="text-[23px] font-extrabold tracking-tight text-[#07143b]">
                  JOBIX
                </div>
                <div className="-mt-1 text-[10px] font-semibold tracking-[0.2em] text-[#6880a8]">
                  CAREER
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#e3eaf5] bg-white text-xl shadow-sm"
              aria-label="Notifications"
            >
              🔔
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#1769ff]" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#e3eaf5] bg-white px-3 py-2 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#07143b] text-sm font-bold text-white">
                  {firstLetter}
                </div>

                <span className="hidden max-w-[130px] truncate text-sm font-bold sm:block">
                  {user.full_name || "My Account"}
                </span>

                <span className="text-xs">⌄</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-[#e3eaf5] bg-white p-3 shadow-2xl">
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
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#07143b]/30"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="h-full w-[310px] overflow-y-auto bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-extrabold text-[#07143b]">
                  JOBIX
                </div>
                <div className="text-[10px] font-semibold tracking-[0.2em] text-[#6880a8]">
                  CAREER
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f6fc] text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="mt-7">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search career tools"
                className="w-full rounded-xl border border-[#dce5f2] bg-[#f8fbff] px-4 py-3 text-sm outline-none transition focus:border-[#1769ff]"
              />
            </div>

            <nav className="mt-6 space-y-2">
              {filteredNavigation.map((item) => (
                <button
                  key={item.title}
                  onClick={() => selectItem(item.title)}
                  className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left font-semibold text-[#26385f] transition hover:bg-[#eef4ff]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f5ff] font-bold text-[#1769ff]">
                    {item.icon}
                  </span>

                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="overflow-hidden rounded-[30px] bg-[#07143b] px-7 py-10 text-white shadow-xl md:px-12 md:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#78a8ff]">
              Welcome to JOBIX
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.03em] md:text-5xl">
              Build your career smarter
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#b9c9e8] md:text-lg">
              Analyze your resume, improve your applications, prepare for
              interviews, and discover better opportunities.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/ats-check")}
                className="rounded-xl bg-white px-7 py-4 font-extrabold text-[#07143b] transition hover:bg-[#f0f4fb]"
              >
                Start ATS Check →
              </button>

              <button
                onClick={() => router.push("/ats-check")}
                className="rounded-xl border border-[#536587] bg-[#16254d] px-7 py-4 font-extrabold text-white transition hover:bg-[#1d2f5e]"
              >
                Analyze Resume
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#7183a3]">
              ATS Checks
            </p>

            <p className="mt-4 text-4xl font-extrabold text-[#07143b]">
              0
            </p>

            <p className="mt-2 text-sm text-[#7183a3]">
              Resume analyses completed
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#7183a3]">
              Resume Score
            </p>

            <p className="mt-4 text-4xl font-extrabold text-[#07143b]">
              —
            </p>

            <p className="mt-2 text-sm text-[#7183a3]">
              Run your first ATS check
            </p>
          </div>

          <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#7183a3]">
              Career Tools
            </p>

            <p className="mt-4 text-4xl font-extrabold text-[#07143b]">
              7
            </p>

            <p className="mt-2 text-sm text-[#7183a3]">
              Tools available in JOBIX
            </p>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#1769ff]">
              Career Tools
            </p>

            <h2 className="mt-1 text-3xl font-extrabold">
              Build your career smarter
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#dce5f2] bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1ff] text-xl font-extrabold text-[#1769ff]">
                ✓
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                ATS Check
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Analyze your resume with AI and discover how to improve your
                ATS compatibility.
              </p>

              <button
                onClick={() => router.push("/ats-check")}
                className="mt-6 font-bold text-[#1769ff] transition hover:text-[#0d4fc9]"
              >
                Check Resume →
              </button>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e8] text-xl font-extrabold text-[#ff7127]">
                ◈
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                Resume Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Get deeper insights into your resume and identify areas that
                need improvement.
              </p>

              <span className="mt-6 inline-block font-bold text-[#ff7127]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eafaf1] text-xl font-extrabold text-[#0b9b58]">
                ▣
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                Resume Builder
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Create a professional, job-ready resume or improve your
                existing one.
              </p>

              <button
                onClick={() => router.push("/resume-builder")}
                className="mt-6 font-bold text-[#0b9b58] transition hover:text-[#087a46]"
              >
                Open Resume Builder →
              </button>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1eaff] text-xl font-extrabold text-[#7540e8]">
                ◉
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                Interview Kit
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Prepare for interviews with role-specific questions and
                practice tools.
              </p>

              <span className="mt-6 inline-block font-bold text-[#7540e8]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff5d9] text-xl font-extrabold text-[#d39400]">
                ⌕
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                Job Finder
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Find relevant opportunities and make your job search more
                efficient.
              </p>

              <span className="mt-6 inline-block font-bold text-[#d39400]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe8ef] text-xl font-extrabold text-[#e63e70]">
                ◆
              </div>

              <h3 className="mt-6 text-xl font-extrabold">
                Your Subscription
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Manage your JOBIX plan and unlock more career capabilities.
              </p>

              <button className="mt-6 font-bold text-[#e63e70] transition hover:text-[#c82c5b]">
                View Plans →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
