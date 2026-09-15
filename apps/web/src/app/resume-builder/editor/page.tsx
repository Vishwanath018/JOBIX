"use client";

import {
  Award,
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Languages,
  Link2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  bullets: string[];
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  grade: string;
  start: string;
  end: string;
  location: string;
};

type Project = {
  id: string;
  name: string;
  technologies: string;
  description: string;
  contribution: string;
  result: string;
  link: string;
};

type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId: string;
  link: string;
};

type Achievement = {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
};

type Language = {
  id: string;
  name: string;
  level: string;
};

type ResumeData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
};

const emptyExperience = (): Experience => ({
  id: crypto.randomUUID(),
  company: "",
  role: "",
  location: "",
  start: "",
  end: "",
  current: false,
  bullets: [""],
});

const emptyEducation = (): Education => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  grade: "",
  start: "",
  end: "",
  location: "",
});

const emptyProject = (): Project => ({
  id: crypto.randomUUID(),
  name: "",
  technologies: "",
  description: "",
  contribution: "",
  result: "",
  link: "",
});

const emptyCertification = (): Certification => ({
  id: crypto.randomUUID(),
  name: "",
  issuer: "",
  year: "",
  credentialId: "",
  link: "",
});

const emptyAchievement = (): Achievement => ({
  id: crypto.randomUUID(),
  title: "",
  organization: "",
  year: "",
  description: "",
});

const emptyLanguage = (): Language => ({
  id: crypto.randomUUID(),
  name: "",
  level: "",
});

const defaultData: ResumeData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  summary: "",
  experiences: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  languages: [],
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold text-[#25314a]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#d8dee9] bg-white px-3 py-2.5 text-[13px] text-[#111827] outline-none transition focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-bold text-[#25314a]">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full resize-y rounded-lg border border-[#d8dee9] bg-white px-3 py-2.5 text-[13px] leading-5 text-[#111827] outline-none transition focus:border-[#111827] focus:ring-1 focus:ring-[#111827]"
      />
    </label>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-[17px] font-extrabold tracking-[-0.2px] text-[#101828]">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-[12px] leading-5 text-[#667085]">
          {description}
        </p>
      )}
    </div>
  );
}

