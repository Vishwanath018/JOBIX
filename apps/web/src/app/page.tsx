import Link from "next/link";

function Arrow() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Logo() {
  return (
    <img
      src="/jobix-logo.png"
      alt="JOBIX"
      className="h-[88px] w-[88px] object-contain"
    />
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-[#07143b]">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-[430px] top-[100px] h-[850px] w-[850px] rounded-full bg-[#e5f1ff]" />
      <div className="pointer-events-none absolute -right-[430px] top-[100px] h-[850px] w-[850px] rounded-full bg-[#e5f1ff]" />
      <div className="pointer-events-none absolute -left-[250px] top-[590px] h-[390px] w-[760px] rotate-[19deg] rounded-[50%] bg-[#f1f7ff]" />
      <div className="pointer-events-none absolute -right-[250px] top-[590px] h-[390px] w-[760px] -rotate-[19deg] rounded-[50%] bg-[#f1f7ff]" />

      {/* Header */}
      <header className="relative z-30 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[112px] max-w-[1450px] items-center justify-between px-8 lg:px-12">

          <Link href="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            <Link
              href="/"
              className="relative py-4 text-[20px] font-bold text-blue-600"
            >
              Home
              <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-blue-600" />
            </Link>

            <a
              href="#features"
              className="py-4 text-[20px] font-semibold text-slate-700 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="py-4 text-[20px] font-semibold text-slate-700 transition hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="py-4 text-[20px] font-semibold text-slate-700 transition hover:text-blue-600"
            >
              About
            </a>
          </nav>

          {/* Header buttons Ã¢â‚¬â€ EXACT SAME SIZE */}
          <div className="ml-auto flex items-center gap-4">

            <Link
              href="/login"
              className="flex h-[54px] w-[190px] items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-white text-[18px] font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
            >
              <Arrow />
              Login
            </Link>

            <Link
              href="/signup"
              className="flex h-[54px] w-[190px] items-center justify-center gap-2 rounded-xl bg-blue-600 text-[18px] font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <Arrow />
              Get Started
            </Link>

          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 min-h-[calc(100vh-112px)]">

        <div className="mx-auto flex max-w-[1100px] flex-col items-center px-6 pb-20 pt-[105px] text-center">

          <p className="text-[22px] font-medium tracking-tight text-slate-400">
            Your Career, Smarter.
          </p>

          <h1 className="mt-6 text-[55px] font-extrabold leading-[1.06] tracking-[-2.8px] md:text-[68px]">
            <span className="text-[#07143b]">
              Better Resumes.
            </span>
            <br />
            <span className="text-blue-600">
              Brighter
            </span>{" "}
            <span className="text-[#07143b]">
              Opportunities.
            </span>
          </h1>

          <p className="mt-7 max-w-[790px] text-[19px] leading-8 text-slate-500 md:text-[21px]">
            Analyze your resume, get AI-powered insights, find relevant jobs,
            <br className="hidden md:block" />
            and take the next step in your career with JOBIX.
          </p>

          {/* Middle buttons Ã¢â‚¬â€ EXACT SAME SIZE */}
          <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">

            <Link
              href="/signup"
              className="flex h-[64px] w-[225px] min-w-[225px] items-center justify-center gap-4 rounded-2xl bg-blue-600 text-[20px] font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              <Arrow />
              <span>Sign Up</span>
            </Link>

            <Link
              href="/login"
              className="flex h-[64px] w-[225px] min-w-[225px] items-center justify-center gap-4 rounded-2xl border-2 border-blue-600 bg-white text-[20px] font-bold text-blue-600 transition hover:-translate-y-1 hover:bg-blue-50"
            >
              <Arrow />
              <span>Login</span>
            </Link>

          </div>

          {/* Features */}
          <div
            id="features"
            className="mt-20 grid w-full grid-cols-1 gap-8 md:grid-cols-3"
          >
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">
                Smarter Applications
              </h2>
              <p className="mt-2 text-slate-500">
                Build stronger applications with intelligent career tools.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">
                Career Intelligence
              </h2>
              <p className="mt-2 text-slate-500">
                Turn your experience into actionable career insights.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <h2 className="text-xl font-extrabold">
                One Career Workspace
              </h2>
              <p className="mt-2 text-slate-500">
                Keep your career journey organized in one place.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative z-10 border-t border-slate-100 bg-slate-50 px-6 py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-bold tracking-wide text-blue-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
            Your career journey, simplified.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            From your resume to your next opportunity, JOBIX helps you
            organize your career journey and make smarter decisions.
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative z-10 bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-bold tracking-wide text-blue-600">
            ABOUT JOBIX
          </p>

          <h2 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
            Your career deserves better tools.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-500">
            JOBIX brings resumes, opportunities, applications and career
            intelligence together into one modern workspace.
          </p>
        </div>
      </section>

    </main>
  );
}
