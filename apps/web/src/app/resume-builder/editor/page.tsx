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
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
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
  fullName: "Vishwanath Samrat",
  title: "Software Engineer",
  email: "vishwanath.samrat@example.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, Karnataka, India",
  linkedin: "linkedin.com/in/vishwanathsamrat",
  github: "github.com/vishwanathsamrat",
  portfolio: "vishwanathsamrat.dev",
  summary: "Computer Science student and aspiring software engineer with hands-on experience building full-stack web applications, AI-powered tools, and data-driven projects. Strong foundation in Java, Python, React, Next.js, databases, and machine learning with a focus on creating reliable and user-friendly products.",
  experiences: [
    {
      id: "exp-1",
      company: "TechNova Solutions",
      role: "Software Engineering Intern",
      location: "Bengaluru, Karnataka",
      start: "Jun 2026",
      end: "Aug 2026",
      current: false,
      bullets: [
        "Developed responsive web features using React, Next.js, TypeScript, and REST APIs.",
        "Improved application performance by optimizing API requests and reusable frontend components.",
        "Collaborated with developers to debug production issues and deliver features within sprint deadlines."
      ]
    },
    {
      id: "exp-2",
      company: "CodeCraft Labs",
      role: "Full Stack Development Intern",
      location: "Remote",
      start: "Jan 2026",
      end: "May 2026",
      current: false,
      bullets: [
        "Built backend services with Python and FastAPI and connected applications to PostgreSQL databases.",
        "Created reusable dashboard components and implemented authentication workflows.",
        "Worked with Git and GitHub to manage feature development and code reviews."
      ]
    },
    {
      id: "exp-3",
      company: "University Technology Club",
      role: "Technical Team Member",
      location: "Bengaluru, Karnataka",
      start: "Aug 2024",
      end: "Dec 2025",
      current: false,
      bullets: [
        "Built internal tools and technical prototypes for student events and project demonstrations.",
        "Mentored junior students in Java, Python, Git, and web development fundamentals."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Bangalore Institute of Technology",
      degree: "Bachelor of Engineering",
      field: "Computer Science and Engineering",
      grade: "9.2 / 10",
      start: "2023",
      end: "2027",
      location: "Bengaluru, India"
    },
    {
      id: "edu-2",
      institution: "ABC Pre-University College",
      degree: "Pre-University Course",
      field: "Science",
      grade: "94%",
      start: "2021",
      end: "2023",
      location: "Bengaluru, India"
    }
  ],
  projects: [
    {
      id: "project-1",
      name: "JOBIX Career Platform",
      technologies: "Next.js, TypeScript, FastAPI, PostgreSQL",
      description: "Career platform designed to help students and professionals improve resumes, evaluate ATS compatibility, and build professional applications.",
      contribution: "Designed the frontend architecture, authentication flow, resume builder interface, ATS workflow, and responsive user experience.",
      result: "Created a production-style platform with reusable career tools and live resume editing.",
      link: "github.com/vishwanathsamrat/jobix"
    },
    {
      id: "project-2",
      name: "AI Resume Analyzer",
      technologies: "Python, FastAPI, Sarvam AI, NLP",
      description: "AI-powered resume analysis system that evaluates resumes against job descriptions and generates structured improvement recommendations.",
      contribution: "Implemented document ingestion, text extraction, prompt design, structured AI responses, scoring logic, and result presentation.",
      result: "Generated detailed ATS-style feedback with an overall match score, keyword gaps, strengths, and improvement actions.",
      link: "github.com/vishwanathsamrat/ai-resume-analyzer"
    },
    {
      id: "project-3",
      name: "Bank Statement Analyzer",
      technologies: "Python, FastAPI, Machine Learning, SQLite",
      description: "Financial document analysis application that extracts transactions from bank statements and categorizes spending.",
      contribution: "Built ingestion and normalization pipelines, transaction validation, categorization logic, analytics, and automated report generation.",
      result: "Produced structured financial summaries and downloadable analysis reports from uploaded statements.",
      link: "github.com/vishwanathsamrat/bank-statement-analyzer"
    },
    {
      id: "project-4",
      name: "Student Performance Predictor",
      technologies: "Python, Pandas, Scikit-learn, Streamlit",
      description: "Machine learning application that predicts student performance using academic and behavioral features.",
      contribution: "Prepared datasets, trained classification models, evaluated performance, and created an interactive prediction interface.",
      result: "Achieved strong validation performance while providing interpretable prediction results.",
      link: "github.com/vishwanathsamrat/student-performance"
    },
    {
      id: "project-5",
      name: "Campus Event Management",
      technologies: "Java, Spring Boot, MySQL, HTML, CSS",
      description: "Web application for managing college events, registrations, participants, and event announcements.",
      contribution: "Developed REST APIs, database models, registration workflows, and administrative functionality.",
      result: "Simplified event registration and centralized participant management for student organizations.",
      link: "github.com/vishwanathsamrat/campus-events"
    }
  ],
  skills: [
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "FastAPI",
    "Spring Boot",
    "PostgreSQL",
    "MySQL",
    "Git",
    "GitHub",
    "REST APIs",
    "Machine Learning",
    "NLP"
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2026",
      credentialId: "AWS-CP-48291",
      link: "aws.amazon.com/verification"
    },
    {
      id: "cert-2",
      name: "Python for Data Science",
      issuer: "IBM",
      year: "2025",
      credentialId: "IBM-PDS-72914",
      link: "coursera.org/verify"
    },
    {
      id: "cert-3",
      name: "Java Programming",
      issuer: "Oracle Academy",
      year: "2025",
      credentialId: "ORA-JAVA-38172",
      link: "education.oracle.com"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Hackathon Finalist",
      organization: "Smart India Hackathon",
      year: "2026",
      description: "Reached the final stage of a national-level hackathon by developing an AI-assisted career technology solution."
    },
    {
      id: "ach-2",
      title: "First Place - University Coding Challenge",
      organization: "Bangalore Institute of Technology",
      year: "2025",
      description: "Secured first place in a competitive programming and problem-solving challenge."
    },
    {
      id: "ach-3",
      title: "Technical Excellence Award",
      organization: "University Technology Club",
      year: "2025",
      description: "Recognized for technical contribution and leadership across student technology initiatives."
    },
    {
      id: "ach-4",
      title: "Open Source Contributor",
      organization: "GitHub",
      year: "2025",
      description: "Contributed bug fixes, documentation improvements, and reusable components to open-source projects."
    }
  ],
  languages: [
    {
      id: "lang-1",
      name: "English",
      level: "Professional"
    },
    {
      id: "lang-2",
      name: "Kannada",
      level: "Native"
    },
    {
      id: "lang-3",
      name: "Hindi",
      level: "Professional"
    }
  ]
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


