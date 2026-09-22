import Link from "next/link";
import CompanyLogo from "./company-logo";

const companyHeroImages: Record<string, string> = {
  google: "/interview-kit/companies/google.jpg",
  microsoft: "/interview-kit/companies/microsoft.jpg",
  amazon: "/interview-kit/companies/amazon.jpg",
  meta: "/interview-kit/companies/meta.jpg",
  adobe: "/interview-kit/companies/adobe.jpg",
  nvidia: "/interview-kit/companies/nvidia.jpg",
  flipkart: "/interview-kit/companies/flipkart.jpg",
  phonepe: "/interview-kit/companies/phonepe.jpg",
  razorpay: "/interview-kit/companies/razorpay.jpg",
  zomato: "/interview-kit/companies/zomato.jpg",
  meesho: "/interview-kit/companies/meesho.jpg",
  freshworks: "/interview-kit/companies/freshworks.jpg",
  zerodha: "/interview-kit/companies/zerodha.jpg",
};

type CompanyHeroProps = {
  company: string;
  slug: string;
};

export default function CompanyHero({
  company,
  slug,
}: CompanyHeroProps) {
  const background =
    companyHeroImages[slug] ||
    "/interview-kit/companies/google.jpg";

  return (
    <div className="mb-7">

      <section
        className="relative min-h-[280px] overflow-hidden rounded-[34px] border border-[#dce5f0] shadow-[0_18px_50px_rgba(7,20,59,0.15)]"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* Strongly visible image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Transparent readability layer */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Left text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        <div className="relative z-10 flex min-h-[280px] items-center px-10 py-10 md:px-14">

          <div className="max-w-4xl">

            <div className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#9dccff]">
              DSA Company Preparation
            </div>

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xl">
                <CompanyLogo
                  name={company}
                  slug={slug}
                />
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.65)] md:text-5xl">
                {company} DSA Questions
              </h1>

            </div>

            <p className="mt-5 text-base font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.65)] md:text-lg">
              Practice DSA questions organized by difficulty and topic.
            </p>

            <p className="mt-2 text-sm font-bold text-white/90 drop-shadow-[0_2px_5px_rgba(0,0,0,0.65)]">
              Prepare with company-specific interview questions.
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
