/* All site copy in one place, kept word-for-word from the original True Connectz pitch page
   (which follows the "Website Upgrade Guidance" document). */

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export const CONTACT = {
  phone: "9080964484",
  tel: "tel:+919080964484",
  email: "sumaya@trueconnectz.com",
  whatsapp: "919080964484",
};

export const BRAND_PROMISE = "Your Strategic Partner for Talent, People & Workforce Development";

export type Audience = "biz" | "ind";

export type Service = {
  /** full name */
  k: string;
  /** short name for tabs */
  s: string;
  /** one-line description for the card */
  d: string;
  cta: string;
  /** who it's mainly for: business or individual */
  f: Audience;
  /** positioning statement */
  pos: string;
  /** lists: [heading, items] */
  L: [string, string[]][];
  /** compliance / scope note */
  N?: string;
};

export const SERVICES: Service[] = [
  {
    k: "Specialised HR Recruitment",
    s: "HR Recruitment",
    d: "Corporate and specialist hiring across selected industries.",
    cta: "Discuss Your Hiring Needs",
    f: "biz",
    pos: "Specialist hiring partner for organisations seeking dependable talent across technical, professional and leadership roles.",
    L: [
      [
        "Services",
        [
          "Permanent and professional recruitment",
          "Executive and middle-management search",
          "Technical and non-technical hiring",
          "Volume and project-based recruitment",
          "Domestic and international recruitment, subject to applicable legal requirements",
        ],
      ],
      ["Industries", ["Construction & Engineering", "IT & Technology", "Healthcare", "Logistics & Supply Chain", "Hotels, Resorts & Hospitality"]],
    ],
  },
  {
    k: "HR Consulting, Advice & Audits",
    s: "HR Consulting",
    d: "Practical HR systems, processes, documentation and advisory support.",
    cta: "Explore HR Support",
    f: "biz",
    pos: "Helping businesses build structured, consistent and people-friendly HR practices.",
    L: [
      [
        "What we help with",
        [
          "HR process development and review",
          "HR policies, employee handbooks, forms and SOPs",
          "HR documentation and employee lifecycle processes",
          "HR audits and process-gap reviews",
          "Organisation structure, job descriptions and role mapping",
          "Performance management, KPIs and KRAs",
          "Employee engagement and retention support",
          "HR compliance coordination and advisory",
        ],
      ],
    ],
    N: "HR compliance support is advisory and coordination only. It is not a regulated legal service.",
  },
  {
    k: "True Connectz Academy",
    s: "Academy",
    d: "Professional readiness, human-centric skills and HR learning programmes.",
    cta: "Enquire About Training",
    f: "ind",
    pos: "Practical learning programmes that help students and professionals become workplace-ready and strengthen people-management capability.",
    L: [
      [
        "Programme 1: Professional Readiness & Human-Centric Skills Mastery",
        [
          "Self-awareness and personal mastery",
          "Communication excellence",
          "Emotional intelligence and self-regulation",
          "Interpersonal and relationship skills",
          "Workplace readiness and professional etiquette",
          "Critical thinking and problem-solving",
          "Teamwork, collaboration and leadership",
          "Adaptability, resilience and growth mindset",
          "Career readiness and professional branding",
          "Practical application and performance assessment",
        ],
      ],
      [
        "Programme 2: HR Certification / HR Skills Programmes",
        [
          "HR management and administration",
          "HR generalist foundations",
          "Recruitment and talent acquisition",
          "Payroll and HR operations",
          "HR documentation and employee lifecycle",
          "Performance management and HR reporting",
        ],
      ],
    ],
    N: "These are True Connectz Academy programmes with certificates of completion.",
  },
  {
    k: "Virtual HR Solutions",
    s: "Virtual HR",
    d: "Outsourced HR administration and ongoing support for growing businesses.",
    cta: "Request a Virtual HR Consultation",
    f: "biz",
    pos: "Your outsourced HR support function, helping growing businesses manage essential HR operations without building a full in-house HR department.",
    L: [
      [
        "What can be included",
        [
          "Employee records and HR administration",
          "Onboarding and exit documentation",
          "Attendance and leave administration",
          "Payroll input coordination, payslips and payroll reports",
          "Offer letters, appointment letters and HR templates",
          "Employee communication and routine HR support",
          "HR reports and management updates",
          "Ongoing HR advisory and performance-review support",
          "One agreed recruitment assignment per month, within a clearly defined scope",
        ],
      ],
    ],
    N: "Scope, headcount, payroll responsibilities and response times are agreed in writing at the start.",
  },
];

/** Enquiry form fields per service. "Name|type|options..." — type: text (default), email, tel, select, area */
export const FORMS: string[][] = [
  ["Company", "Contact person", "Email|email", "Phone|tel", "Industry", "Role / title", "Number of vacancies", "Location", "Salary range", "Expected joining timeline"],
  ["Company size", "Current HR challenge|area", "Support required|area", "Location", "Preferred consultation time", "Name", "Email|email", "Phone|tel"],
  [
    "I am a|select|Student|Professional",
    "Programme of interest|select|Professional Readiness & Human-Centric Skills|HR Certification / HR Skills",
    "Education / experience",
    "Preferred mode|select|Online|In person|Hybrid",
    "Location",
    "Name",
    "Email|email",
    "Phone|tel",
  ],
  ["Employee headcount", "Industry", "Current HR setup", "Payroll needs", "Recruitment needs", "Required start date", "Name", "Email|email", "Phone|tel"],
];

export const INDUSTRIES = ["Construction & Engineering", "IT & Technology", "Healthcare", "Logistics & Supply Chain", "Hotels, Resorts & Hospitality"];

export const WHY = [
  { h: "Pan-India reach", p: "Support for organisations hiring and growing across locations." },
  { h: "Industry understanding", p: "Hiring and HR support shaped around the sectors we serve." },
  { h: "Practical HR support", p: "Clear, workable HR processes, documents and routines." },
  { h: "Candidate network", p: "A growing network of professionals across technical and leadership roles." },
  { h: "Workforce development", p: "Learning programmes that make people workplace-ready." },
];

export const STEPS = [
  "Requirement discussion",
  "Role and candidate mapping",
  "Sourcing",
  "Screening",
  "Shortlisting",
  "Interview coordination",
  "Offer and joining support",
];

/** Placeholders: only verified figures go here (see the guidance document). */
export const PROOF = ["Verified clients served", "Verified placements", "Verified candidates in network", "Verified people trained"];

export const POSTS = [
  { tag: "Hiring insights", h: "Hiring trends worth watching", p: "Coming soon. Fresh articles with current dates and proper author attribution." },
  { tag: "HR guides", h: "HR documentation checklist", p: "Coming soon. A practical guide for growing teams." },
  { tag: "Academy updates", h: "Interview preparation and workplace readiness", p: "Coming soon. Advice for students and early professionals." },
];

export const ABOUT_MV = [
  { h: "Managing Director", p: "Profile and photo to be added by the client." },
  { h: "Company story", p: "Confirmed dates and milestones to be added." },
  { h: "Mission", p: "To be confirmed with the client." },
  { h: "Vision", p: "To be confirmed with the client." },
];
