"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  ["Dashboard", "Overview & insights", "/home"],
  ["ATS Check", "Check and improve your resume", "/ats-check"],
  ["Resume Analysis", "Detailed feedback with insights", "/resume-analysis"],
  ["Resume Builder", "Create professional resumes", "/resume-builder"],
  ["Interview Kit", "Practice and get prepared", "/interview-kit"],
  ["Job Finder", "Find your next opportunity", "/job-finder"],
  ["Your Subscription", "Manage your plan & benefits", "/subscription"],
];

function Icon({ title }: { title: string }) {
  if (title === "Dashboard") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M3 10.8 12 3l9 7.8v9.2a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.2Z" />
      </svg>
    );
  }

  if (title === "ATS Check") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 7h8M8 11h5M8 15l2 2 5-5" />
      </svg>
    );
  }

  if (title === "Resume Analysis") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19V10M10 19V5M16 19v-8M22 19H2" />
      </svg>
    );
  }

  if (title === "Resume Builder") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h11v16H4zM8 8h4M8 12h4M8 16h3" />
        <path d="m15 15 4-4 2 2-4 4-3 1z" />
      </svg>
    );
  }

  if (title === "Interview Kit") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M4 5h16v11H4zM9 19h6v2H9zM7 8h10v2H7zM7 12h7v2H7z" />
      </svg>
    );
  }

  if (title === "Job Finder") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current" strokeWidth="2.4" strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
      <path d="m12 2 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 2Z" />
    </svg>
  );
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<{
    full_name?: string;
    email?: string;
  }>({});

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem("jobix_user_v2") ||
        localStorage.getItem("jobix_user");

      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setUser({});
    }
  }, []);

  const filtered = navigation.filter(([title]) =>
    title.toLowerCase().includes(search.toLowerCase())
  );

  const navigate = (path: string) => {
    setDrawerOpen(false);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#f4f8ff]">
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open JOBIX navigation"
        className="fixed left-5 top-5 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#07143b] shadow-lg ring-1 ring-[#dce5f2] transition hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-[#07143b]/25 backdrop-blur-[2px]"
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
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close navigation"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-lg transition hover:scale-105"
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

              <div className="mt-7 rounded-2xl border border-[#dce5ef] bg-white p-3 shadow-md">
                <div className="flex h-11 items-center">
                  <span className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#07143b]">
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

                  <span className="ml-2 shrink-0 rounded-md border border-[#d5deeb] bg-white px-2 py-1 text-[10px] font-bold text-[#52627f]">
                    Ctrl K
                  </span>
                </div>
              </div>

              <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
                {filtered.map(([title, subtitle, path]) => {
                  const active = pathname === path || pathname.startsWith(`${path}/`);
                  const dashboard = title === "Dashboard";

                  return (
                    <a
                      href={path}
                      key={title}
                      className={`group flex min-h-[72px] w-full items-center gap-4 rounded-2xl px-4 text-left transition ${
                        active
                          ? "bg-black text-white shadow-xl"
                          : "bg-white text-[#10285a] shadow-md hover:bg-[#f8fbff]"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          active
                            ? "bg-black text-white ring-1 ring-white/20"
                            : "bg-[#e5efff] text-[#1769ff]"
                        }`}
                      >
                        <Icon title={title} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[15px] font-extrabold ${
                            active ? "text-white" : "text-[#10285a]"
                          }`}
                        >
                          {title}
                        </span>

                        <span
                          className={`mt-1 block text-[11px] font-medium ${
                            active ? "text-white/70" : "text-[#627493]"
                          }`}
                        >
                          {subtitle}
                        </span>
                      </span>

                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          active
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
                    </a>
                  );
                })}
              </nav>

              <div className="mt-5 rounded-2xl border border-white/60 bg-[#07143b]/90 p-4 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black text-lg font-black">
                    {(user.full_name || "J").charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold">
                      Hi, {user.full_name || "JOBIX User"}
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

      {children}
    </div>
  );
}
