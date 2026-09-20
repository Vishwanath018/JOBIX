"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { companies as allCompanies } from "../companies-data";
import CompanyLogo from "../company-logo";

const companies = Array.from(
  new Map(
    allCompanies.map((company) => [
      company.name + "-" + company.category,
      company,
    ])
  ).values()
);

const filters = [
  "All",
  "Product",
  "Startup",
  "Service",
  "Fintech",
  "SaaS",
  "E-commerce",
  "Consulting",
  "Cloud",
  "Automotive",
  "Telecom",
];

export default function CompaniesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = company.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || company.category === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <main className="min-h-screen bg-[#f5f8fc] text-[#10254e]">
      <div className="mx-auto max-w-[1550px] px-5 pb-16 pt-8 md:px-8">

        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-extrabold text-[#526783] transition hover:text-[#1769ff]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Interview Kit
        </button>

        <section className="rounded-[30px] bg-[#07143b] px-7 py-8 text-white shadow-[0_18px_50px_rgba(7,20,59,0.14)] md:px-10 md:py-10">
          <div className="max-w-[850px]">
            <p className="text-[11px] font-extrabold tracking-[0.18em] text-[#71a9ff]">
              COMPANY PREPARATION
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] md:text-5xl">
              Practice by company.
            </h1>

            <p className="mt-4 max-w-[720px] text-sm font-medium leading-7 text-white/65 md:text-base">
              Explore interview preparation across product companies,
              startups, service companies, fintech, SaaS and global
              technology teams.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">{companies.length}+</p>
                <p className="text-[11px] font-bold text-white/55">
                  Companies
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">10+</p>
                <p className="text-[11px] font-bold text-white/55">
                  Categories
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-4 py-3">
                <p className="text-2xl font-black">Worldwide</p>
                <p className="text-[11px] font-bold text-white/55">
                  Company coverage
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex flex-1 items-center rounded-2xl border border-[#dce6f1] bg-white px-5 shadow-sm">
              <Search className="h-5 w-5 text-[#8a99ae]" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="h-14 flex-1 bg-transparent px-3 text-sm font-bold outline-none placeholder:text-[#9aa7b9]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#dce6f1] bg-white p-2 shadow-sm">
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                    filter === item
                      ? "bg-[#07143b] text-white"
                      : "text-[#71819b] hover:bg-[#f2f6fb]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm font-bold text-[#71819b]">
              Showing{" "}
              <span className="font-black text-[#10254e]">
                {filtered.length}
              </span>{" "}
              companies
            </p>

            {search || filter !== "All" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="text-xs font-extrabold text-[#1769ff]"
              >
                Clear filters
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((company) => (
              <button
                key={`${company.name}-${company.category}`}
                onClick={() =>
                  router.push(
                    `/interview-kit/dsa/${company.name
                      .toLowerCase()
                      .replace(/&/g, "and")
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, "")}`
                  )
                }
                className="group flex min-h-[88px] items-center gap-3 rounded-2xl border border-[#dce6f1] bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#b9d4ff] hover:shadow-lg"
              >
                <CompanyLogo
                  name={company.name}
                  slug={company.logo}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#10254e]">
                    {company.name}
                  </p>

                  <p className="mt-1 text-[11px] font-bold text-[#8a99ae]">
                    {company.category}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-[#a1adbd] transition group-hover:text-[#1769ff]" />
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-8 rounded-2xl border border-[#dce6f1] bg-white p-12 text-center">
              <p className="text-lg font-black">No companies found</p>
              <p className="mt-2 text-sm font-medium text-[#71819b]">
                Try another company name or category.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}




