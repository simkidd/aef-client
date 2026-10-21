export interface StaticSkillArea {
  id: string;
  code: string;
  name: string;
  category: "Renewable Energy" | "Digital & ICT" | "Technical / Vocational" | "Creative Arts" | "Agriculture" | "Hospitality";
  description: string;
  durationWeeks: number;
  certificationType: string;
  framework: string;
  organizer: string;
  facilities: string[];
  equipment: string[];
  image: string;
}

export const VOCATIONAL_SKILLS: StaticSkillArea[] = [
  {
    id: "skill-sol-pv",
    code: "SOL-PV",
    name: "Solar PV Installation & Energy Storage",
    category: "Renewable Energy",
    description:
      "Comprehensive design, mounting, inverter configuration, and maintenance of rooftop and mini-grid solar systems for residential and industrial clean power.",
    durationWeeks: 8,
    certificationType: "National Certification (NABTEB / Ministry of Labour)",
    framework: "National TVET Technical Skills Program",
    organizer: "Federal Ministry of Labour / NBTE & Adele Foundation",
    facilities: ["Solar Workshop", "Roof Mockup Installation Rig"],
    equipment: ["Digital Multimeters", "Crimping Tools", "Hybrid Inverter Racks", "Safety Harnesses"],
    image: "/images/auth-hero-solar.jpg",
  },
  {
    id: "skill-web-dev",
    code: "WEB-DEV",
    name: "Full-Stack Web Development",
    category: "Digital & ICT",
    description:
      "Modern full-stack engineering with TypeScript, React, Next.js, Node.js, and databases, preparing developers for scalable cloud software roles.",
    durationWeeks: 12,
    certificationType: "AEF Certificate of Competency",
    framework: "Adele Foundation Flagship Vocational Program",
    organizer: "Adele Empowerment Foundation",
    facilities: ["Digital Innovation Lab", "Dedicated High-Speed Fiber Network"],
    equipment: ["Core i7 Workstations", "Cloud Development Sandboxes", "Interactive 4K Smart Screens"],
    image: "/images/auth-hero-network.jpg",
  },
  {
    id: "skill-wld-fab",
    code: "WLD-FAB",
    name: "Welding & Steel Fabrication",
    category: "Technical / Vocational",
    description:
      "Arc, MIG, and TIG welding techniques, industrial safety compliance, pipeline jointing, and structural steel fabrication for heavy industries.",
    durationWeeks: 10,
    certificationType: "National Certification",
    framework: "National TVET Technical Skills Program",
    organizer: "Federal Ministry of Labour / NBTE & Adele Foundation",
    facilities: ["Welding & Heavy Fabrication Bay", "Fume Extraction Yard"],
    equipment: ["MIG/TIG Inverter Welding Stations", "Flame Cutting Stations", "Hydraulic Shears", "Safety Gear"],
    image: "/images/auth-hero-solar.jpg",
  },
  {
    id: "skill-ui-ux",
    code: "UI-UX",
    name: "UI/UX Design & Digital Product Design",
    category: "Creative Arts",
    description:
      "User research, human-centered wireframing, high-fidelity interactive prototyping in Figma, comprehensive design systems, and usability heuristics.",
    durationWeeks: 8,
    certificationType: "AEF Certificate of Competency",
    framework: "Adele Foundation Flagship Vocational Program",
    organizer: "Adele Empowerment Foundation",
    facilities: ["Creative UI/UX & Design Studio"],
    equipment: ["iMac Graphic Workstations", "Wacom Drawing Tablets", "Figma Design System Toolkits"],
    image: "/images/auth-hero-network.jpg",
  },
  {
    id: "skill-data-ai",
    code: "DATA-AI",
    name: "Data Analytics & AI Tools",
    category: "Digital & ICT",
    description:
      "Data wrangling, business intelligence dashboarding with PowerBI & Python, SQL query engineering, and practical AI workflow automation.",
    durationWeeks: 8,
    certificationType: "AEF Certificate of Competency",
    framework: "Digital & Creative Youth Initiative",
    organizer: "Tech4Dev & Adele Empowerment Foundation",
    facilities: ["Digital Innovation Lab"],
    equipment: ["Core i7 Workstations", "PowerBI & Python Environments", "Modern AI Productivity Sandboxes"],
    image: "/images/auth-hero-network.jpg",
  },
  {
    id: "skill-agri-hyd",
    code: "AGRI-HYD",
    name: "Modern Agribusiness & Hydroponics",
    category: "Agriculture",
    description:
      "Precision soilless hydroponics, greenhouse climate cultivation, high-value organic crops, post-harvest packaging, and commercial food distribution.",
    durationWeeks: 20,
    certificationType: "AEF Certificate of Competency",
    framework: "Adele Foundation Flagship Vocational Program",
    organizer: "Adele Empowerment Foundation",
    facilities: ["Greenhouse Yard", "Hydroponic Practical Systems"],
    equipment: ["Soilless Nutrient Formulations", "Automated Irrigation Pumps", "Cold-Chain Packaging Sets"],
    image: "/images/hero-student.jpg",
  },
  {
    id: "skill-fash-eng",
    code: "FASH-ENG",
    name: "Fashion & Garment Technology",
    category: "Technical / Vocational",
    description:
      "Industrial pattern drafting, bespoke tailoring, garment mass production, quality control protocols, and apparel studio enterprise management.",
    durationWeeks: 24,
    certificationType: "National Certification",
    framework: "Adele Foundation Flagship Vocational Program",
    organizer: "Adele Empowerment Foundation",
    facilities: ["Industrial Garment & Textile Workshop"],
    equipment: ["Industrial Sewing Machines", "Pattern Grading Tables", "Steam Press Stations"],
    image: "/images/auth-hero-makeup.jpg",
  },
  {
    id: "skill-cul-hosp",
    code: "CUL-HOSP",
    name: "Culinary Arts & Hospitality Operations",
    category: "Hospitality",
    description:
      "Continental gastronomy, commercial baking & pastry production, HACCP food hygiene standards, banquet service, and food business management.",
    durationWeeks: 16,
    certificationType: "AEF Certificate of Competency",
    framework: "Adele Foundation Flagship Vocational Program",
    organizer: "Adele Empowerment Foundation",
    facilities: ["Commercial Training Kitchen", "Banquet Demonstration Bay"],
    equipment: ["Commercial Convection Ovens", "Professional Chef Knife Sets", "HACCP Safety Monitoring Kits"],
    image: "/images/auth-hero-social.jpg",
  },
];
