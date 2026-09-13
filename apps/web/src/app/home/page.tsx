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
          className="fixed inset-0 z-50 bg-[#07143b]/30"
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="h-full w-[310px] overflow-y-auto bg-white p-5 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xl font-extrabold">JOBIX</p>
                <p className="text-[10px] font-semibold tracking-[0.2em]">
                  CAREER
                </p>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1f5fa] text-xl font-bold"
              >
                ×
              </button>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="mb-5 w-full rounded-xl border border-[#dce5ef] bg-[#f9fbfe] px-4 py-3 text-sm font-semibold outline-none focus:border-[#1769ff]"
            />

            <div className="space-y-2">
              {filteredNavigation.map((item) => (
                <button
                  key={item.title}
                  onClick={() => selectItem(item.title)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold transition ${
                    item.title === "Dashboard"
                      ? "bg-[#eef4ff] text-[#1769ff]"
                      : "text-[#405274] hover:bg-[#f4f7fb]"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f1f5fa] text-base">
                    {item.icon}
                  </span>

                  {item.title}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="overflow-hidden rounded-[30px] bg-[#07143b] px-7 py-10 text-white shadow-xl md:px-12 md:py-14">
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