function EditorCard({
  title,
  number,
  onRemove,
  children,
}: {
  title: string;
  number: number;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[#e1e6ee] bg-[#fbfcfe] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111827] text-[11px] font-bold text-white">
            {number}
          </span>
          <span className="text-[13px] font-extrabold text-[#1d2939]">
            {title}
          </span>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-2 text-[#98a2b3] transition hover:bg-[#fff1f1] hover:text-[#d92d20]"
            title="Remove"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {children}
    </div>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#111827] bg-white px-4 py-2.5 text-[12px] font-extrabold text-[#111827] transition hover:bg-[#111827] hover:text-white"
    >
      <Plus size={15} />
      {children}
    </button>
  );
}

function Template4Preview({ data }: { data: ResumeData }) {
  const contact = [
    data.email,
    data.phone,
    data.location,
  ].filter(Boolean);

  const links = [
    data.linkedin,
    data.github,
    data.portfolio,
  ].filter(Boolean);

  return (
    <div className="t4-sheet">
      <style>{`
        .t4-sheet {
          width: 794px;
          min-height: 1123px;
          box-sizing: border-box;
          padding: 28px 30px 34px 30px;
          background: #ffffff;
          color: #111111;
          font-family: Arial, Helvetica, sans-serif;
        }

        .t4-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 315px;
          column-gap: 20px;
          align-items: start;
          padding-bottom: 10px;
          border-bottom: 2px solid #111111;
        }

        .t4-name {
          margin: 0;
          font-size: 31px;
          line-height: 31px;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .t4-title {
          margin-top: 4px;
          font-size: 10px;
          line-height: 13px;
          font-weight: 700;
        }

        .t4-contact {
          text-align: right;
          font-size: 8px;
          line-height: 11px;
        }

        .t4-contact-line {
          display: block;
          white-space: nowrap;
        }

        .t4-links {
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .t4-body {
          padding-top: 10px;
        }

        .t4-section {
          margin-bottom: 13px;
          page-break-inside: avoid;
        }

        .t4-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          font-size: 11px;
          line-height: 14px;
          font-weight: 700;
        }

        .t4-icon {
          width: 14px;
          height: 14px;
          min-width: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .t4-content {
          margin-left: 20px;
        }

        .t4-summary {
          font-size: 8.5px;
          line-height: 11.5px;
        }

        .t4-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 145px;
          gap: 15px;
        }

        .t4-right {
          text-align: right;
          white-space: nowrap;
          color: #555;
          font-size: 7.8px;
          line-height: 11px;
          font-style: italic;
        }

        .t4-entry {
          margin-bottom: 8px;
        }

        .t4-entry:last-child {
          margin-bottom: 0;
        }

        .t4-company {
          font-size: 9px;
          line-height: 11px;
          font-weight: 700;
        }

        .t4-role {
          font-size: 8.8px;
          line-height: 11px;
          font-weight: 700;
        }

        .t4-location {
          font-size: 7.8px;
          line-height: 10px;
          color: #555;
          font-style: italic;
        }

        .t4-bullets {
          margin: 3px 0 0 0;
          padding-left: 16px;
          font-size: 8.3px;
          line-height: 11px;
        }

        .t4-bullets li {
          margin-bottom: 1px;
          padding-left: 2px;
        }

        .t4-education {
          font-size: 8.5px;
          line-height: 11px;
        }

        .t4-education-main {
          font-weight: 700;
        }

        .t4-project {
          margin-bottom: 7px;
          font-size: 8.3px;
          line-height: 11px;
        }

        .t4-project-name {
          font-size: 9px;
          line-height: 11px;
          font-weight: 700;
        }

        .t4-tech {
          font-weight: 700;
        }

        .t4-label {
          font-weight: 700;
        }

        .t4-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .t4-skill {
          display: inline-flex;
          align-items: center;
          min-height: 20px;
          box-sizing: border-box;
          padding: 3px 7px;
          border: 1px solid #b9bec4;
          border-radius: 4px;
          font-size: 7.8px;
          line-height: 10px;
        }

        .t4-cert,
        .t4-achievement {
          margin-bottom: 6px;
          font-size: 8.3px;
          line-height: 11px;
        }

        .t4-bold {
          font-weight: 700;
        }

        .t4-languages {
          display: flex;
          flex-wrap: wrap;
          gap: 5px 22px;
          font-size: 8.3px;
          line-height: 11px;
        }

        @media print {
          .t4-sheet {
            width: 210mm;
            min-height: 297mm;
            padding: 7.4mm 7.4mm 8mm 7.4mm;
          }
        }
      `}</style>

      <header className="t4-header">
        <div>
          <h1 className="t4-name">
            {data.fullName || "Your Name"}
          </h1>

          {data.title && (
            <div className="t4-title">
              {data.title}
            </div>
          )}
        </div>

        <div className="t4-contact">
          {contact.map((item, index) => (
            <span className="t4-contact-line" key={index}>
              {item}
            </span>
          ))}

          {links.length > 0 && (
            <div className="t4-links">
              {links.join(" · ")}
            </div>
          )}
        </div>
      </header>

      <div className="t4-body">
        {data.summary && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <UserRound size={13} strokeWidth={2.4} />
              </span>
              Summary
            </div>

            <div className="t4-content t4-summary">
              {data.summary}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <GraduationCap size={13} strokeWidth={2.4} />
              </span>
              Education
            </div>

            <div className="t4-content">
              {data.education.map((item) => (
                <div className="t4-entry t4-education" key={item.id}>
                  <div className="t4-grid">
                    <div>
                      <div className="t4-education-main">
                        {item.institution}
                      </div>

                      <div>
                        {item.degree}
                        {item.field ? ` - ${item.field}` : ""}
                        {item.grade ? `, ${item.grade}` : ""}
                      </div>

                      {(item.start || item.end) && (
                        <div>
                          {item.start}
                          {item.start || item.end ? " – " : ""}
                          {item.end}
                        </div>
                      )}
                    </div>

                    {item.location && (
                      <div className="t4-right">
                        {item.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experiences.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <BriefcaseBusiness size={13} strokeWidth={2.4} />
              </span>
              Experience
            </div>

            <div className="t4-content">
              {data.experiences.map((item) => (
                <div className="t4-entry" key={item.id}>
                  <div className="t4-grid">
                    <div>
                      <div className="t4-company">
                        {item.company}
                      </div>

                      <div className="t4-role">
                        {item.role}
                      </div>
                    </div>

                    <div className="t4-right">
                      {item.start}
                      {item.start || item.end ? " – " : ""}
                      {item.current ? "Present" : item.end}
                    </div>
                  </div>

                  {item.location && (
                    <div className="t4-location">
                      {item.location}
                    </div>
                  )}

                  {item.bullets.filter(Boolean).length > 0 && (
                    <ul className="t4-bullets">
                      {item.bullets
                        .filter(Boolean)
                        .map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <BriefcaseBusiness size={13} strokeWidth={2.4} />
              </span>
              Projects
            </div>

            <div className="t4-content">
              {data.projects.map((item) => (
                <div className="t4-project" key={item.id}>
                  <div className="t4-grid">
                    <div>
                      <div className="t4-project-name">
                        {item.name}
                      </div>

                      {item.technologies && (
                        <div className="t4-tech">
                          {item.technologies}
                        </div>
                      )}
                    </div>

                    {item.link && (
                      <div className="t4-right">
                        {item.link}
                      </div>
                    )}
                  </div>

                  {item.description && (
                    <div>{item.description}</div>
                  )}

                  {item.contribution && (
                    <div>
                      <span className="t4-label">
                        Contribution:
                      </span>{" "}
                      {item.contribution}
                    </div>
                  )}

                  {item.result && (
                    <div>
                      <span className="t4-label">
                        Result:
                      </span>{" "}
                      {item.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <Award size={13} strokeWidth={2.4} />
              </span>
              Skills
            </div>

            <div className="t4-content">
              <div className="t4-skills">
                {data.skills.filter(Boolean).map((skill, index) => (
                  <span className="t4-skill" key={index}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {data.certifications.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <Award size={13} strokeWidth={2.4} />
              </span>
              Certifications
            </div>

            <div className="t4-content">
              {data.certifications.map((item) => (
                <div className="t4-cert" key={item.id}>
                  <div className="t4-bold">
                    {item.name}
                  </div>

                  <div>
                    {item.issuer}
                    {item.year ? ` · ${item.year}` : ""}
                    {item.credentialId
                      ? ` · ${item.credentialId}`
                      : ""}
                  </div>

                  {item.link && (
                    <div>{item.link}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.achievements.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <Award size={13} strokeWidth={2.4} />
              </span>
              Achievements
            </div>

            <div className="t4-content">
              {data.achievements.map((item) => (
                <div className="t4-achievement" key={item.id}>
                  <div className="t4-grid">
                    <div>
                      <div className="t4-bold">
                        {item.title}
                      </div>

                      {item.organization && (
                        <div className="t4-bold">
                          {item.organization}
                        </div>
                      )}

                      {item.description && (
                        <div>{item.description}</div>
                      )}
                    </div>

                    {item.year && (
                      <div className="t4-right">
                        {item.year}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className="t4-section">
            <div className="t4-heading">
              <span className="t4-icon">
                <Languages size={13} strokeWidth={2.4} />
              </span>
              Languages
            </div>

            <div className="t4-content">
              <div className="t4-languages">
                {data.languages.map((item) => (
                  <span key={item.id}>
                    <strong>{item.name}</strong>
                    {item.level ? ` · ${item.level}` : ""}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function GenericPreview({
  data,
  template,
}: {
  data: ResumeData;
  template: string;
}) {
  return (
    <div className="w-[794px] min-h-[1123px] bg-white px-[45px] py-[42px] font-sans text-[#111827]">
      <div className="border-b-2 border-[#111827] pb-4">
        <div className="text-3xl font-extrabold">
          {data.fullName || "Your Name"}
        </div>
        <div className="mt-1 text-sm font-semibold">
          {data.title || "Professional"}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {data.summary && (
          <section>
            <h2 className="text-sm font-extrabold uppercase">
              Summary
            </h2>
            <p className="mt-2 text-xs leading-5">
              {data.summary}
            </p>
          </section>
        )}

        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-sm font-extrabold uppercase">
              Experience
            </h2>
            {data.experiences.map((item) => (
              <div className="mt-3" key={item.id}>
                <div className="flex justify-between gap-5">
                  <div>
                    <div className="text-xs font-bold">
                      {item.company}
                    </div>
                    <div className="text-xs font-semibold">
                      {item.role}
                    </div>
                  </div>
                  <div className="text-[10px]">
                    {item.start} –{" "}
                    {item.current ? "Present" : item.end}
                  </div>
                </div>

                {item.bullets.filter(Boolean).map((bullet, index) => (
                  <div className="mt-1 text-[10px]" key={index}>
                    • {bullet}
                  </div>
                ))}
              </div>
            ))}
          </section>
        )}

        {data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-extrabold uppercase">
              Education
            </h2>
            {data.education.map((item) => (
              <div className="mt-3 text-xs" key={item.id}>
                <div className="font-bold">
                  {item.institution}
                </div>
                <div>
                  {item.degree} {item.field}
                </div>
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-extrabold uppercase">
              Projects
            </h2>
            {data.projects.map((item) => (
              <div className="mt-3 text-xs" key={item.id}>
                <div className="font-bold">{item.name}</div>
                <div>{item.technologies}</div>
                <div>{item.description}</div>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-extrabold uppercase">
              Skills
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  className="rounded border px-2 py-1 text-[10px]"
                  key={index}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 text-[9px] text-[#98a2b3]">
        Template {template}
      </div>
    </div>
  );
}

export default function ResumeEditorPage() {
  const router = useRouter();

  const [template, setTemplate] = useState("4");
  const [mode, setMode] = useState("scratch");
  const [activeSection, setActiveSection] = useState("contacts");
  const [saved, setSaved] = useState(false);

  const [data, setData] = useState<ResumeData>(defaultData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const selectedTemplate = params.get("template") || "4";
    const selectedMode =
      params.get("mode") === "existing"
        ? "existing"
        : "scratch";

    setTemplate(selectedTemplate);
    setMode(selectedMode);

    const stored = sessionStorage.getItem(
      "jobix_resume_builder_data"
    );

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setData({
          ...defaultData,
          ...parsed,
          experiences: Array.isArray(parsed.experiences)
            ? parsed.experiences
            : [],
          education: Array.isArray(parsed.education)
            ? parsed.education
            : [],
          projects: Array.isArray(parsed.projects)
            ? parsed.projects
            : [],
          skills: Array.isArray(parsed.skills)
            ? parsed.skills
            : [],
          certifications: Array.isArray(parsed.certifications)
            ? parsed.certifications
            : [],
          achievements: Array.isArray(parsed.achievements)
            ? parsed.achievements
            : [],
          languages: Array.isArray(parsed.languages)
            ? parsed.languages
            : [],
        });
      } catch {
        setData(defaultData);
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "jobix_resume_builder_data",
      JSON.stringify(data)
    );
  }, [data]);

  const update = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K]
  ) => {
    setData((previous) => ({
      ...previous,
      [key]: value,
    }));
    setSaved(false);
  };

  const completion = useMemo(() => {
    const checks = [
      data.fullName,
      data.title,
      data.email,
      data.phone,
      data.summary,
      data.education.length > 0,
      data.experiences.length > 0,
      data.projects.length > 0,
      data.skills.length > 0,
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [data]);

  const sections = [
    ["contacts", "Contacts"],
    ["summary", "Summary"],
    ["experience", "Experience"],
    ["education", "Education"],
    ["projects", "Projects"],
    ["skills", "Skills"],
    ["certifications", "Certifications"],
    ["achievements", "Achievements"],
    ["languages", "Languages"],
  ];

  const saveResume = () => {
    sessionStorage.setItem(
      "jobix_resume_builder_data",
      JSON.stringify(data)
    );

    sessionStorage.setItem(
      "jobix_resume_builder_template",
      template
    );

    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[#eef1f5] text-[#101828]">
      <header className="sticky top-0 z-30 border-b border-[#d9dee7] bg-white">
        <div className="flex h-[64px] items-center justify-between px-5">
          <div>
            <div className="text-[18px] font-extrabold tracking-[-0.3px]">
              Resume Builder
            </div>
            <div className="text-[11px] text-[#667085]">
              Template {template} ·{" "}
              {mode === "existing"
                ? "Existing Resume"
                : "Build from Scratch"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg bg-[#f2f4f7] px-3 py-2 text-[11px] font-bold text-[#475467] md:flex">
              <span className="h-2 w-2 rounded-full bg-[#12b76a]" />
              Live Preview
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/resume-builder/templates?mode=" + mode
                )
              }
              className="rounded-lg border border-[#d0d5dd] bg-white px-4 py-2.5 text-[12px] font-extrabold text-[#344054] transition hover:bg-[#f9fafb]"
            >
              Change Template
            </button>

            <button
              type="button"
              onClick={saveResume}
              className="rounded-lg bg-[#111827] px-5 py-2.5 text-[12px] font-extrabold text-white transition hover:bg-[#000000]"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-64px)] grid-cols-[390px_minmax(0,1fr)]">
        <aside className="overflow-y-auto border-r border-[#d9dee7] bg-white">
          <div className="border-b border-[#eaecf0] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-extrabold">
                  Your Resume
                </div>
                <div className="mt-1 text-[11px] text-[#667085]">
                  Add your information below
                </div>
              </div>

              <div className="text-right">
                <div className="text-[16px] font-extrabold">
                  {completion}%
                </div>
                <div className="text-[10px] text-[#667085]">
                  complete
                </div>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eaecf0]">
              <div
                className="h-full rounded-full bg-[#12b76a] transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <nav className="border-b border-[#eaecf0] px-3 py-3">
            <div className="flex gap-1 overflow-x-auto">
              {sections.map(([id, label]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={
                    activeSection === id
                      ? "whitespace-nowrap rounded-lg bg-[#111827] px-3 py-2 text-[10px] font-extrabold text-white"
                      : "whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-bold text-[#667085] hover:bg-[#f2f4f7]"
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="space-y-6 px-5 py-6">
            {activeSection === "contacts" && (
              <section>
                <SectionTitle
                  title="Contact information"
                  description="This appears in the header of your resume."
                />

                <div className="space-y-4">
                  <Field
                    label="Full name"
                    value={data.fullName}
                    onChange={(value) =>
                      update("fullName", value)
                    }
                    placeholder="Jennifer Brown"
                  />

                  <Field
                    label="Professional title"
                    value={data.title}
                    onChange={(value) =>
                      update("title", value)
                    }
                    placeholder="Software Development Manager"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      label="Email"
                      value={data.email}
                      onChange={(value) =>
                        update("email", value)
                      }
                      placeholder="you@email.com"
                    />

                    <Field
                      label="Phone"
                      value={data.phone}
                      onChange={(value) =>
                        update("phone", value)
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <Field
                    label="Location"
                    value={data.location}
                    onChange={(value) =>
                      update("location", value)
                    }
                    placeholder="Bengaluru, Karnataka"
                  />

                  <Field
                    label="LinkedIn"
                    value={data.linkedin}
                    onChange={(value) =>
                      update("linkedin", value)
                    }
                    placeholder="linkedin.com/in/yourname"
                  />

                  <Field
                    label="GitHub"
                    value={data.github}
                    onChange={(value) =>
                      update("github", value)
                    }
                    placeholder="github.com/yourname"
                  />

                  <Field
                    label="Portfolio / Website"
                    value={data.portfolio}
                    onChange={(value) =>
                      update("portfolio", value)
                    }
                    placeholder="yourwebsite.com"
                  />
                </div>
              </section>
            )}

            {activeSection === "summary" && (
              <section>
                <SectionTitle
                  title="Professional summary"
                  description="Write a concise 2–4 line introduction."
                />

                <TextArea
                  label="Summary"
                  value={data.summary}
                  onChange={(value) =>
                    update("summary", value)
                  }
                  placeholder="Motivated software engineer with experience in..."
                />
              </section>
            )}

            {activeSection === "experience" && (
              <section>
                <SectionTitle
                  title="Experience"
                  description="Add each job separately. Use individual achievements instead of one large paragraph."
                />

                <div className="space-y-4">
                  {data.experiences.map((item, index) => (
                    <EditorCard
                      key={item.id}
                      number={index + 1}
                      title={
                        item.role ||
                        item.company ||
                        "Experience"
                      }
                      onRemove={() =>
                        update(
                          "experiences",
                          data.experiences.filter(
                            (entry) => entry.id !== item.id
                          )
                        )
                      }
                    >
                      <div className="space-y-3">
                        <Field
                          label="Company"
                          value={item.company}
                          onChange={(value) =>
                            update(
                              "experiences",
                              data.experiences.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        company: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Accenture"
                        />

                        <Field
                          label="Job title"
                          value={item.role}
                          onChange={(value) =>
                            update(
                              "experiences",
                              data.experiences.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        role: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Software Engineer"
                        />

                        <Field
                          label="Location"
                          value={item.location}
                          onChange={(value) =>
                            update(
                              "experiences",
                              data.experiences.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        location: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Bengaluru, Karnataka"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start"
                            value={item.start}
                            onChange={(value) =>
                              update(
                                "experiences",
                                data.experiences.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          start: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="Jun 2024"
                          />

                          <Field
                            label="End"
                            value={item.end}
                            onChange={(value) =>
                              update(
                                "experiences",
                                data.experiences.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          end: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="Present"
                          />
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-[12px] font-bold text-[#344054]">
                          <input
                            type="checkbox"
                            checked={item.current}
                            onChange={(event) =>
                              update(
                                "experiences",
                                data.experiences.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          current:
                                            event.target
                                              .checked,
                                        }
                                      : entry
                                )
                              )
                            }
                            className="h-4 w-4 accent-[#111827]"
                          />
                          I currently work here
                        </label>

                        <div>
                          <div className="mb-2 text-[12px] font-bold text-[#25314a]">
                            Achievements
                          </div>

                          <div className="space-y-2">
                            {item.bullets.map(
                              (bullet, bulletIndex) => (
                                <div
                                  className="flex gap-2"
                                  key={bulletIndex}
                                >
                                  <input
                                    value={bullet}
                                    onChange={(event) => {
                                      const bullets = [
                                        ...item.bullets,
                                      ];
                                      bullets[bulletIndex] =
                                        event.target.value;

                                      update(
                                        "experiences",
                                        data.experiences.map(
                                          (entry) =>
                                            entry.id ===
                                            item.id
                                              ? {
                                                  ...entry,
                                                  bullets,
                                                }
                                              : entry
                                        )
                                      );
                                    }}
                                    placeholder={
                                      "Delivered measurable result..."
                                    }
                                    className="min-w-0 flex-1 rounded-lg border border-[#d8dee9] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-[#111827]"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const bullets =
                                        item.bullets.filter(
                                          (_, i) =>
                                            i !== bulletIndex
                                        );

                                      update(
                                        "experiences",
                                        data.experiences.map(
                                          (entry) =>
                                            entry.id ===
                                            item.id
                                              ? {
                                                  ...entry,
                                                  bullets:
                                                    bullets
                                                      .length
                                                      ? bullets
                                                      : [""],
                                                }
                                              : entry
                                        )
                                      );
                                    }}
                                    className="rounded-lg p-2 text-[#98a2b3] hover:bg-[#fff1f1] hover:text-[#d92d20]"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              update(
                                "experiences",
                                data.experiences.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          bullets: [
                                            ...entry.bullets,
                                            "",
                                          ],
                                        }
                                      : entry
                                )
                              )
                            }
                            className="mt-2 text-[11px] font-extrabold text-[#344054] underline"
                          >
                            + Add achievement
                          </button>
                        </div>
                      </div>
                    </EditorCard>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("experiences", [
                      ...data.experiences,
                      emptyExperience(),
                    ])
                  }
                >
                  Add Experience
                </AddButton>
              </section>
            )}

            {activeSection === "education" && (
              <section>
                <SectionTitle
                  title="Education"
                  description="Add degrees, diplomas, school or university education."
                />

                <div className="space-y-4">
                  {data.education.map((item, index) => (
                    <EditorCard
                      key={item.id}
                      number={index + 1}
                      title={
                        item.institution ||
                        item.degree ||
                        "Education"
                      }
                      onRemove={() =>
                        update(
                          "education",
                          data.education.filter(
                            (entry) => entry.id !== item.id
                          )
                        )
                      }
                    >
                      <div className="space-y-3">
                        <Field
                          label="Institution"
                          value={item.institution}
                          onChange={(value) =>
                            update(
                              "education",
                              data.education.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        institution:
                                          value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="University of Chicago"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Degree"
                            value={item.degree}
                            onChange={(value) =>
                              update(
                                "education",
                                data.education.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          degree: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="B.E."
                          />

                          <Field
                            label="Field of study"
                            value={item.field}
                            onChange={(value) =>
                              update(
                                "education",
                                data.education.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          field: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="Computer Science"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Grade / GPA"
                            value={item.grade}
                            onChange={(value) =>
                              update(
                                "education",
                                data.education.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          grade: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="9.2 / 10"
                          />

                          <Field
                            label="Location"
                            value={item.location}
                            onChange={(value) =>
                              update(
                                "education",
                                data.education.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          location: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="Bengaluru"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start"
                            value={item.start}
                            onChange={(value) =>
                              update(
                                "education",
                                data.education.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          start: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="2023"
                          />

                          <Field
                            label="End"
                            value={item.end}
                            onChange={(value) =>
                              update(
                                "education",
                                data.education.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          end: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="2027"
                          />
                        </div>
                      </div>
                    </EditorCard>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("education", [
                      ...data.education,
                      emptyEducation(),
                    ])
                  }
                >
                  Add Education
                </AddButton>
              </section>
            )}

            {activeSection === "projects" && (
              <section>
                <SectionTitle
                  title="Projects"
                  description="Projects are especially valuable for students and freshers."
                />

                <div className="space-y-4">
                  {data.projects.map((item, index) => (
                    <EditorCard
                      key={item.id}
                      number={index + 1}
                      title={item.name || "Project"}
                      onRemove={() =>
                        update(
                          "projects",
                          data.projects.filter(
                            (entry) => entry.id !== item.id
                          )
                        )
                      }
                    >
                      <div className="space-y-3">
                        <Field
                          label="Project name"
                          value={item.name}
                          onChange={(value) =>
                            update(
                              "projects",
                              data.projects.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        name: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Alzheimer Early Disease Prediction"
                        />

                        <Field
                          label="Technologies"
                          value={item.technologies}
                          onChange={(value) =>
                            update(
                              "projects",
                              data.projects.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        technologies:
                                          value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="React, Python, Machine Learning"
                        />

                        <Field
                          label="Project link"
                          value={item.link}
                          onChange={(value) =>
                            update(
                              "projects",
                              data.projects.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        link: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="github.com/..."
                        />

                        <TextArea
                          label="Description"
                          value={item.description}
                          onChange={(value) =>
                            update(
                              "projects",
                              data.projects.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        description:
                                          value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="What does the project do?"
                        />

                        <TextArea
                          label="Your contribution"
                          value={item.contribution}
                          onChange={(value) =>
                            update(
                              "projects",
                              data.projects.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        contribution:
                                          value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="What did you personally build or accomplish?"
                        />

                        <TextArea
                          label="Result / impact"
                          value={item.result}
                          onChange={(value) =>
                            update(
                              "projects",
                              data.projects.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        result: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="What was the measurable result?"
                        />
                      </div>
                    </EditorCard>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("projects", [
                      ...data.projects,
                      emptyProject(),
                    ])
                  }
                >
                  Add Project
                </AddButton>
              </section>
            )}

            {activeSection === "skills" && (
              <section>
                <SectionTitle
                  title="Skills"
                  description="Add the skills relevant to the roles you are targeting."
                />

                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div className="flex gap-2" key={index}>
                      <input
                        value={skill}
                        onChange={(event) => {
                          const skills = [...data.skills];
                          skills[index] = event.target.value;
                          update("skills", skills);
                        }}
                        placeholder="Java"
                        className="min-w-0 flex-1 rounded-lg border border-[#d8dee9] px-3 py-2.5 text-[12px] outline-none focus:border-[#111827]"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          update(
                            "skills",
                            data.skills.filter(
                              (_, i) => i !== index
                            )
                          )
                        }
                        className="rounded-lg p-2 text-[#98a2b3] hover:bg-[#fff1f1] hover:text-[#d92d20]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("skills", [...data.skills, ""])
                  }
                >
                  Add Skill
                </AddButton>
              </section>
            )}

            {activeSection === "certifications" && (
              <section>
                <SectionTitle
                  title="Certifications"
                  description="Add professional, technical and academic certifications."
                />

                <div className="space-y-4">
                  {data.certifications.map((item, index) => (
                    <EditorCard
                      key={item.id}
                      number={index + 1}
                      title={item.name || "Certification"}
                      onRemove={() =>
                        update(
                          "certifications",
                          data.certifications.filter(
                            (entry) => entry.id !== item.id
                          )
                        )
                      }
                    >
                      <div className="space-y-3">
                        <Field
                          label="Certification"
                          value={item.name}
                          onChange={(value) =>
                            update(
                              "certifications",
                              data.certifications.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        name: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="AWS Certified Developer"
                        />

                        <Field
                          label="Issuing organization"
                          value={item.issuer}
                          onChange={(value) =>
                            update(
                              "certifications",
                              data.certifications.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        issuer: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Amazon Web Services"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Year"
                            value={item.year}
                            onChange={(value) =>
                              update(
                                "certifications",
                                data.certifications.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          year: value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="2026"
                          />

                          <Field
                            label="Credential ID"
                            value={item.credentialId}
                            onChange={(value) =>
                              update(
                                "certifications",
                                data.certifications.map(
                                  (entry) =>
                                    entry.id === item.id
                                      ? {
                                          ...entry,
                                          credentialId:
                                            value,
                                        }
                                      : entry
                                )
                              )
                            }
                            placeholder="ABC123"
                          />
                        </div>

                        <Field
                          label="Credential URL"
                          value={item.link}
                          onChange={(value) =>
                            update(
                              "certifications",
                              data.certifications.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        link: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="credential.example.com"
                        />
                      </div>
                    </EditorCard>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("certifications", [
                      ...data.certifications,
                      emptyCertification(),
                    ])
                  }
                >
                  Add Certification
                </AddButton>
              </section>
            )}

            {activeSection === "achievements" && (
              <section>
                <SectionTitle
                  title="Achievements"
                  description="Add hackathons, awards, competitions and other accomplishments."
                />

                <div className="space-y-4">
                  {data.achievements.map((item, index) => (
                    <EditorCard
                      key={item.id}
                      number={index + 1}
                      title={item.title || "Achievement"}
                      onRemove={() =>
                        update(
                          "achievements",
                          data.achievements.filter(
                            (entry) => entry.id !== item.id
                          )
                        )
                      }
                    >
                      <div className="space-y-3">
                        <Field
                          label="Achievement"
                          value={item.title}
                          onChange={(value) =>
                            update(
                              "achievements",
                              data.achievements.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        title: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Hackathon Winner"
                        />

                        <Field
                          label="Organization"
                          value={item.organization}
                          onChange={(value) =>
                            update(
                              "achievements",
                              data.achievements.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        organization:
                                          value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Smart India Hackathon"
                        />

                        <Field
                          label="Year"
                          value={item.year}
                          onChange={(value) =>
                            update(
                              "achievements",
                              data.achievements.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        year: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="2026"
                        />

                        <TextArea
                          label="Description"
                          value={item.description}
                          onChange={(value) =>
                            update(
                              "achievements",
                              data.achievements.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        description:
                                          value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Describe what you achieved."
                        />
                      </div>
                    </EditorCard>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("achievements", [
                      ...data.achievements,
                      emptyAchievement(),
                    ])
                  }
                >
                  Add Achievement
                </AddButton>
              </section>
            )}

            {activeSection === "languages" && (
              <section>
                <SectionTitle
                  title="Languages"
                  description="Add languages and proficiency levels."
                />

                <div className="space-y-3">
                  {data.languages.map((item, index) => (
                    <EditorCard
                      key={item.id}
                      number={index + 1}
                      title={item.name || "Language"}
                      onRemove={() =>
                        update(
                          "languages",
                          data.languages.filter(
                            (entry) => entry.id !== item.id
                          )
                        )
                      }
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Language"
                          value={item.name}
                          onChange={(value) =>
                            update(
                              "languages",
                              data.languages.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        name: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="English"
                        />

                        <Field
                          label="Proficiency"
                          value={item.level}
                          onChange={(value) =>
                            update(
                              "languages",
                              data.languages.map(
                                (entry) =>
                                  entry.id === item.id
                                    ? {
                                        ...entry,
                                        level: value,
                                      }
                                    : entry
                              )
                            )
                          }
                          placeholder="Native"
                        />
                      </div>
                    </EditorCard>
                  ))}
                </div>

                <AddButton
                  onClick={() =>
                    update("languages", [
                      ...data.languages,
                      emptyLanguage(),
                    ])
                  }
                >
                  Add Language
                </AddButton>
              </section>
            )}
          </div>
        </aside>

        <section className="min-w-0 overflow-auto bg-[#eef1f5]">
          <div className="flex min-h-full justify-center px-8 py-10">
            <div className="origin-top shadow-[0_8px_30px_rgba(16,24,40,0.12)]">
              {template === "4" ? (
                <Template4Preview data={data} />
              ) : (
                <GenericPreview
                  data={data}
                  template={template}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