function cleanResumeText(value: string) {
  if (!value) return "";

  let result = value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])([A-Za-z])/g, "$1 $2")
    .trim();

  result = result.replace(
    /^(description|contribution|result|details|responsibilities)\s*:\s*/i,
    ""
  );

  result = result.replace(
    /^(description|contribution|result|details|responsibilities)\s*:\s*/i,
    ""
  );

  if (result) {
    result =
      result.charAt(0).toUpperCase() +
      result.slice(1);
  }

  return result;
}

function cleanResumeTitle(value: string) {
  if (!value) return "";

  const known = new Map([
    ["software engineer", "Software Engineer"],
    ["software developer", "Software Developer"],
    ["full stack developer", "Full Stack Developer"],
    ["full-stack developer", "Full-Stack Developer"],
    ["frontend developer", "Frontend Developer"],
    ["front end developer", "Frontend Developer"],
    ["backend developer", "Backend Developer"],
    ["back end developer", "Backend Developer"],
    ["data scientist", "Data Scientist"],
    ["data science", "Data Science"],
    ["machine learning engineer", "Machine Learning Engineer"],
    ["web developer", "Web Developer"],
    ["project manager", "Project Manager"],
    ["student", "Student"],
    ["fresher", "Fresher"],
  ]);

  const normalized = value
    .replace(/\s+/g, " ")
    .trim();

  const direct = known.get(
    normalized.toLowerCase()
  );

  if (direct) return direct;

  return normalized
    .split(" ")
    .map((word) => {
      if (!word) return word;

      const lower = word.toLowerCase();

      if (lower === "ai") return "AI";
      if (lower === "ml") return "ML";
      if (lower === "ui") return "UI";
      if (lower === "ux") return "UX";
      if (lower === "api") return "API";
      if (lower === "sql") return "SQL";
      if (lower === "aws") return "AWS";
      if (lower === "gcp") return "GCP";
      if (lower === "css") return "CSS";
      if (lower === "html") return "HTML";
      if (lower === "js") return "JS";

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

function cleanTechnology(value: string) {
  if (!value) return "";

  const technologyMap: Record<string, string> = {
    "node js": "Node.js",
    "nodejs": "Node.js",
    "react js": "React.js",
    "reactjs": "React.js",
    "next js": "Next.js",
    "nextjs": "Next.js",
    "express js": "Express.js",
    "expressjs": "Express.js",
    "mongo db": "MongoDB",
    "mongodb": "MongoDB",
    "mysql": "MySQL",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "power bi": "Power BI",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "scikit learn": "Scikit-learn",
    "scikit-learn": "Scikit-learn",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "python": "Python",
    "java": "Java",
    "c++": "C++",
    "c#": "C#",
    "github": "GitHub",
    "gitlab": "GitLab",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "spring boot": "Spring Boot",
    "rest api": "REST API",
    "rest apis": "REST APIs",
    "nlp": "NLP",
    "computer vision": "Computer Vision",
  };

  const normalized = value
    .replace(/\s+/g, " ")
    .trim();

  return (
    technologyMap[normalized.toLowerCase()] ||
    cleanResumeTitle(normalized)
  );
}

function cleanTechnologyList(value: string) {
  if (!value) return "";

  const values = value
    .split(/[,\n|•]+/)
    .map((item) =>
      cleanTechnology(item.trim())
    )
    .filter(Boolean);

  return Array.from(
    new Set(values)
  ).join(" · ");
}

function cleanSkills(skills: string[]) {
  return Array.from(
    new Set(
      skills
        .flatMap((skill) =>
          skill.split(/[,\n|•]+/)
        )
        .map((skill) =>
          cleanTechnology(skill.trim())
        )
        .filter(Boolean)
    )
  );
}

function cleanUrl(value: string) {
  if (!value) return "";

  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "")
    .trim();
}

function cleanDate(value: string) {
  if (!value) return "";

  return value
    .replace(/\s+/g, " ")
    .replace(/\s*[-–—]\s*/g, " – ")
    .trim();
}

function cleanResumeData(data: ResumeData): ResumeData {
  return {
    ...data,

    fullName: data.fullName
      ? data.fullName
          .replace(/\s+/g, " ")
          .trim()
      : "",

    title: cleanResumeTitle(
      data.title || ""
    ),

    email: data.email
      ? data.email.trim().toLowerCase()
      : "",

    phone: data.phone
      ? data.phone
          .replace(/\s+/g, " ")
          .trim()
      : "",

    location: data.location
      ? cleanResumeTitle(data.location)
      : "",

    linkedin: cleanUrl(
      data.linkedin || ""
    ),

    github: cleanUrl(
      data.github || ""
    ),

    portfolio: cleanUrl(
      data.portfolio || ""
    ),

    summary: cleanResumeText(
      data.summary || ""
    ),

    skills: cleanSkills(
      data.skills || []
    ),

    education: data.education.map(
      (item) => ({
        ...item,
        institution:
          cleanResumeTitle(
            item.institution || ""
          ),
        degree:
          cleanResumeTitle(
            item.degree || ""
          ),
        field:
          cleanResumeTitle(
            item.field || ""
          ),
        grade:
          item.grade
            ? item.grade.trim()
            : "",
        start:
          cleanDate(
            item.start || ""
          ),
        end:
          cleanDate(
            item.end || ""
          ),
        location:
          item.location
            ? cleanResumeTitle(
                item.location
              )
            : "",
      })
    ),

    experiences:
      data.experiences.map(
        (item) => ({
          ...item,
          company:
            cleanResumeTitle(
              item.company || ""
            ),
          role:
            cleanResumeTitle(
              item.role || ""
            ),
          location:
            item.location
              ? cleanResumeTitle(
                  item.location
                )
              : "",
          start:
            cleanDate(
              item.start || ""
            ),
          end:
            cleanDate(
              item.end || ""
            ),
          bullets:
            item.bullets
              .map((bullet) =>
                cleanResumeText(
                  bullet
                )
              )
              .filter(Boolean),
        })
      ),

    projects:
      data.projects.map(
        (item) => ({
          ...item,
          name:
            cleanResumeTitle(
              item.name || ""
            ),
          technologies:
            cleanTechnologyList(
              item.technologies || ""
            ),
          description:
            cleanResumeText(
              item.description || ""
            ),
          contribution:
            cleanResumeText(
              item.contribution || ""
            ),
          result:
            cleanResumeText(
              item.result || ""
            ),
          link:
            cleanUrl(
              item.link || ""
            ),
        })
      ),

    certifications:
      data.certifications.map(
        (item) => ({
          ...item,
          name:
            cleanResumeTitle(
              item.name || ""
            ),
          issuer:
            cleanResumeTitle(
              item.issuer || ""
            ),
          year:
            cleanDate(
              item.year || ""
            ),
          credentialId:
            item.credentialId
              ? item.credentialId.trim()
              : "",
          link:
            cleanUrl(
              item.link || ""
            ),
        })
      ),

    achievements:
      data.achievements.map(
        (item) => ({
          ...item,
          title:
            cleanResumeTitle(
              item.title || ""
            ),
          organization:
            cleanResumeTitle(
              item.organization || ""
            ),
          description:
            cleanResumeText(
              item.description || ""
            ),
          year:
            cleanDate(
              item.year || ""
            ),
        })
      ),

    languages:
      data.languages.map(
        (item) => ({
          ...item,
          name:
            cleanResumeTitle(
              item.name || ""
            ),
          level:
            cleanResumeTitle(
              item.level || ""
            ),
        })
      ),
  };
}















function Template4Preview({ data }: { data: ResumeData }) {
  const resume = cleanResumeData(data);

  type Block = {
    id: string;
    section: string;
    heading: boolean;
    content: React.ReactNode;
  };

  const [pages, setPages] = useState<Block[][]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  const contact = [
    resume.email,
    resume.phone,
    resume.location
  ].filter(Boolean);

  const links = [
    resume.linkedin,
    resume.github,
    resume.portfolio
  ].filter(Boolean);

  const makeHeading = (
    id: string,
    section: string,
    title: string,
    icon: React.ReactNode
  ): Block => ({
    id,
    section,
    heading: true,
    content: (
      <div className="jobix-t4-heading">
        <span className="jobix-t4-icon">
          {icon}
        </span>
        <span>{title}</span>
      </div>
    )
  });

  const blocks: Block[] = [];

  if (resume.summary.trim()) {
    blocks.push(
      makeHeading(
        "summary-heading",
        "summary",
        "Summary",
        <UserRound size={13} strokeWidth={2} />
      )
    );

    blocks.push({
      id: "summary-content",
      section: "summary",
      heading: false,
      content: (
        <div className="jobix-t4-content">
          <p className="jobix-t4-summary">
            {resume.summary}
          </p>
        </div>
      )
    });
  }

  if (resume.education.length) {
    blocks.push(
      makeHeading(
        "education-heading",
        "education",
        "Education",
        <GraduationCap size={13} strokeWidth={2} />
      )
    );

    resume.education.forEach((item) => {
      blocks.push({
        id: `education-${item.id}`,
        section: "education",
        heading: false,
        content: (
          <div className="jobix-t4-content jobix-t4-entry">
            <div className="jobix-t4-grid">
              <div className="jobix-t4-entry-text">
                <div className="jobix-t4-strong">
                  {item.institution}
                </div>

                <div>
                  {item.degree}
                  {item.field
                    ? ` - ${item.field}`
                    : ""}
                  {item.grade
                    ? `, ${item.grade}`
                    : ""}
                </div>

                {(item.start || item.end) && (
                  <div>
                    {item.start}
                    {item.start && item.end
                      ? " – "
                      : ""}
                    {item.end}
                  </div>
                )}
              </div>

              {item.location && (
                <div className="jobix-t4-right">
                  {item.location}
                </div>
              )}
            </div>
          </div>
        )
      });
    });
  }

  if (resume.experiences.length) {
    blocks.push(
      makeHeading(
        "experience-heading",
        "experience",
        "Experience",
        <BriefcaseBusiness size={13} strokeWidth={2} />
      )
    );

    resume.experiences.forEach((item) => {
      const bullets = item.bullets.filter(Boolean);

      blocks.push({
        id: `experience-${item.id}`,
        section: "experience",
        heading: false,
        content: (
          <div className="jobix-t4-content jobix-t4-entry">
            <div className="jobix-t4-grid">
              <div className="jobix-t4-entry-text">
                <div className="jobix-t4-strong">
                  {item.company}
                </div>

                <div className="jobix-t4-role">
                  {item.role}
                </div>
              </div>

              <div className="jobix-t4-right">
                {item.start}
                {item.start &&
                (item.end || item.current)
                  ? " – "
                  : ""}
                {item.current
                  ? "Present"
                  : item.end}
              </div>
            </div>

            {item.location && (
              <div className="jobix-t4-location">
                {item.location}
              </div>
            )}

            {bullets.length > 0 && (
              <ul className="jobix-t4-bullets">
                {bullets.map((bullet, index) => (
                  <li key={index}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      });
    });
  }

  if (resume.skills.filter(Boolean).length) {
    blocks.push(
      makeHeading(
        "skills-heading",
        "skills",
        "Skills",
        <Award size={13} strokeWidth={2} />
      )
    );

    blocks.push({
      id: "skills-content",
      section: "skills",
      heading: false,
      content: (
        <div className="jobix-t4-content">
          <div className="jobix-t4-skills">
            {resume.skills
              .filter(Boolean)
              .map((skill, index) => (
                <span
                  className="jobix-t4-skill"
                  key={index}
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      )
    });
  }

  if (resume.projects.length) {
    blocks.push(
      makeHeading(
        "projects-heading",
        "projects",
        "Projects",
        <BriefcaseBusiness size={13} strokeWidth={2} />
      )
    );

    resume.projects.forEach((item) => {
      const bullets = [
        item.description,
        item.contribution,
        item.result
      ].filter(Boolean);

      blocks.push({
        id: `project-${item.id}`,
        section: "projects",
        heading: false,
        content: (
          <div className="jobix-t4-content jobix-t4-entry">
            <div className="jobix-t4-grid">
              <div>
                <div className="jobix-t4-project-name">
                  {item.name}
                </div>

                {item.technologies && (
                  <div className="jobix-t4-strong">
                    {item.technologies}
                  </div>
                )}
              </div>

              {item.link && (
                <div className="jobix-t4-right">
                  {item.link}
                </div>
              )}
            </div>

            {bullets.length > 0 && (
              <ul className="jobix-t4-bullets">
                {bullets.map((bullet, index) => (
                  <li key={index}>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      });
    });
  }

  if (resume.certifications.length) {
    blocks.push(
      makeHeading(
        "certifications-heading",
        "certifications",
        "Certifications",
        <Award size={13} strokeWidth={2} />
      )
    );

    resume.certifications.forEach((item) => {
      blocks.push({
        id: `certification-${item.id}`,
        section: "certifications",
        heading: false,
        content: (
          <div className="jobix-t4-content jobix-t4-entry">
            <div className="jobix-t4-certification">
              <div className="jobix-t4-strong">
                {item.name}
              </div>

              <div>
                {item.issuer}
                {item.year
                  ? ` · ${item.year}`
                  : ""}
                {item.credentialId
                  ? ` · ${item.credentialId}`
                  : ""}
              </div>

              {item.link && (
                <div>{item.link}</div>
              )}
            </div>
          </div>
        )
      });
    });
  }

  if (resume.achievements.length) {
    blocks.push(
      makeHeading(
        "achievements-heading",
        "achievements",
        "Achievements",
        <Award size={13} strokeWidth={2} />
      )
    );

    resume.achievements.forEach((item) => {
      blocks.push({
        id: `achievement-${item.id}`,
        section: "achievements",
        heading: false,
        content: (
          <div className="jobix-t4-content jobix-t4-entry">
            <div className="jobix-t4-grid">
              <div>
                <div className="jobix-t4-strong">
                  {item.title}
                </div>

                {item.organization && (
                  <div className="jobix-t4-strong">
                    {item.organization}
                  </div>
                )}

                {item.description && (
                  <div>
                    {item.description}
                  </div>
                )}
              </div>

              {item.year && (
                <div className="jobix-t4-right">
                  {item.year}
                </div>
              )}
            </div>
          </div>
        )
      });
    });
  }

  if (
    resume.languages.filter(
      (item) => item.name.trim()
    ).length
  ) {
    blocks.push(
      makeHeading(
        "languages-heading",
        "languages",
        "Languages",
        <Languages size={13} strokeWidth={2} />
      )
    );

    blocks.push({
      id: "languages-content",
      section: "languages",
      heading: false,
      content: (
        <div className="jobix-t4-content">
          <div className="jobix-t4-languages">
            {resume.languages
              .filter(
                (item) => item.name.trim()
              )
              .map((item) => (
                <span key={item.id}>
                  <strong>{item.name}</strong>
                  {item.level
                    ? ` · ${item.level}`
                    : ""}
                </span>
              ))}
          </div>
        </div>
      )
    });
  }

  useLayoutEffect(() => {
    const root = measureRef.current;

    if (!root) {
      return;
    }

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(
        "[data-jobix-t4-block]"
      )
    );

    if (!nodes.length) {
      setPages([blocks]);
      return;
    }

    const measured = blocks.map((block, index) => ({
      block,
      height:
        nodes[index]?.getBoundingClientRect().height || 0
    }));

    const firstPageLimit = 1000;
    const otherPageLimit = 1080;

    const result: Block[][] = [];
    let current: Block[] = [];
    let currentHeight = 0;
    let currentSection = "";

    measured.forEach(({ block, height }) => {
      const limit =
        result.length === 0
          ? firstPageLimit
          : otherPageLimit;

      const sectionChanged =
        currentSection !== block.section;

      if (
        current.length > 0 &&
        currentHeight + height > limit
      ) {
        result.push(current);
        current = [];
        currentHeight = 0;

        if (
          !block.heading &&
          sectionChanged
        ) {
          const sectionHeading = blocks.find(
            (candidate) =>
              candidate.heading &&
              candidate.section === block.section
          );

          if (sectionHeading) {
            const headingIndex = blocks.findIndex(
              (candidate) =>
                candidate.id === sectionHeading.id
            );

            const headingHeight =
              measured[headingIndex]?.height || 0;

            current.push(sectionHeading);
            currentHeight += headingHeight;
          }
        }
      }

      current.push(block);
      currentHeight += height;
      currentSection = block.section;
    });

    if (current.length) {
      result.push(current);
    }

    setPages(result.length ? result : [[]]);
  }, [
    resume.fullName,
    resume.title,
    resume.summary,
    JSON.stringify(resume.education),
    JSON.stringify(resume.experiences),
    JSON.stringify(resume.projects),
    JSON.stringify(resume.skills),
    JSON.stringify(resume.certifications),
    JSON.stringify(resume.achievements),
    JSON.stringify(resume.languages)
  ]);

  return (
    <div className="jobix-t4-preview">
      <style>{`
        .jobix-t4-preview {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .jobix-t4-page {
          width: 794px;
          height: 1123px;
          min-height: 1123px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          background: #ffffff;
          color: #111111;
          font-family: Arial, Helvetica, sans-serif;
          padding: 18px 25px 24px;
        }

        .jobix-t4-header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 315px;
          gap: 18px;
          align-items: start;
          padding-bottom: 8px;
          border-bottom: 2px solid #111111;
        }

        .jobix-t4-name {
          margin: 0;
          font-size: 38px;
          line-height: 40px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .jobix-t4-title {
          margin-top: 2px;
          font-size: 12px;
          line-height: 14px;
          font-weight: 700;
        }

        .jobix-t4-contact {
          text-align: right;
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-contact-line {
          display: block;
          white-space: nowrap;
        }

        .jobix-t4-links {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .jobix-t4-body {
          padding-top: 7px;
        }

        .jobix-t4-heading {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 0 0 2px;
          color: #111111;
          font-size: 12px;
          line-height: 14px;
          font-weight: 700;
        }

        .jobix-t4-icon {
          width: 14px;
          height: 14px;
          min-width: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .jobix-t4-content {
          margin-left: 19px;
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-summary {
          margin: 0 0 4px;
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-entry {
          margin-bottom: 4px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .jobix-t4-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 145px;
          gap: 13px;
          align-items: start;
        }

        .jobix-t4-entry-text {
          min-width: 0;
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-strong {
          font-weight: 700;
        }

        .jobix-t4-role {
          font-weight: 700;
        }

        .jobix-t4-right {
          text-align: right;
          white-space: nowrap;
          font-size: 11px;
          line-height: 12px;
          color: #555555;
          font-style: italic;
        }

        .jobix-t4-location {
          margin-top: 0;
          font-size: 11px;
          line-height: 12px;
          color: #555555;
          font-style: italic;
        }

        .jobix-t4-bullets {
          margin: 2px 0 0;
          padding-left: 15px;
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-bullets li {
          margin: 0;
          padding-left: 1px;
        }

        .jobix-t4-project-name {
          font-size: 11px;
          line-height: 12px;
          font-weight: 700;
        }

        .jobix-t4-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 3px;
        }

        .jobix-t4-skill {
          display: inline-flex;
          align-items: center;
          min-height: 17px;
          box-sizing: border-box;
          padding: 2px 5px;
          border: 1px solid #aeb4bb;
          border-radius: 3px;
          background: #ffffff;
          color: #111111;
          font-size: 9.5px;
          line-height: 12px;
        }

        .jobix-t4-certification,
        .jobix-t4-achievement {
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-languages {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 22px;
          font-size: 11px;
          line-height: 12px;
        }

        .jobix-t4-page-number {
          position: absolute;
          right: 25px;
          bottom: 9px;
          font-size: 7px;
          color: #777777;
        }

        .jobix-t4-measure {
          position: fixed;
          left: -10000px;
          top: 0;
          width: 744px;
          visibility: hidden;
          pointer-events: none;
          background: #ffffff;
        }

        @media print {
          .jobix-t4-preview {
            display: block;
          }

          .jobix-t4-page {
            width: 210mm;
            height: 297mm;
            min-height: 297mm;
            padding: 5mm 6.5mm 7mm;
            box-shadow: none;
            page-break-after: always;
            break-after: page;
          }

          .jobix-t4-page:last-child {
            page-break-after: auto;
            break-after: auto;
          }

          .jobix-t4-measure {
            display: none;
          }
        }
      `}</style>

      <div
        ref={measureRef}
        className="jobix-t4-measure"
        aria-hidden="true"
      >
        {blocks.map((block) => (
          <div
            key={block.id}
            data-jobix-t4-block="true"
          >
            {block.content}
          </div>
        ))}
      </div>

      {pages.length > 0 &&
        pages.map((page, pageIndex) => (
          <div
            className="jobix-t4-page"
            key={pageIndex}
          >
            {pageIndex === 0 && (
              <header className="jobix-t4-header">
                <div>
                  <h1 className="jobix-t4-name">
                    {resume.fullName || "Your Name"}
                  </h1>

                  {resume.title && (
                    <div className="jobix-t4-title">
                      {resume.title}
                    </div>
                  )}
                </div>

                <div className="jobix-t4-contact">
                  {contact.map((item, index) => (
                    <span
                      className="jobix-t4-contact-line"
                      key={index}
                    >
                      {item}
                    </span>
                  ))}

                  {links.length > 0 && (
                    <div className="jobix-t4-links">
                      {links.join(" · ")}
                    </div>
                  )}
                </div>
              </header>
            )}

            <div className="jobix-t4-body">
              {page.map((block) => (
                <div key={block.id}>
                  {block.content}
                </div>
              ))}
            </div>

            {pages.length > 1 && (
              <div className="jobix-t4-page-number">
                {pageIndex + 1}
              </div>
            )}
          </div>
        ))}
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

    sessionStorage.removeItem("jobix_resume_builder_data");
    setData(defaultData);
    sessionStorage.setItem(
      "jobix_resume_builder_data",
      JSON.stringify(defaultData)
    );
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
