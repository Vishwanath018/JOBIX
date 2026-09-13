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
      const storedUser = localStorage.getItem("jobix_user");

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
    setDrawerOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("jobix_access_token");
    localStorage.removeItem("jobix_user");
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
                className="h-11 w-11 rounded-xl"
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
                {(user.full_name || user.email || "J").charAt(0).toUpperCase()}
              </div>
              <span className="hidden max-w-[130px] truncate text-sm font-bold sm:block">
                {user.full_name || "My Account"}
              </span>
              <span className="text-xs">⌄</span>
            </button>

            {profileOpen && (
              <div className="absolute right-5 top-[68px] w-60 rounded-2xl border border-[#e3eaf5] bg-white p-3 shadow-2xl">
                <div className="border-b border-[#edf1f7] px-3 pb-3">
                  <p className="font-bold">{user.full_name || "JOBIX User"}</p>
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
            onClick={(e) => e.stopPropagation()}
            className="h-full w-[310px] overflow-y-auto bg-white p-5 shadow-2xl"
          >
            <div className="mb-7 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/jobix-logo.png"
                  alt="JOBIX"
                  className="h-11 w-11 rounded-xl"
                />
                <div className="text-xl font-extrabold">JOBIX</div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-2xl text-[#7183a3]"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tools"
                  className="w-full rounded-xl border border-[#dce5f2] bg-[#f7faff] px-4 py-3 pr-12 text-sm outline-none focus:border-[#1769ff]"
                />
                <span className="absolute right-3 top-3 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-[#7183a3] shadow-sm">
                  Ctrl K
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {filteredNavigation.map((item) => (
                <button
                  key={item.title}
                  onClick={() => selectItem(item.title)}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left font-bold transition ${
                    item.title === "ATS Check"
                      ? "bg-[#eaf2ff] text-[#1769ff] hover:bg-[#dceaff]"
                      : "text-[#263a63] hover:bg-[#f1f5fb]"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg shadow-sm">
                    {item.icon}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#07143b] p-5 text-white">
              <p className="text-xs font-semibold text-[#9fb2d8]">
                CURRENT PLAN
              </p>
              <p className="mt-1 text-lg font-extrabold">Free Plan</p>
              <p className="mt-2 text-xs leading-5 text-[#b8c6df]">
                Build a stronger career with JOBIX.
              </p>
              <button className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-extrabold text-[#07143b]">
                Upgrade Plan
              </button>
            </div>

            <button
              onClick={logout}
              className="mt-5 w-full rounded-xl bg-red-50 px-4 py-3 text-left font-extrabold text-red-600 hover:bg-red-100"
            >
              Log Out
            </button>
          </aside>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="overflow-hidden rounded-[30px] bg-[#07143b] px-7 py-10 text-white shadow-xl md:px-12 md:py-14">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.15em] text-[#b9d0ff]">
              WELCOME TO JOBIX
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Welcome back{user.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#b9c8e3]">
              Your career toolkit is ready. Check your resume, improve your
              profile, prepare for interviews, and discover better
              opportunities.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/ats-check")}
                className="rounded-xl bg-white px-6 py-3.5 font-extrabold text-[#07143b] shadow-lg transition hover:-translate-y-0.5"
              >
                Start ATS Check →
              </button>

              <button
                onClick={() => router.push("/ats-check")}
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-extrabold text-white transition hover:bg-white/15"
              >
                Analyze Resume
              </button>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-[#e3eaf5] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#7183a3]">ATS CHECKS</p>
            <p className="mt-2 text-4xl font-extrabold">0</p>
            <p className="mt-2 text-sm text-[#7183a3]">
              Resume analyses completed
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3eaf5] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#7183a3]">RESUME SCORE</p>
            <p className="mt-2 text-4xl font-extrabold">—</p>
            <p className="mt-2 text-sm text-[#7183a3]">
              Run your first ATS check
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3eaf5] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#7183a3]">CAREER TOOLS</p>
            <p className="mt-2 text-4xl font-extrabold">7</p>
            <p className="mt-2 text-sm text-[#7183a3]">
              Tools available in JOBIX
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#1769ff]">
              Career Tools
            </p>
            <h2 className="mt-1 text-3xl font-extrabold">Build your career smarter</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => router.push("/ats-check")}
              className="group rounded-2xl border border-[#dce5f2] bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2ff] text-xl font-extrabold text-[#1769ff]">
                ✓
              </div>
              <h3 className="mt-5 text-xl font-extrabold">ATS Check</h3>
              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Analyze your resume with AI and discover how to improve your
                ATS compatibility.
              </p>
              <span className="mt-5 inline-block font-bold text-[#1769ff]">
                Check Resume →
              </span>
            </button>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff1e8] text-xl font-extrabold text-[#f2762e]">
                ◈
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Resume Analysis</h3>
              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Get deeper insights into your resume and identify areas that
                need improvement.
              </p>
              <span className="mt-5 inline-block font-bold text-[#f2762e]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eafaf1] text-xl font-extrabold text-[#0b9b58]">
                ▣
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Resume Builder</h3>
              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Create a professional, job-ready resume with JOBIX templates.
              </p>
              <span className="mt-5 inline-block font-bold text-[#0b9b58]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f2edff] text-xl font-extrabold text-[#7047d9]">
                ◉
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Interview Kit</h3>
              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Prepare for interviews with role-specific questions and
                practice tools.
              </p>
              <span className="mt-5 inline-block font-bold text-[#7047d9]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff5d9] text-xl font-extrabold text-[#c78b00]">
                ⌕
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Job Finder</h3>
              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Find relevant opportunities and make your job search more
                efficient.
              </p>
              <span className="mt-5 inline-block font-bold text-[#c78b00]">
                Coming Soon
              </span>
            </div>

            <div className="rounded-2xl border border-[#dce5f2] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffeaf0] text-xl font-extrabold text-[#d94372]">
                ◆
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Your Subscription</h3>
              <p className="mt-2 text-sm leading-6 text-[#7183a3]">
                Manage your JOBIX plan and unlock more career capabilities.
              </p>
              <span className="mt-5 inline-block font-bold text-[#d94372]">
                View Plans →
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


