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
  fullName: "Aarav Mehta",
  title: "Full Stack Developer",
  email: "aarav.mehta@example.com",
  phone: "+91 91234 56789",
  location: "Pune, Maharashtra, India",
  linkedin: "linkedin.com/in/aaravmehta",
  github: "github.com/aaravmehta",
  portfolio: "aaravmehta.dev",
  summary: "Full Stack Developer experienced in building scalable web applications, REST APIs, and data-driven products using modern technologies.",
  experiences: [
    {
      id: "exp-1",
      company: "NovaStack Technologies",
      role: "Software Developer",
      location: "Pune, Maharashtra",
      start: "Jul 2024",
      end: "Present",
      current: true,
      bullets: [
        "Developed scalable full-stack applications using React, TypeScript, Node.js, and PostgreSQL while building reusable components and reliable application workflows.",
        "Designed and implemented REST APIs and backend services for production workflows, authentication, data processing, and integration with frontend applications.",
        "Improved application performance through database optimization, reusable components, efficient API design, and systematic reduction of unnecessary application processing."
      ]
    },
    {
      id: "exp-2",
      company: "BlueOrbit Systems",
      role: "Software Engineering Intern",
      location: "Hyderabad, Telangana",
      start: "Jan 2024",
      end: "Jun 2024",
      current: false,
      bullets: [
        "Built responsive web interfaces and integrated frontend applications with backend APIs while maintaining consistent user experience across desktop and mobile devices.",
        "Created testing workflows, investigated application defects, and delivered reliable fixes while maintaining development quality and release timelines.",
        "Collaborated with engineers, designers, and product stakeholders to deliver application features within sprint timelines and established development requirements."
      ]
    },
    {
      id: "exp-3",
      company: "PixelForge Labs",
      role: "Web Development Intern",
      location: "Remote",
      start: "May 2023",
      end: "Aug 2023",
      current: false,
      bullets: [
        "Implemented reusable UI components for internal applications with consistent layouts, responsive behavior, and maintainable frontend architecture.",
        "Integrated application interfaces with REST services and database workflows to support reliable data retrieval, validation, and user-driven application operations."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Vishwakarma Institute of Technology",
      degree: "Bachelor of Technology",
      field: "Computer Engineering",
      grade: "8.7 CGPA",
      start: "2020",
      end: "2024",
      location: "Pune, Maharashtra"
    },
    {
      id: "edu-2",
      institution: "St. Xavier's Junior College",
      degree: "Higher Secondary Education",
      field: "Science",
      grade: "91%",
      start: "2018",
      end: "2020",
      location: "Pune, Maharashtra"
    }
  ],
  projects: [
    {
      id: "project-1",
      name: "FleetFlow",
      technologies: "React, Node.js, PostgreSQL",
      description: "Built a fleet management platform for tracking vehicles, maintenance schedules, operational activity, and service information through a centralized web interface.",
      contribution: "Designed the frontend architecture, REST API layer, database schema, authentication flow, and core application workflows for the platform.",
      result: "Centralized fleet operations and reduced manual tracking by providing structured workflows for vehicle information, maintenance, and operational monitoring.",
      link: "github.com/aaravmehta/fleetflow"
    },
    {
      id: "project-2",
      name: "MarketLens",
      technologies: "Next.js, Python, FastAPI",
      description: "Built a market analytics dashboard with interactive financial visualizations, structured data views, and responsive workflows for exploring market trends.",
      contribution: "Built the dashboard interface and FastAPI data services for processing application data and presenting interactive analytics through a responsive user experience.",
      result: "Created a responsive workflow for exploring market trends, comparing financial information, and presenting data through clear interactive visualizations.",
      link: "github.com/aaravmehta/marketlens"
    },
    {
      id: "project-3",
      name: "SecureVault",
      technologies: "TypeScript, Express, PostgreSQL",
      description: "Developed a credential management application with authenticated workflows, structured access control, validation, and secure database-backed operations.",
      contribution: "Implemented APIs, database models, request validation, authentication, and access-control workflows to support reliable application operations.",
      result: "Provided structured credential management through organized application workflows, authenticated access, and database-backed record management.",
      link: "github.com/aaravmehta/securevault"
    },
    {
      id: "project-4",
      name: "StudySync",
      technologies: "React, Firebase, Tailwind CSS",
      description: "Collaborative study platform for notes, tasks, and learning resources.",
      contribution: "Developed React components and Firebase workflows.",
      result: "Centralized study activity management.",
      link: "github.com/aaravmehta/studysync"
    },
    {
      id: "project-5",
      name: "TravelMate",
      technologies: "Next.js, Node.js, MongoDB",
      description: "Travel planning application for destinations and itineraries.",
      contribution: "Implemented frontend experience and backend data services.",
      result: "Simplified itinerary planning.",
      link: "github.com/aaravmehta/travelmate"
    },
    {
      id: "project-6",
      name: "PulseMonitor",
      technologies: "React, Python, Redis",
      description: "Application monitoring dashboard for service health and metrics.",
      contribution: "Built monitoring interface and data-processing services.",
      result: "Centralized operational monitoring.",
      link: "github.com/aaravmehta/pulsemonitor"
    }
  ],
  skills: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "Docker",
    "Git"
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      year: "2024",
      credentialId: "AWS-CP-48291",
      link: "aws.amazon.com/certification/"
    },
    {
      id: "cert-2",
      name: "Meta Front-End Developer",
      issuer: "Meta",
      year: "2023",
      credentialId: "META-FE-73152",
      link: "coursera.org/"
    },
    {
      id: "cert-3",
      name: "Python for Data Science",
      issuer: "IBM",
      year: "2023",
      credentialId: "IBM-PDS-29418",
      link: "coursera.org/"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Hackathon Finalist",
      organization: "National Software Hackathon",
      year: "2024",
      description: "Reached the final round of a national-level software development hackathon."
    },
    {
      id: "ach-2",
      title: "Technical Lead",
      organization: "VIT Developer Community",
      year: "2023",
      description: "Led a four-member student team during a product development challenge."
    },
    {
      id: "ach-3",
      title: "Open Source Contributor",
      organization: "Open Source Community",
      year: "2023",
      description: "Contributed bug fixes and documentation improvements to open-source projects."
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
      name: "Hindi",
      level: "Native"
    },
    {
      id: "lang-3",
      name: "Marathi",
      level: "Native"
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
      <span className="mb-1.5 block text-[12px] font-semibold text-[#25314a]">
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
      <span className="mb-1.5 block text-[12px] font-semibold text-[#25314a]">
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
      <h2 className="text-[18px] font-black tracking-[-0.35px] text-[#101828]">
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
          <span className="text-[13px] font-bold text-[#1d2939]">
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

                <div className="jobix-t4-detail">
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
                    <span
  className="jobix-t4-bullet-dot"
  style={{
    display: "block",
    width: "5px",
    height: "5px",
    minWidth: "5px",
    minHeight: "5px",
    marginTop: "4px",
    borderRadius: "50%",
    backgroundColor: "#111111",
    flex: "0 0 5px"
  }}
/>
                    <span>{bullet}</span>
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
                  <div className="jobix-t4-technologies">
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
                    <span
  className="jobix-t4-bullet-dot"
  style={{
    display: "block",
    width: "5px",
    height: "5px",
    minWidth: "5px",
    minHeight: "5px",
    marginTop: "4px",
    borderRadius: "50%",
    backgroundColor: "#111111",
    flex: "0 0 5px"
  }}
/>
                    <span>{bullet}</span>
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

    const firstPageLimit = 1020;
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
          overflow: visible;
        }

        .jobix-t4-page {
          width: 720px;
          height: auto;
          min-height: 1123px;
          box-sizing: border-box;
          position: relative;
          overflow: visible;
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
          font-size: 41px;
          line-height: 42px;
          font-weight: 900;
          letter-spacing: -0.8px;
          color: #111111;
        }

        .jobix-t4-title {
          margin-top: 2px;
          font-size: 12px;
          line-height: 14px;
          font-weight: 700;
          color: #111111;
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
          font-weight: 400;
          color: #303030;
        }

        .jobix-t4-summary {
          margin: 0 0 4px;
          font-size: 11px;
          line-height: 12px;
          font-weight: 400;
          color: #303030;
        }

        .jobix-t4-entry {
          position: relative;
          width: 100%;
          margin-bottom: 4px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .jobix-t4-grid {
          display: block;
          position: relative;
          width: 100%;
        }

        .jobix-t4-entry-text {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          font-size: 11px;
          line-height: 12px;
          font-weight: 400;
        }

        .jobix-t4-right {
          position: absolute;
          top: 0;
          right: 0;
          margin: 0;
          padding: 0;
          text-align: right;
          white-space: nowrap;
          font-size: 10.5px;
          line-height: 12px;
          color: #777777;
          font-style: italic;
          font-weight: 400;
          pointer-events: none;
        }

        .jobix-t4-location {
          margin: 0;
          padding: 0;
          font-size: 10.5px;
          line-height: 12px;
          color: #777777;
          font-style: italic;
          font-weight: 400;
        }

        .jobix-t4-bullets {
          list-style: none;
          width: 100%;
          margin: 2px 0 0;
          padding: 0;
          font-size: 11px;
          line-height: 12px;
          font-weight: 400;
          color: #303030;
          box-sizing: border-box;
        }

        .jobix-t4-bullets li {
          display: flex;
          align-items: flex-start;
          width: 100%;
          margin: 0;
          padding: 0;
          gap: 6px;
          box-sizing: border-box;
          font-weight: 540;
        }

        .jobix-t4-bullet-dot {
          display: block;
          width: 4px;
          height: 4px;
          min-width: 4px;
          margin-top: 4px;
          border-radius: 50%;
          background: #111111;
        }
        .jobix-t4-bullets li > span:last-child {
          font-weight: 540 !important;
          color: #333333 !important;
        }

        .jobix-t4-bullets li {
          font-weight: 540 !important;
        }

        .jobix-t4-strong {
          font-weight: 700;
          color: #111111;
        }

        .jobix-t4-detail {
          font-weight: 400;
          color: #303030;
        }

        .jobix-t4-technologies {
          font-weight: 400;
          color: #303030;
        }

        .jobix-t4-date {
          font-weight: 400;
          color: #777777;
        }

        .jobix-t4-role {
          font-weight: 400;
          color: #202020;
        }

        .jobix-t4-project-name {
          font-size: 11px;
          line-height: 12px;
          font-weight: 700;
          color: #111111;
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
          border: 1px solid #9ea3a8;
          border-radius: 3px;
          background: #ffffff;
          color: #303030;
          font-size: 9.5px;
          line-height: 12px;
          font-weight: 400;
        }

        .jobix-t4-certification,
        .jobix-t4-achievement {
          font-size: 11px;
          line-height: 12px;
          color: #303030;
          font-weight: 400;
        }

        .jobix-t4-languages {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 22px;
          font-size: 11px;
          line-height: 12px;
          color: #303030;
          font-weight: 400;
        }

        .jobix-t4-preview .jobix-t4-name {
          color: #111111 !important;
          font-weight: 900 !important;
        }

        .jobix-t4-preview .jobix-t4-title {
          color: #111111 !important;
          font-weight: 700 !important;
        }

        .jobix-t4-preview .jobix-t4-heading {
          color: #111111 !important;
          font-weight: 800 !important;
        }

        .jobix-t4-preview .jobix-t4-heading span:last-child {
          color: #111111 !important;
          font-weight: 800 !important;
        }

        .jobix-t4-preview .jobix-t4-content {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-summary {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-strong {
          color: #111111 !important;
          font-weight: 700 !important;
        }

        .jobix-t4-preview .jobix-t4-role {
          color: #222222 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-detail {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-date {
          color: #777777 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-location {
          color: #777777 !important;
          font-weight: 400 !important;
          font-style: italic !important;
        }

        .jobix-t4-preview .jobix-t4-right {
          color: #777777 !important;
          font-weight: 400 !important;
          font-style: italic !important;
        }

        .jobix-t4-preview .jobix-t4-bullets {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-bullets li {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-project-name {
          color: #111111 !important;
          font-weight: 700 !important;
        }

        .jobix-t4-preview .jobix-t4-technologies {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-skill {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-certification,
        .jobix-t4-preview .jobix-t4-achievement,
        .jobix-t4-preview .jobix-t4-languages {
          color: #444444 !important;
          font-weight: 400 !important;
        }

        .jobix-t4-preview .jobix-t4-languages strong {
          color: #111111 !important;
          font-weight: 700 !important;
        }


        .jobix-t4-bullets,
        .jobix-t4-bullets li,
        .jobix-t4-bullets li > span:last-child {
          font-weight: 540 !important;
          color: #303030 !important;
          -webkit-text-stroke: 0.12px #303030;
        }

        .jobix-t4-content {
          font-weight: 520 !important;
          color: #303030 !important;
          -webkit-text-stroke: 0.08px #303030;
        }

        .jobix-t4-detail {
          font-weight: 520 !important;
          color: #303030 !important;
          -webkit-text-stroke: 0.08px #303030;
        }

        .jobix-t4-role {
          font-weight: 570 !important;
          color: #202020 !important;
        }

        .jobix-t4-strong,
        .jobix-t4-project-name {
          font-weight: 700 !important;
          color: #111111 !important;
          -webkit-text-stroke: 0.1px #111111;
        }

        .jobix-t4-heading {
          font-weight: 800 !important;
          color: #111111 !important;
        }

        .jobix-t4-right,
        .jobix-t4-location,
        .jobix-t4-date {
          font-weight: 400 !important;
          color: #777777 !important;
          -webkit-text-stroke: 0;
        }


        .jobix-builder-ui {
          --jb-text: #172033;
          --jb-muted: #667085;
          --jb-border: #dfe5ed;
          --jb-soft: #f7f9fc;
          --jb-blue: #2563eb;
          --jb-green: #12b76a;
        }

        .jobix-builder-ui > header {
          height: 68px !important;
          min-height: 68px !important;
          background: #ffffff !important;
          border-bottom: 1px solid var(--jb-border) !important;
          box-shadow: 0 1px 3px rgba(16,24,40,.03) !important;
        }

        .jobix-builder-ui > header > div {
          height: 68px !important;
          padding: 0 22px !important;
        }

        .jobix-builder-ui > header h1 {
          font-size: 19px !important;
          line-height: 23px !important;
          font-weight: 850 !important;
          letter-spacing: -.4px !important;
          color: var(--jb-text) !important;
        }

        .jobix-builder-ui > header p {
          font-size: 12px !important;
          color: var(--jb-muted) !important;
        }

        .jobix-builder-ui > header button {
          min-height: 40px !important;
          border-radius: 9px !important;
          font-size: 12px !important;
          font-weight: 750 !important;
        }

        .jobix-builder-ui > header button:last-child {
          background: #111827 !important;
          color: #ffffff !important;
          border-color: #111827 !important;
        }

        .jobix-builder-layout {
          background: #f3f6fa !important;
        }

        .jobix-builder-ui aside {
          background: #ffffff !important;
          border-right: 1px solid var(--jb-border) !important;
          box-shadow: 2px 0 8px rgba(16,24,40,.025) !important;
        }

        .jobix-builder-ui aside > div:first-child {
          padding: 20px 18px !important;
        }

        .jobix-builder-ui aside h2 {
          color: var(--jb-text) !important;
          font-weight: 850 !important;
          letter-spacing: -.25px !important;
        }

        .jobix-builder-ui aside p {
          color: var(--jb-muted) !important;
        }

        .jobix-builder-ui aside input,
        .jobix-builder-ui aside textarea,
        .jobix-builder-ui aside select {
          border: 1px solid #d8dee8 !important;
          background: #ffffff !important;
          border-radius: 9px !important;
          color: #172033 !important;
          box-shadow: none !important;
        }

        .jobix-builder-ui aside input:hover,
        .jobix-builder-ui aside textarea:hover,
        .jobix-builder-ui aside select:hover {
          border-color: #b9c2cf !important;
        }

        .jobix-builder-ui aside input:focus,
        .jobix-builder-ui aside textarea:focus,
        .jobix-builder-ui aside select:focus {
          border-color: #98a2b3 !important;
          outline: none !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,.07) !important;
        }

        .jobix-builder-ui aside label > span {
          color: #344054 !important;
          font-weight: 700 !important;
        }

        .jobix-builder-ui aside button {
          border-radius: 9px !important;
        }

        .jobix-builder-ui aside [class*="rounded-xl"] {
          border-color: #e2e7ee !important;
          border-radius: 12px !important;
          background: #fbfcfe !important;
        }

        .jobix-builder-ui aside [class*="bg-[#111827]"] {
          background: #111827 !important;
        }

        .jobix-builder-ui aside [class*="bg-[#111827]"] span {
          color: #ffffff !important;
        }

        .jobix-builder-ui aside [class*="border-[#111827]"] {
          border-color: #d8dee8 !important;
        }

        .jobix-builder-ui .jobix-builder-tabs {
          background: #ffffff !important;
          border-top: 1px solid #edf0f4 !important;
          border-bottom: 1px solid #edf0f4 !important;
          padding: 10px 14px !important;
        }

        .jobix-builder-ui .jobix-builder-tabs button {
          height: 38px !important;
          padding: 0 15px !important;
          border-radius: 9px !important;
          color: #667085 !important;
          font-size: 12px !important;
          font-weight: 700 !important;
        }

        .jobix-builder-ui .jobix-builder-tabs button:hover {
          background: #f5f7fa !important;
          color: #344054 !important;
        }

        .jobix-builder-ui .jobix-builder-tabs button.bg-\[\#111827\],
        .jobix-builder-ui .jobix-builder-tabs button[class*="bg-[#111827]"] {
          background: #111827 !important;
          color: #ffffff !important;
        }

        .jobix-builder-ui .jobix-preview-zone {
          background: #eef2f6 !important;
        }

        .jobix-builder-ui .jobix-preview-toolbar {
          height: 54px !important;
          background: #ffffff !important;
          border: 1px solid #dfe5ed !important;
          border-radius: 10px !important;
          box-shadow: 0 2px 7px rgba(16,24,40,.04) !important;
        }

        .jobix-builder-ui .jobix-preview-toolbar button {
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 700 !important;
        }

        .jobix-builder-ui .jobix-preview-toolbar button:hover {
          background: #f5f7fa !important;
        }

        .jobix-builder-ui .jobix-progress-card {
          border: 1px solid #dfe5ed !important;
          border-radius: 12px !important;
          background: #ffffff !important;
          box-shadow: 0 2px 8px rgba(16,24,40,.03) !important;
        }

        .jobix-builder-ui .jobix-progress-ring {
          border: 7px solid #e8edf3 !important;
          border-top-color: var(--jb-green) !important;
          border-right-color: var(--jb-green) !important;
        }

        .jobix-builder-ui .jobix-progress-bar {
          height: 6px !important;
          border-radius: 999px !important;
          background: #e8edf3 !important;
          overflow: hidden !important;
        }

        .jobix-builder-ui .jobix-progress-fill {
          height: 100% !important;
          border-radius: 999px !important;
          background: var(--jb-green) !important;
        }

        @media (max-width: 1200px) {
          .jobix-builder-layout {
            grid-template-columns: 525px minmax(0,1fr) !important;
          }
        }

        @media (max-width: 900px) {
          .jobix-builder-layout {
            grid-template-columns: 1fr !important;
          }

          .jobix-builder-ui aside {
            border-right: 0 !important;
            border-bottom: 1px solid var(--jb-border) !important;
          }
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
          width: 670px;
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
      
        .jb-workspace {
          grid-template-columns: 525px minmax(0, 1fr) !important;
          height: calc(100vh - 72px) !important;
        }

        .jb-sidebar {
          display: flex !important;
          flex-direction: column !important;
          min-height: 0 !important;
          background: #ffffff !important;
        }

        .jb-progress {
          padding: 22px 22px 20px !important;
          flex: 0 0 auto !important;
        }

        .jb-editor-body {
          display: grid !important;
          grid-template-columns: 175px minmax(0, 1fr) !important;
          flex: 1 1 auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
          border-top: 1px solid #edf0f4 !important;
        }


        .jb-section-sidebar {
          position: relative !important;
          height: 100% !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          padding: 20px 12px !important;
          background: #f7f9fc !important;
          border-right: 1px solid #dfe5ed !important;
        }

        .jb-section-sidebar-title {
          padding: 0 10px 14px !important;
          color: #667085 !important;
          font-size: 9px !important;
          line-height: 13px !important;
          font-weight: 900 !important;
          letter-spacing: .1em !important;
          text-transform: uppercase !important;
        }

        .jb-section-list {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .jb-section-item {
          position: relative !important;
          width: 100% !important;
          min-height: 49px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 0 11px !important;
          border: 1px solid transparent !important;
          border-radius: 10px !important;
          background: transparent !important;
          color: #475467 !important;
          text-align: left !important;
          cursor: pointer !important;
          transition: all .16s ease !important;
        }

        .jb-section-item:hover {
          background: #eaf2ff !important;
          border-color: #d5e5ff !important;
          color: #175cd3 !important;
          transform: translateX(2px) !important;
        }

        .jb-section-item-active {
          background: #111827 !important;
          border-color: #111827 !important;
          color: #ffffff !important;
          box-shadow: 0 6px 14px rgba(16,24,40,.16) !important;
          transform: translateX(2px) !important;
        }

        .jb-section-number {
          width: 29px !important;
          height: 29px !important;
          flex: 0 0 29px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: #e7ecf3 !important;
          color: #667085 !important;
          font-size: 9px !important;
          font-weight: 900 !important;
        }

        .jb-section-item-active .jb-section-number {
          background: #ffffff !important;
          color: #111827 !important;
        }

        .jb-section-label {
          flex: 1 !important;
          min-width: 0 !important;
          font-size: 11px !important;
          line-height: 15px !important;
          font-weight: 800 !important;
          white-space: nowrap !important;
        }

        .jb-section-current {
          width: 8px !important;
          height: 8px !important;
          flex: 0 0 8px !important;
          border-radius: 50% !important;
          background: #12b76a !important;
          box-shadow: 0 0 0 3px rgba(18,183,106,.13) !important;
        }

        .jb-form {
          min-width: 0 !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          padding: 30px 30px 34px !important;
          background: #ffffff !important;
        }

        .jb-section-heading {
          margin-bottom: 23px !important;
          padding-bottom: 17px !important;
          border-bottom: 1px solid #edf0f4 !important;
        }

        .jb-section-title {
          color: #172033 !important;
          font-size: 21px !important;
          line-height: 27px !important;
          font-weight: 850 !important;
          letter-spacing: -.45px !important;
        }

        .jb-section-description {
          margin-top: 5px !important;
          color: #7a8494 !important;
          font-size: 11px !important;
          line-height: 17px !important;
        }

        .jb-label {
          color: #344054 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
        }

        .jb-input,
        .jb-textarea {
          border-color: #d9e1eb !important;
          border-radius: 9px !important;
          background: #ffffff !important;
          color: #172033 !important;
          font-size: 12px !important;
        }

        .jb-input {
          height: 42px !important;
        }

        .jb-input:focus,
        .jb-textarea:focus {
          border-color: #6b9eea !important;
          box-shadow: 0 0 0 3px rgba(37,99,235,.08) !important;
        }

        .jb-card {
          border-color: #e1e7ef !important;
          border-radius: 11px !important;
          background: #fbfcfe !important;
          box-shadow: 0 1px 2px rgba(16,24,40,.02) !important;
        }

        .jb-card:hover {
          border-color: #cfd8e5 !important;
        }

        .jb-number {
          background: #eaf2ff !important;
          color: #1769dc !important;
        }

        .jb-next-area {
          margin-top: 30px !important;
          padding-top: 20px !important;
          border-top: 1px solid #edf0f4 !important;
        }

        .jb-next-button {
          width: 100% !important;
          height: 48px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding: 0 17px 0 20px !important;
          border: 0 !important;
          border-radius: 9px !important;
          background: #1769dc !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 850 !important;
          cursor: pointer !important;
          box-shadow: 0 7px 16px rgba(37,99,235,.16) !important;
          transition: all .16s ease !important;
        }

        .jb-next-button:hover {
          background: #125ac0 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 9px 19px rgba(37,99,235,.21) !important;
        }

        .jb-next-arrow {
          width: 29px !important;
          height: 29px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.15) !important;
          font-size: 18px !important;
          line-height: 1 !important;
        }

        .jb-next-hint {
          margin-top: 9px !important;
          text-align: center !important;
          color: #98a2b3 !important;
          font-size: 10px !important;
          line-height: 15px !important;
        }

        .jb-preview {
          min-width: 0 !important;
          overflow: auto !important;
          background: #eef2f6 !important;
        }

        .jb-preview-inner {
          min-height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
          padding: 38px 45px 70px !important;
        }

        .jb-preview-a4-area {
          width: 100% !important;
          min-height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
        }

        .jb-resume-wrap {
          flex: 0 0 auto !important;
          filter: drop-shadow(0 12px 30px rgba(16,24,40,.13)) !important;
          transform-origin: top center !important;
        }

        .jb-preview-toolbar {
          position: sticky !important;
          top: 14px !important;
          z-index: 30 !important;
          width: min(100%, 430px) !important;
          min-height: 46px !important;
          margin: 0 auto 18px !important;
          padding: 6px 8px 6px 14px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 14px !important;
          border: 1px solid #d8dee8 !important;
          border-radius: 10px !important;
          background: #ffffff !important;
          box-shadow: 0 6px 18px rgba(16,24,40,.08) !important;
        }

        .jb-preview-toolbar-label {
          color: #344054 !important;
          font-size: 10px !important;
          font-weight: 800 !important;
        }

        .jb-zoom-controls {
          display: flex !important;
          align-items: center !important;
          gap: 5px !important;
        }

        .jb-zoom-button {
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;
          border: 1px solid #cfd6e1 !important;
          border-radius: 7px !important;
          background: #ffffff !important;
          color: #101828 !important;
          font-size: 20px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          cursor: pointer !important;
        }

        .jb-zoom-button:hover {
          border-color: #1769dc !important;
          background: #f0f6ff !important;
          color: #1769dc !important;
        }

        .jb-zoom-value {
          min-width: 58px !important;
          height: 32px !important;
          padding: 0 8px !important;
          border: 1px solid #cfd6e1 !important;
          border-radius: 7px !important;
          background: #f8fafc !important;
          color: #172033 !important;
          font-size: 10px !important;
          font-weight: 850 !important;
          cursor: pointer !important;
        }

        .jb-zoom-reset {
          height: 32px !important;
          padding: 0 11px !important;
          border: 0 !important;
          border-radius: 7px !important;
          background: #111827 !important;
          color: #ffffff !important;
          font-size: 9px !important;
          font-weight: 800 !important;
          cursor: pointer !important;
        }

        .jb-zoom-reset:hover {
          background: #263142 !important;
        }

        .jb-resume-wrap {
          flex: 0 0 auto;
          filter: drop-shadow(0 12px 30px rgba(16,24,40,.13));
        }

        @media (max-width: 1100px) {
          .jb-workspace {
            grid-template-columns: 340px minmax(0,1fr);
          }

          .jb-preview-inner {
            padding: 30px 25px 60px;
          }
        }

        @media (max-width: 800px) {
          .jb-topbar {
            padding: 0 14px;
          }

          .jb-live {
            display: none;
          }

          .jb-workspace {
            height: auto;
            display: block;
          }

          .jb-sidebar {
            max-height: 600px;
            border-right: 0;
            border-bottom: 1px solid #e1e6ed;
          }

          .jb-preview {
            min-height: 900px;
          }
        }
      

        .jobix-t4-bullet-dot {
          display: block !important;
          width: 5px !important;
          height: 5px !important;
          min-width: 5px !important;
          min-height: 5px !important;
          flex: 0 0 5px !important;
          margin-top: 4px !important;
          border-radius: 50% !important;
          background: #111111 !important;
          background-color: #111111 !important;
          opacity: 1 !important;
          visibility: visible !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @media print {
          .jobix-t4-bullet-dot {
            background: #111111 !important;
            background-color: #111111 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
  const [previewZoom, setPreviewZoom] = useState(106);
  const [saved, setSaved] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [data, setData] = useState<ResumeData>(defaultData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedTemplate = params.get("template") || "4";
    const selectedMode =
      params.get("mode") === "existing" ? "existing" : "scratch";
    const isPreview = params.get("preview") === "1";

    setTemplate(selectedTemplate);
    setMode(selectedMode);
    setPreviewOnly(isPreview);

    if (isPreview) {
      const storedData = sessionStorage.getItem(
        "jobix_resume_builder_data"
      );

      if (storedData) {
        try {
          setData(JSON.parse(storedData));
        } catch {
          setData(defaultData);
        }
      }

      return;
    }

    const storedData = sessionStorage.getItem(
      "jobix_resume_builder_data"
    );
    const storedTemplate = sessionStorage.getItem(
      "jobix_resume_builder_template"
    );

    if (storedData) {
      try {
        setData(JSON.parse(storedData));
        if (storedTemplate) {
          setTemplate(storedTemplate);
        }
        return;
      } catch {
        sessionStorage.removeItem("jobix_resume_builder_data");
      }
    }

    setData(defaultData);
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
      data.location,
      data.summary,
      data.education.length > 0,
      data.experiences.length > 0,
      data.projects.length > 0,
      data.skills.length > 0,
      data.certifications.length > 0,
      data.achievements.length > 0,
      data.languages.length > 0,
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [data]);

  const sections = [
    ["contacts", "Contact"],
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
    if (completion < 100) {
      setSaved(false);
      return;
    }

    sessionStorage.setItem(
      "jobix_resume_builder_data",
      JSON.stringify(data)
    );

    sessionStorage.setItem(
      "jobix_resume_builder_template",
      template
    );

    setSaved(true);

    router.push(
      `/resume-builder/preview?template=${template}&mode=${mode}`
    );
  };

  const nextSection = () => {
    const currentIndex = sections.findIndex(
      ([id]) => id === activeSection
    );

    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1][0]);
    }
  };

  const updateExperience = (
    id: string,
    changes: Partial<Experience>
  ) => {
    update(
      "experiences",
      data.experiences.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  const updateEducation = (
    id: string,
    changes: Partial<Education>
  ) => {
    update(
      "education",
      data.education.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  const updateProject = (
    id: string,
    changes: Partial<Project>
  ) => {
    update(
      "projects",
      data.projects.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  const updateCertification = (
    id: string,
    changes: Partial<Certification>
  ) => {
    update(
      "certifications",
      data.certifications.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  const updateAchievement = (
    id: string,
    changes: Partial<Achievement>
  ) => {
    update(
      "achievements",
      data.achievements.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  const updateLanguage = (
    id: string,
    changes: Partial<Language>
  ) => {
    update(
      "languages",
      data.languages.map((item) =>
        item.id === id ? { ...item, ...changes } : item
      )
    );
  };

  if (previewOnly) {
    return (
      <main
        style={{
          minHeight: "100vh",
          margin: 0,
          padding: "24px",
          background: "#eef2f6",
          overflow: "auto"
        }}
      >
        {template === "4" ? (
          <Template4Preview data={data} />
        ) : (
          <GenericPreview
            data={data}
            template={template}
          />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] text-[#172033]">
      <style>{`
        .jb-shell {
          min-height: 100vh;
          background: #f4f6f9;
        }

        .jb-topbar {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          background: #ffffff;
          border-bottom: 1px solid #e4e8ee;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .jb-brand-title {
          font-size: 20px;
          line-height: 24px;
          font-weight: 850;
          letter-spacing: -0.5px;
          color: #111827;
        }

        .jb-brand-subtitle {
          margin-top: 3px;
          font-size: 12px;
          color: #7a8494;
        }

        .jb-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .jb-live {
          height: 38px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 13px;
          border-radius: 9px;
          background: #f4f6f8;
          color: #344054;
          font-size: 12px;
          font-weight: 750;
        }

        .jb-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #12b76a;
        }

        .jb-action {
          height: 40px;
          padding: 0 17px;
          border-radius: 9px;
          border: 1px solid #d5dae2;
          background: #ffffff;
          color: #344054;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .jb-action:hover {
          background: #f8fafc;
        }

        .jb-save {
          border-color: #111827;
          background: #111827;
          color: #ffffff;
        }

        .jb-save:hover {
          background: #000000;
        }


        /* JOBIX LOCKED EDITOR UI */

        .jb-workspace {
          display: grid !important;
          grid-template-columns: 525px minmax(0, 1fr) !important;
          width: 100% !important;
          height: calc(100vh - 64px) !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }

        .jb-sidebar {
          width: 525px !important;
          min-width: 525px !important;
          height: 100% !important;
          min-height: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          background: #ffffff !important;
          border-right: 1px solid #dfe5ed !important;
        }

        .jb-progress {
          width: 100% !important;
          flex: 0 0 auto !important;
          box-sizing: border-box !important;
        }

        .jb-editor-body {
          display: grid !important;
          grid-template-columns: 175px minmax(0, 1fr) !important;
          width: 100% !important;
          flex: 1 1 auto !important;
          min-height: 0 !important;
          overflow: hidden !important;
        }

        .jb-section-sidebar {
          width: 175px !important;
          min-width: 175px !important;
          height: 100% !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          box-sizing: border-box !important;
        }

        .jb-form {
          width: auto !important;
          min-width: 0 !important;
          height: 100% !important;
          min-height: 0 !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          box-sizing: border-box !important;
          padding: 30px 28px 40px !important;
        }

        .jb-preview {
          display: block !important;
          width: auto !important;
          min-width: 0 !important;
          height: 100% !important;
          min-height: 0 !important;
          overflow: auto !important;
          box-sizing: border-box !important;
          background: #eef2f6 !important;
        }

        .jb-preview-inner {
          position: relative !important;
          width: 100% !important;
          min-height: 100% !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding: 28px 36px 70px !important;
        }

        .jb-preview-toolbar {
          position: sticky !important;
          top: 10px !important;
          z-index: 50 !important;
          flex: 0 0 auto !important;
          width: 430px !important;
          max-width: calc(100% - 20px) !important;
          margin: 0 auto 18px !important;
          box-sizing: border-box !important;
        }

        .jb-resume-wrap {
          position: relative !important;
          flex: 0 0 auto !important;
          width: 794px !important;
          min-width: 794px !important;
          box-sizing: border-box !important;
          transform-origin: top center !important;
          filter: drop-shadow(0 12px 30px rgba(16,24,40,.13)) !important;
        }

        .jb-next-area {
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .jb-next-button {
          position: relative !important;
          width: 100% !important;
        }

        @media (max-width: 1100px) {
          .jb-workspace {
            grid-template-columns: 490px minmax(0, 1fr) !important;
          }

          .jb-sidebar {
            width: 490px !important;
            min-width: 490px !important;
          }
        }

        @media (max-width: 850px) {
          .jb-workspace {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
          }

          .jb-sidebar {
            width: 100% !important;
            min-width: 0 !important;
            height: auto !important;
          }

          .jb-editor-body {
            grid-template-columns: 175px minmax(0, 1fr) !important;
            min-height: 650px !important;
          }

          .jb-preview {
            height: auto !important;
            min-height: 900px !important;
          }
        }


        .jb-sidebar .jb-progress-row {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          width: 100% !important;
        }

        .jb-sidebar .jb-percent {
          min-width: 52px !important;
          color: #1769dc !important;
          font-size: 22px !important;
          line-height: 26px !important;
          font-weight: 900 !important;
          text-align: right !important;
          font-variant-numeric: tabular-nums !important;
        }

        .jb-sidebar .jb-percent-label {
          margin-top: 2px !important;
          color: #98a2b3 !important;
          font-size: 9px !important;
          line-height: 12px !important;
          font-weight: 800 !important;
          text-align: right !important;
          text-transform: uppercase !important;
          letter-spacing: .06em !important;
        }

        .jb-sidebar .jb-progress-track {
          width: 100% !important;
          height: 7px !important;
          margin-top: 15px !important;
          overflow: hidden !important;
          border-radius: 999px !important;
          background: #e8edf3 !important;
        }

        .jb-sidebar .jb-progress-fill {
          height: 100% !important;
          border-radius: 999px !important;
          background: #1769dc !important;
          transition: width .3s ease !important;
        }

        .jb-form .jb-fields {
          display: flex !important;
          flex-direction: column !important;
          gap: 18px !important;
          width: 100% !important;
        }

        .jb-form .jb-field {
          display: block !important;
          width: 100% !important;
          min-width: 0 !important;
        }

        .jb-form .jb-label {
          display: block !important;
          width: 100% !important;
          margin-bottom: 8px !important;
          color: #344054 !important;
          font-size: 11px !important;
          line-height: 15px !important;
          font-weight: 800 !important;
        }

        .jb-form .jb-input,
        .jb-form .jb-textarea {
          display: block !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .jb-form .jb-input {
          height: 44px !important;
          padding: 0 13px !important;
          border: 1px solid #d9e1eb !important;
          border-radius: 9px !important;
          background: #ffffff !important;
          color: #172033 !important;
          font-size: 12px !important;
          line-height: normal !important;
        }

        .jb-form .jb-input:focus,
        .jb-form .jb-textarea:focus {
          outline: none !important;
          border-color: #1769dc !important;
          box-shadow: 0 0 0 3px rgba(23,105,220,.08) !important;
        }

        .jb-form .jb-two {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
          gap: 18px !important;
          width: 100% !important;
        }

        .jb-form .jb-two .jb-field {
          min-width: 0 !important;
        }

        @media (max-width: 620px) {
          .jb-form .jb-two {
            grid-template-columns: 1fr !important;
          }
        }


        .jb-preview {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          min-width: 0 !important;
          min-height: 0 !important;
          overflow: auto !important;
          box-sizing: border-box !important;
          background: #eef2f6 !important;
        }

        .jb-preview-inner {
          width: 100% !important;
          min-height: 100% !important;
          box-sizing: border-box !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          padding: 18px 20px 35px !important;
        }

        .jb-preview-toolbar {
          position: sticky !important;
          top: 8px !important;
          z-index: 50 !important;
          flex: 0 0 auto !important;
          width: min(430px, calc(100% - 10px)) !important;
          min-height: 46px !important;
          margin: 0 auto 14px !important;
          box-sizing: border-box !important;
        }

        .jb-preview-a4-area {
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
          box-sizing: border-box !important;
        }

        .jb-resume-wrap {
          flex: 0 0 auto !important;
          width: 794px !important;
          min-width: 794px !important;
          box-sizing: border-box !important;
          transform-origin: top center !important;
          filter: drop-shadow(0 10px 24px rgba(16,24,40,.14)) !important;
        }

        @media (max-width: 900px) {
          .jb-preview-inner {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }


        .jb-brand-block {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .jb-brand-row {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }

        .jb-brand-logo {
          width: 30px !important;
          height: 30px !important;
          object-fit: contain !important;
          display: block !important;
        }

        .jb-brand-title {
          font-size: 21px !important;
          line-height: 25px !important;
          font-weight: 900 !important;
          letter-spacing: -0.55px !important;
          color: #111827 !important;
        }

        .jb-brand-subtitle {
          margin-top: 4px !important;
          margin-left: 40px !important;
          font-size: 11px !important;
          line-height: 15px !important;
          color: #7a8494 !important;
          font-weight: 600 !important;
        }


        .jb-brand-row {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }

        .jb-brand-logo {
          width: 38px !important;
          height: 38px !important;
          object-fit: contain !important;
          display: block !important;
          flex: 0 0 38px !important;
        }

        .jb-brand-title {
          font-size: 22px !important;
          line-height: 27px !important;
          font-weight: 900 !important;
          letter-spacing: -0.55px !important;
          color: #111827 !important;
        }

        .jb-brand-subtitle {
          margin-top: 4px !important;
          margin-left: 50px !important;
          font-size: 11px !important;
          line-height: 15px !important;
          color: #7a8494 !important;
          font-weight: 600 !important;
        }

        .jb-next-arrow {
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.16) !important;
          color: #ffffff !important;
          font-size: 21px !important;
          line-height: 1 !important;
          font-weight: 700 !important;
        }


        .jb-brand-row {
          display: flex !important;
          align-items: center !important;
          gap: 14px !important;
        }

        .jb-brand-logo {
          width: 52px !important;
          height: 52px !important;
          min-width: 52px !important;
          min-height: 52px !important;
          object-fit: contain !important;
          display: block !important;
          flex: 0 0 52px !important;
        }

        .jb-brand-title {
          font-size: 28px !important;
          line-height: 32px !important;
          font-weight: 900 !important;
          letter-spacing: -0.8px !important;
          color: #101828 !important;
        }

        .jb-brand-subtitle {
          margin-top: 5px !important;
          margin-left: 66px !important;
          font-size: 12px !important;
          line-height: 16px !important;
          color: #667085 !important;
          font-weight: 600 !important;
        }

        .jb-next-arrow {
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          min-height: 42px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.18) !important;
          color: #ffffff !important;
          font-size: 28px !important;
          line-height: 1 !important;
          font-weight: 500 !important;
        }


        .jb-brand-row {
          display: flex !important;
          align-items: center !important;
          gap: 14px !important;
        }

        .jb-brand-logo {
          width: 52px !important;
          height: 52px !important;
          min-width: 52px !important;
          min-height: 52px !important;
          object-fit: contain !important;
          display: block !important;
          flex: 0 0 52px !important;
        }

        .jb-brand-title {
          font-size: 28px !important;
          line-height: 32px !important;
          font-weight: 900 !important;
          letter-spacing: -0.8px !important;
          color: #101828 !important;
        }

        .jb-brand-subtitle {
          margin-top: 5px !important;
          margin-left: 66px !important;
          font-size: 12px !important;
          line-height: 16px !important;
          color: #667085 !important;
          font-weight: 600 !important;
        }

        .jb-next-arrow {
          width: 42px !important;
          height: 42px !important;
          min-width: 42px !important;
          min-height: 42px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.18) !important;
          color: #ffffff !important;
          font-size: 28px !important;
          line-height: 1 !important;
          font-weight: 500 !important;
        }


        .jb-brand-block {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .jb-brand-row {
          display: flex !important;
          align-items: center !important;
          gap: 16px !important;
        }

        .jb-brand-logo-large {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          object-fit: contain !important;
          display: block !important;
          flex: 0 0 56px !important;
        }

        .jb-brand-title {
          font-size: 28px !important;
          line-height: 34px !important;
          font-weight: 900 !important;
          letter-spacing: -0.8px !important;
          color: #101828 !important;
        }

        .jb-brand-subtitle {
          margin-top: 5px !important;
          margin-left: 72px !important;
          font-size: 12px !important;
          line-height: 16px !important;
          color: #667085 !important;
          font-weight: 600 !important;
        }

        .jb-next-arrow {
          width: 46px !important;
          height: 46px !important;
          min-width: 46px !important;
          min-height: 46px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.18) !important;
          color: #ffffff !important;
          font-size: 30px !important;
          line-height: 1 !important;
          font-weight: 500 !important;
          font-family: Arial, sans-serif !important;
        }

        .jb-next-button {
          min-height: 60px !important;
          border-radius: 12px !important;
          padding: 8px 14px 8px 24px !important;
        }

        .jb-next-button > span:first-child {
          font-size: 16px !important;
          font-weight: 850 !important;
        }


        .jb-brand-block {
          width: 100% !important;
          min-height: 68px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 0 !important;
          white-space: nowrap !important;
        }

        .jb-brand-logo-large {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          margin-right: 18px !important;
          object-fit: contain !important;
          display: block !important;
          flex: 0 0 56px !important;
        }

        .jb-brand-title {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 28px !important;
          line-height: 34px !important;
          font-weight: 900 !important;
          letter-spacing: -0.8px !important;
          color: #101828 !important;
          white-space: nowrap !important;
        }

        .jb-brand-divider {
          width: 2px !important;
          height: 36px !important;
          margin: 0 20px !important;
          background: #cbd5e1 !important;
          flex: 0 0 2px !important;
        }

        .jb-brand-subtitle {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 16px !important;
          line-height: 22px !important;
          color: #667085 !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
        }

        @media (max-width: 850px) {
          .jb-brand-logo-large {
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
            min-height: 48px !important;
            flex-basis: 48px !important;
            margin-right: 12px !important;
          }

          .jb-brand-title {
            font-size: 23px !important;
            line-height: 28px !important;
          }

          .jb-brand-divider {
            margin: 0 12px !important;
          }

          .jb-brand-subtitle {
            font-size: 13px !important;
          }
        }


        .jb-brand-block {
          width: 100%;
          min-height: 72px;
          display: flex;
          flex-direction: row;
          align-items: center;
          white-space: nowrap;
        }

        .jb-brand-logo-large {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          object-fit: contain !important;
          display: block !important;
          flex: 0 0 56px !important;
          margin-right: 18px !important;
        }

        .jb-brand-title {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 28px !important;
          line-height: 34px !important;
          font-weight: 900 !important;
          letter-spacing: -0.8px !important;
          color: #101828 !important;
          white-space: nowrap !important;
        }

        .jb-brand-divider {
          width: 2px !important;
          height: 34px !important;
          margin: 0 20px !important;
          background: #cbd5e1 !important;
          flex: 0 0 2px !important;
        }

        .jb-brand-subtitle {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 16px !important;
          line-height: 22px !important;
          color: #667085 !important;
          font-weight: 600 !important;
          white-space: nowrap !important;
        }

        .jb-next-arrow {
          width: 46px !important;
          height: 46px !important;
          min-width: 46px !important;
          min-height: 46px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          background: rgba(255,255,255,.18) !important;
          color: #ffffff !important;
          font-size: 29px !important;
          line-height: 1 !important;
          font-family: Arial, sans-serif !important;
          font-weight: 400 !important;
        }


        .jb-brand-block {
          display: flex !important;
          align-items: center !important;
          width: 100% !important;
          min-height: 72px !important;
          white-space: nowrap !important;
        }

        .jb-brand-logo-large {
          width: 56px !important;
          height: 56px !important;
          min-width: 56px !important;
          min-height: 56px !important;
          margin-right: 18px !important;
          object-fit: contain !important;
          display: block !important;
        }

        .jb-brand-title {
          margin: 0 !important;
          padding: 0 !important;
          color: #101828 !important;
          font-size: 28px !important;
          line-height: 34px !important;
          font-weight: 900 !important;
          letter-spacing: -0.8px !important;
          white-space: nowrap !important;
        }

        .jb-card-title .jb-number {
          display: none !important;
        }

`}</style>

<style>{`
        .jb-editor-body {
          display: grid;
          grid-template-columns: 156px minmax(0, 1fr);
          min-height: calc(100vh - 260px);
          border-top: 1px solid #edf0f4;
        }

        .jb-section-sidebar {
          position: sticky;
          top: 0;
          height: calc(100vh - 260px);
          overflow-y: auto;
          padding: 18px 10px;
          background: #f8fafc;
          border-right: 1px solid #e4e8ee;
        }

        .jb-section-sidebar-title {
          padding: 0 8px 12px;
          color: #98a2b3;
          font-size: 9px;
          line-height: 13px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .jb-section-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .jb-section-item {
          position: relative;
          width: 100%;
          min-height: 42px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 8px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          text-align: left;
          cursor: pointer;
          transition: background .15s ease, color .15s ease;
        }

        .jb-section-item:hover {
          background: #eef2f6;
          color: #344054;
        }

        .jb-section-item-active {
          background: #111827 !important;
          color: #ffffff !important;
        }

        .jb-section-number {
          width: 22px;
          flex: 0 0 22px;
          font-size: 9px;
          font-weight: 750;
          color: #98a2b3;
        }

        .jb-section-item-active .jb-section-number {
          color: #d0d5dd;
        }

        .jb-section-label {
          flex: 1;
          font-size: 10px;
          line-height: 14px;
          font-weight: 750;
        }

        .jb-section-current {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #12b76a;
        }

        .jb-form {
          min-width: 0;
          overflow-y: auto;
          padding: 28px 22px 50px;
          background: #ffffff;
        }

        .jb-preview {
          min-width: 0;
          overflow: auto;
          background: #eef2f6;
        }

        .jb-preview-inner {
          min-height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 38px 44px 70px;
        }

        .jb-resume-wrap {
          flex: 0 0 auto;
          filter: drop-shadow(0 12px 30px rgba(16,24,40,.13));
        }

        @media (max-width: 1250px) {
          .jb-workspace {
            grid-template-columns: 360px minmax(0,1fr);
          }

          .jb-editor-body {
            grid-template-columns: 145px minmax(0,1fr);
          }

          .jb-preview-inner {
            padding: 30px 24px 60px;
          }
        }

        @media (max-width: 950px) {
          .jb-workspace {
            grid-template-columns: 1fr;
            height: auto;
          }

          .jb-sidebar {
            border-right: 0;
            border-bottom: 1px solid #e1e6ed;
          }

          .jb-editor-body {
            grid-template-columns: 180px minmax(0,1fr);
          }

          .jb-section-sidebar {
            height: auto;
            max-height: 520px;
          }

          .jb-preview {
            min-height: 900px;
          }
        }

        @media (max-width: 650px) {
          .jb-editor-body {
            display: block;
          }

          .jb-section-sidebar {
            position: static;
            height: auto;
            max-height: none;
            border-right: 0;
            border-bottom: 1px solid #e4e8ee;
          }

          .jb-section-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0,1fr));
          }

          .jb-form {
            padding: 24px 16px 40px;
          }
        }
`}
</style>

      <div className="jb-shell">
        <header className="jb-topbar">
          <div className="jb-brand-block">
            <img
              src="/jobix-logo.png"
              alt="JOBIX"
              className="jb-brand-logo-large"
            />

            <div className="jb-brand-title">
              Resume Builder
            </div>
          </div>

          <div className="jb-actions">
            <div className="jb-live">
              <span className="jb-live-dot" />
              Live Preview
            </div>

            <button
              type="button"
              className="jb-action"
              onClick={() =>
                router.push(
                  `/resume-builder/templates?mode=${mode}`
                )
              }
            >
              Change Template
            </button>

            <button
              type="button"
              className="jb-action jb-save"
              onClick={saveResume}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </header>

        <div className="jb-workspace">
          <aside className="jb-sidebar">
            <div className="jb-progress">
              <div className="jb-progress-row">
                <div>
                  <div className="jb-small-heading">
                    Your Resume
                  </div>
                  <div className="jb-small-copy">
                    Complete your information
                  </div>
                </div>

                <div>
                  <div className="jb-percent">
                    {completion}%
                  </div>
                  <div className="jb-percent-label">
                    complete
                  </div>
                </div>
              </div>

              <div className="jb-progress-track">
                <div
                  className="jb-progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <div className="jb-editor-body">
              <nav className="jb-section-sidebar">
                <div className="jb-section-sidebar-title">
                  Resume sections
                </div>

                <div className="jb-section-list">
                  {sections.map(([id, label], index) => (
                    <button
                      type="button"
                      key={id}
                      className={
                        activeSection === id
                          ? "jb-section-item jb-section-item-active"
                          : "jb-section-item"
                      }
                      onClick={() => setActiveSection(id)}
                    >
                      <span className="jb-section-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="jb-section-label">
                        {label}
                      </span>

                      {activeSection === id && (
                        <span className="jb-section-current" />
                      )}
                    </button>
                  ))}
                </div>
              </nav>

              <div className="jb-form">
              {activeSection === "contacts" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Contact information
                    </div>
                    <div className="jb-section-description">
                      These details appear at the top of your resume.
                    </div>
                  </div>

                  <div className="jb-fields">
                    <label className="jb-field">
                      <span className="jb-label">Full name</span>
                      <input
                        className="jb-input"
                        value={data.fullName}
                        onChange={(e) =>
                          update("fullName", e.target.value)
                        }
                      />
                    </label>

                    <label className="jb-field">
                      <span className="jb-label">
                        Professional title
                      </span>
                      <input
                        className="jb-input"
                        value={data.title}
                        onChange={(e) =>
                          update("title", e.target.value)
                        }
                      />
                    </label>

                    <div className="jb-two">
                      <label className="jb-field">
                        <span className="jb-label">Email</span>
                        <input
                          className="jb-input"
                          value={data.email}
                          onChange={(e) =>
                            update("email", e.target.value)
                          }
                        />
                      </label>

                      <label className="jb-field">
                        <span className="jb-label">Phone</span>
                        <input
                          className="jb-input"
                          value={data.phone}
                          onChange={(e) =>
                            update("phone", e.target.value)
                          }
                        />
                      </label>
                    </div>

                    <label className="jb-field">
                      <span className="jb-label">Location</span>
                      <input
                        className="jb-input"
                        value={data.location}
                        onChange={(e) =>
                          update("location", e.target.value)
                        }
                      />
                    </label>

                    <label className="jb-field">
                      <span className="jb-label">LinkedIn</span>
                      <input
                        className="jb-input"
                        value={data.linkedin}
                        onChange={(e) =>
                          update("linkedin", e.target.value)
                        }
                      />
                    </label>

                    <label className="jb-field">
                      <span className="jb-label">GitHub</span>
                      <input
                        className="jb-input"
                        value={data.github}
                        onChange={(e) =>
                          update("github", e.target.value)
                        }
                      />
                    </label>

                    <label className="jb-field">
                      <span className="jb-label">
                        Portfolio / Website
                      </span>
                      <input
                        className="jb-input"
                        value={data.portfolio}
                        onChange={(e) =>
                          update("portfolio", e.target.value)
                        }
                      />
                    </label>
                  </div>
                </section>
              )}

              {activeSection === "summary" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Professional summary
                    </div>
                    <div className="jb-section-description">
                      Keep this concise and focused on your target role.
                    </div>
                  </div>

                  <label className="jb-field">
                    <span className="jb-label">Summary</span>
                    <textarea
                      className="jb-textarea"
                      value={data.summary}
                      onChange={(e) =>
                        update("summary", e.target.value)
                      }
                    />
                  </label>
                </section>
              )}

              {activeSection === "experience" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Experience
                    </div>
                    <div className="jb-section-description">
                      Add your professional experience and achievements.
                    </div>
                  </div>

                  {data.experiences.map((item, index) => (
                    <div className="jb-card" key={item.id}>
                      <div className="jb-card-header">
                        <div className="jb-card-title">
                          {item.role || item.company || "Experience"}
                        </div>

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "experiences",
                              data.experiences.filter(
                                (entry) => entry.id !== item.id
                              )
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="jb-fields">
                        <label className="jb-field">
                          <span className="jb-label">Company</span>
                          <input
                            className="jb-input"
                            value={item.company}
                            onChange={(e) =>
                              updateExperience(item.id, {
                                company: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">Job title</span>
                          <input
                            className="jb-input"
                            value={item.role}
                            onChange={(e) =>
                              updateExperience(item.id, {
                                role: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">Location</span>
                          <input
                            className="jb-input"
                            value={item.location}
                            onChange={(e) =>
                              updateExperience(item.id, {
                                location: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="jb-two">
                          <label className="jb-field">
                            <span className="jb-label">Start</span>
                            <input
                              className="jb-input"
                              value={item.start}
                              onChange={(e) =>
                                updateExperience(item.id, {
                                  start: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="jb-field">
                            <span className="jb-label">End</span>
                            <input
                              className="jb-input"
                              value={item.end}
                              onChange={(e) =>
                                updateExperience(item.id, {
                                  end: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <label className="flex items-center gap-2 text-[11px] font-bold text-[#344054]">
                          <input
                            type="checkbox"
                            checked={item.current}
                            onChange={(e) =>
                              updateExperience(item.id, {
                                current: e.target.checked,
                              })
                            }
                          />
                          I currently work here
                        </label>

                        <div>
                          <div className="jb-label">
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
                                    className="jb-input"
                                    value={bullet}
                                    onChange={(e) => {
                                      const bullets = [
                                        ...item.bullets,
                                      ];
                                      bullets[bulletIndex] =
                                        e.target.value;

                                      updateExperience(item.id, {
                                        bullets,
                                      });
                                    }}
                                  />

                                  <button
                                    type="button"
                                    className="jb-remove"
                                    onClick={() => {
                                      const bullets =
                                        item.bullets.filter(
                                          (_, i) =>
                                            i !== bulletIndex
                                        );

                                      updateExperience(item.id, {
                                        bullets: bullets.length
                                          ? bullets
                                          : [""],
                                      });
                                    }}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )
                            )}
                          </div>

                          <button
                            type="button"
                            className="mt-2 text-[11px] font-extrabold text-[#344054] underline"
                            onClick={() =>
                              updateExperience(item.id, {
                                bullets: [
                                  ...item.bullets,
                                  "",
                                ],
                              })
                            }
                          >
                            + Add achievement
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("experiences", [
                        ...data.experiences,
                        emptyExperience(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add Experience
                  </button>
                </section>
              )}

              {activeSection === "education" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Education
                    </div>
                    <div className="jb-section-description">
                      Add your university, college and school education.
                    </div>
                  </div>

                  {data.education.map((item, index) => (
                    <div className="jb-card" key={item.id}>
                      <div className="jb-card-header">
                        <div className="jb-card-title">
                          <span className="jb-number">
                            {index + 1}
                          </span>
                          {item.institution || "Education"}
                        </div>

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "education",
                              data.education.filter(
                                (entry) => entry.id !== item.id
                              )
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="jb-fields">
                        <label className="jb-field">
                          <span className="jb-label">
                            Institution
                          </span>
                          <input
                            className="jb-input"
                            value={item.institution}
                            onChange={(e) =>
                              updateEducation(item.id, {
                                institution: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="jb-two">
                          <label className="jb-field">
                            <span className="jb-label">Degree</span>
                            <input
                              className="jb-input"
                              value={item.degree}
                              onChange={(e) =>
                                updateEducation(item.id, {
                                  degree: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="jb-field">
                            <span className="jb-label">
                              Field of study
                            </span>
                            <input
                              className="jb-input"
                              value={item.field}
                              onChange={(e) =>
                                updateEducation(item.id, {
                                  field: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="jb-two">
                          <label className="jb-field">
                            <span className="jb-label">
                              Grade / GPA
                            </span>
                            <input
                              className="jb-input"
                              value={item.grade}
                              onChange={(e) =>
                                updateEducation(item.id, {
                                  grade: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="jb-field">
                            <span className="jb-label">
                              Location
                            </span>
                            <input
                              className="jb-input"
                              value={item.location}
                              onChange={(e) =>
                                updateEducation(item.id, {
                                  location: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className="jb-two">
                          <label className="jb-field">
                            <span className="jb-label">Start</span>
                            <input
                              className="jb-input"
                              value={item.start}
                              onChange={(e) =>
                                updateEducation(item.id, {
                                  start: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="jb-field">
                            <span className="jb-label">End</span>
                            <input
                              className="jb-input"
                              value={item.end}
                              onChange={(e) =>
                                updateEducation(item.id, {
                                  end: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("education", [
                        ...data.education,
                        emptyEducation(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add Education
                  </button>
                </section>
              )}

              {activeSection === "projects" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Projects
                    </div>
                    <div className="jb-section-description">
                      Show what you built, how you built it and the result.
                    </div>
                  </div>

                  {data.projects.map((item, index) => (
                    <div className="jb-card" key={item.id}>
                      <div className="jb-card-header">
                        <div className="jb-card-title">
                          <span className="jb-number">
                            {index + 1}
                          </span>
                          {item.name || "Project"}
                        </div>

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "projects",
                              data.projects.filter(
                                (entry) => entry.id !== item.id
                              )
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="jb-fields">
                        <label className="jb-field">
                          <span className="jb-label">
                            Project name
                          </span>
                          <input
                            className="jb-input"
                            value={item.name}
                            onChange={(e) =>
                              updateProject(item.id, {
                                name: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Technologies
                          </span>
                          <input
                            className="jb-input"
                            value={item.technologies}
                            onChange={(e) =>
                              updateProject(item.id, {
                                technologies: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Project link
                          </span>
                          <input
                            className="jb-input"
                            value={item.link}
                            onChange={(e) =>
                              updateProject(item.id, {
                                link: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Description
                          </span>
                          <textarea
                            className="jb-textarea"
                            value={item.description}
                            onChange={(e) =>
                              updateProject(item.id, {
                                description: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Your contribution
                          </span>
                          <textarea
                            className="jb-textarea"
                            value={item.contribution}
                            onChange={(e) =>
                              updateProject(item.id, {
                                contribution: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Result / impact
                          </span>
                          <textarea
                            className="jb-textarea"
                            value={item.result}
                            onChange={(e) =>
                              updateProject(item.id, {
                                result: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("projects", [
                        ...data.projects,
                        emptyProject(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add Project
                  </button>
                </section>
              )}

              {activeSection === "skills" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Skills
                    </div>
                    <div className="jb-section-description">
                      Add technologies and skills relevant to your target role.
                    </div>
                  </div>

                  <div className="jb-fields">
                    {data.skills.map((skill, index) => (
                      <div
                        className="flex items-center gap-2"
                        key={index}
                      >
                        <input
                          className="jb-input"
                          value={skill}
                          onChange={(e) => {
                            const skills = [...data.skills];
                            skills[index] = e.target.value;
                            update("skills", skills);
                          }}
                        />

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "skills",
                              data.skills.filter(
                                (_, i) => i !== index
                              )
                            )
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("skills", [...data.skills, ""])
                    }
                  >
                    <Plus size={15} />
                    Add Skill
                  </button>
                </section>
              )}

              {activeSection === "certifications" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Certifications
                    </div>
                    <div className="jb-section-description">
                      Add certifications and credentials that strengthen your profile.
                    </div>
                  </div>

                  {data.certifications.map((item, index) => (
                    <div className="jb-card" key={item.id}>
                      <div className="jb-card-header">
                        <div className="jb-card-title">
                          <span className="jb-number">
                            {index + 1}
                          </span>
                          {item.name || "Certification"}
                        </div>

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "certifications",
                              data.certifications.filter(
                                (entry) => entry.id !== item.id
                              )
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="jb-fields">
                        <label className="jb-field">
                          <span className="jb-label">
                            Certification
                          </span>
                          <input
                            className="jb-input"
                            value={item.name}
                            onChange={(e) =>
                              updateCertification(item.id, {
                                name: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Issuing organization
                          </span>
                          <input
                            className="jb-input"
                            value={item.issuer}
                            onChange={(e) =>
                              updateCertification(item.id, {
                                issuer: e.target.value,
                              })
                            }
                          />
                        </label>

                        <div className="jb-two">
                          <label className="jb-field">
                            <span className="jb-label">Year</span>
                            <input
                              className="jb-input"
                              value={item.year}
                              onChange={(e) =>
                                updateCertification(item.id, {
                                  year: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label className="jb-field">
                            <span className="jb-label">
                              Credential ID
                            </span>
                            <input
                              className="jb-input"
                              value={item.credentialId}
                              onChange={(e) =>
                                updateCertification(item.id, {
                                  credentialId:
                                    e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <label className="jb-field">
                          <span className="jb-label">
                            Credential URL
                          </span>
                          <input
                            className="jb-input"
                            value={item.link}
                            onChange={(e) =>
                              updateCertification(item.id, {
                                link: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("certifications", [
                        ...data.certifications,
                        emptyCertification(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add Certification
                  </button>
                </section>
              )}

              {activeSection === "achievements" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Achievements
                    </div>
                    <div className="jb-section-description">
                      Highlight awards, hackathons, leadership and accomplishments.
                    </div>
                  </div>

                  {data.achievements.map((item, index) => (
                    <div className="jb-card" key={item.id}>
                      <div className="jb-card-header">
                        <div className="jb-card-title">
                          <span className="jb-number">
                            {index + 1}
                          </span>
                          {item.title || "Achievement"}
                        </div>

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "achievements",
                              data.achievements.filter(
                                (entry) => entry.id !== item.id
                              )
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="jb-fields">
                        <label className="jb-field">
                          <span className="jb-label">
                            Achievement
                          </span>
                          <input
                            className="jb-input"
                            value={item.title}
                            onChange={(e) =>
                              updateAchievement(item.id, {
                                title: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Organization
                          </span>
                          <input
                            className="jb-input"
                            value={item.organization}
                            onChange={(e) =>
                              updateAchievement(item.id, {
                                organization:
                                  e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">Year</span>
                          <input
                            className="jb-input"
                            value={item.year}
                            onChange={(e) =>
                              updateAchievement(item.id, {
                                year: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Description
                          </span>
                          <textarea
                            className="jb-textarea"
                            value={item.description}
                            onChange={(e) =>
                              updateAchievement(item.id, {
                                description:
                                  e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("achievements", [
                        ...data.achievements,
                        emptyAchievement(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add Achievement
                  </button>
                </section>
              )}

              {activeSection === "languages" && (
                <section>
                  <div className="jb-section-heading">
                    <div className="jb-section-title">
                      Languages
                    </div>
                    <div className="jb-section-description">
                      Add languages and your level of proficiency.
                    </div>
                  </div>

                  {data.languages.map((item, index) => (
                    <div className="jb-card" key={item.id}>
                      <div className="jb-card-header">
                        <div className="jb-card-title">
                          <span className="jb-number">
                            {index + 1}
                          </span>
                          {item.name || "Language"}
                        </div>

                        <button
                          type="button"
                          className="jb-remove"
                          onClick={() =>
                            update(
                              "languages",
                              data.languages.filter(
                                (entry) => entry.id !== item.id
                              )
                            )
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="jb-two">
                        <label className="jb-field">
                          <span className="jb-label">
                            Language
                          </span>
                          <input
                            className="jb-input"
                            value={item.name}
                            onChange={(e) =>
                              updateLanguage(item.id, {
                                name: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label className="jb-field">
                          <span className="jb-label">
                            Proficiency
                          </span>
                          <input
                            className="jb-input"
                            value={item.level}
                            onChange={(e) =>
                              updateLanguage(item.id, {
                                level: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="jb-add"
                    onClick={() =>
                      update("languages", [
                        ...data.languages,
                        emptyLanguage(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add Language
                  </button>
                </section>
              )}
                <div className="jb-next-area">
                  <button
                    type="button"
                    className="jb-next-button"
                    onClick={nextSection}
                  >
                    <span>
                      {activeSection === "languages"
                        ? "Finish"
                        : "Next"}
                    </span>
                    <span className="jb-next-arrow">&#8594;</span>
                  </button>

                  <div className="jb-next-hint">
                    {activeSection === "languages"
                      ? "Your resume is ready to review."
                      : `Continue to ${
                          sections[
                            sections.findIndex(
                              ([id]) => id === activeSection
                            ) + 1
                          ]?.[1] || "next section"
                        }.`}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="jb-preview">
            <div className="jb-preview-inner">
              <div className="jb-preview-toolbar">
                <div className="jb-preview-toolbar-label">
                  Resume preview
                </div>

                <div className="jb-zoom-controls">
                  <button
                    type="button"
                    className="jb-zoom-button"
                    onClick={() =>
                      setPreviewZoom((value) =>
                        Math.max(50, value - 10)
                      )
                    }
                    aria-label="Zoom out"
                  >
                    -
                  </button>

                  <button
                    type="button"
                    className="jb-zoom-value"
                    onClick={() => setPreviewZoom(106)}
                  >
                    {previewZoom}%
                  </button>

                  <button
                    type="button"
                    className="jb-zoom-button"
                    onClick={() =>
                      setPreviewZoom((value) =>
                        Math.min(130, value + 10)
                      )
                    }
                    aria-label="Zoom in"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    className="jb-zoom-reset"
                    onClick={() => setPreviewZoom(106)}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div
                className="jb-resume-wrap"
                style={{
                  zoom: previewZoom / 100
                }}
              >
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
      </div>
    </main>
  );
}

