export type Project = {
  name: string;
  type: "flutter" | "web";
  desc: string;
  stack: string[];
  emoji: string;
  github?: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "WeTravel",
    type: "flutter",
    emoji: "✈️",
    desc: "AI-powered collaborative trip planner with personalized itineraries, group activity voting, and shared expense splitting.",
    stack: ["Flutter", "Dart", "Riverpod", "BLoC", "FastAPI", "Node.js"],
    github: "https://github.com/Ansh5922/WeTravel",
    image: "/wetravel.png",
  },
  {
    name: "Veerangana",
    type: "flutter",
    emoji: "🚨",
    desc: "Women’s safety mobile app featuring one-tap Panic Mode, silent SOS location SMS alerts, nearby police/hospitals, and audio/video recording.",
    stack: ["Flutter", "Dart", "Firebase", "Geolocator GPS"],
    github: "https://github.com/Lucky-chelani/veerangana_app",
    image: "/veerangana.jpg",
  },
  {
    name: "Supplify",
    type: "flutter",
    emoji: "📦",
    desc: "Real-time mobile inventory management system with live Firebase synchronization, interactive analytics charts, and secure auth.",
    stack: ["Flutter", "Dart", "Firebase", "Analytics Charts"],
    github: "https://github.com/rashimeena/supplify",
  },
  {
    name: "ConnectCall",
    type: "flutter",
    emoji: "📞",
    desc: "1-to-1 real-time audio & video calling app using WebRTC and Firestore signaling with live call controls and call history.",
    stack: ["Flutter", "Dart", "WebRTC", "Cloud Firestore", "Firebase Auth"],
    github: "https://github.com/Shifakhan1929/ConnectCall",
    image: "/connectcall.jpg",
  },
  {
    name: "Veerangana Web",
    type: "web",
    emoji: "🛡️",
    desc: "Digital women’s safety awareness portal with emergency helpline resources and Sakhi, an interactive AI-powered safety assistant.",
    stack: ["HTML5", "CSS3", "JavaScript", "Sakhi AI"],
    github: "https://github.com/Shifakhan1929/Veeranganaa_website",
    image: "/veerangana-web.png",
  },
  {
    name: "Shifa OS Portfolio",
    type: "web",
    emoji: "✨",
    desc: "Interactive retro-modern personal operating system portfolio featuring draggable windows, browser tabs, and a mobile OS mode.",
    stack: ["React.js", "TypeScript", "Tailwind CSS", "Interactive UI"],
    github: "https://github.com/Shifakhan1929/window-shopper-studio",
    image: "/shifa-os.png",
  },
];

export type SkillGroup = {
  cat: string;
  items: string[];
  headerColor: string;
  colorName: string;
};

export const skills: SkillGroup[] = [
  {
    cat: "Mobile Dev",
    colorName: "Green",
    headerColor: "text-[#4ade80]",
    items: ["Flutter", "Riverpod", "Bloc", "Firebase", "Location & GPS", "Android Studio"],
  },
  {
    cat: "Web & Backend",
    colorName: "Amber",
    headerColor: "text-[#fbbf24]",
    items: ["React.js", "Node.js", "FastAPI", "REST APIs", "JWT Auth", "Responsive UI"],
  },
  {
    cat: "Languages",
    colorName: "Coral",
    headerColor: "text-[#f87171]",
    items: ["Dart", "Java", "TypeScript", "JavaScript", "SQL", "HTML5 / CSS3"],
  },
  {
    cat: "Core CS",
    colorName: "Blue",
    headerColor: "text-[#60a5fa]",
    items: ["DSA", "OOP", "DBMS", "Operating Systems", "Computer Networks"],
  },
  {
    cat: "Dev Tools",
    colorName: "Purple",
    headerColor: "text-[#c084fc]",
    items: ["Git", "GitHub", "VS Code", "Android Studio", "AI-Assisted Workflow"],
  },
  {
    cat: "Creative & SMM",
    colorName: "Rose Pink",
    headerColor: "text-[#f472b6]",
    items: ["Social Media Mgmt", "Video & Photo Editing", "Graphic Design", "Canva"],
  },
];

export type TimelineItem = {
  when: string;
  badge: string;
  badgeType: "featured" | "creative" | "education";
  title: string;
  where: string;
  desc?: string;
  skills?: string[];
  featured?: boolean;
};

export const timeline: TimelineItem[] = [
  {
    when: "May 2025 – Aug 2025",
    badge: "Featured Tech Role",
    badgeType: "featured",
    title: "Flutter Developer",
    where: "Training & Placement Cell, UIT-RGPV Bhopal",
    desc: "Developed and enhanced core features of a Flutter-based Student & Coordinator mobile application to improve usability and seamless REST API integration.",
    skills: ["Flutter", "REST APIs", "Dart", "Mobile UI"],
    featured: true,
  },
  {
    when: "Sep 2024 – Dec 2025",
    badge: "Leadership & Creative",
    badgeType: "creative",
    title: "Student Coordinator & SMM Lead",
    where: "The Persona · Bhopal, MP",
    desc: "Spearheaded social media marketing, video editing, content creation, and student coordination initiatives.",
    skills: ["Social Media Marketing", "Video Editing", "Content Strategy"],
  },
  {
    when: "2023 – Present (2027)",
    badge: "Education",
    badgeType: "education",
    title: "B.Tech in Computer Science & Business Systems",
    where: "School of Information Technology (RGPV), Bhopal",
  },
];

export const journal = [
  { date: "Oct 2026", title: "Learning: Flutter animations deep-dive", body: "Exploring implicit vs explicit animations, Hero transitions and custom painters." },
  { date: "Sep 2026", title: "Building: CampusEats v2", body: "Migrating state to Riverpod 2 and adding push notifications." },
  { date: "Aug 2026", title: "Reading: Designing Data-Intensive Apps", body: "Chapter notes on replication and why consistency is hard." },
];

export const SOCIAL_LINKS = {
  resume: "https://drive.google.com/file/d/1ivwNuksFj7AS4MijeLzRhhPRornK_foc/view?usp=sharing",
  github: "https://github.com/Shifakhan1929",
  linkedin: "https://www.linkedin.com/in/shifakhan2",
};

export const terminalOut: Record<string, string[]> = {
  help: ["Commands: help, about, projects, skills, contact, resume, clear"],
  about: ["Shifa — 4th-year SE student.", "Flutter & Web dev who loves cozy, useful UI."],
  projects: projects.map((p) => `• ${p.name} [${p.type}] — ${p.desc}`),
  skills: skills.map((s) => `${s.cat}: ${s.items.join(", ")}`),
  contact: [
    "email: shifa@example.com",
    `github: ${SOCIAL_LINKS.github}`,
    `linkedin: ${SOCIAL_LINKS.linkedin}`,
  ],
  resume: [`resume: ${SOCIAL_LINKS.resume}`],
};

