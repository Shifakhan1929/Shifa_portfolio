export type Project = { name: string; type: "flutter" | "web"; desc: string; stack: string[]; emoji: string };

export const projects: Project[] = [
  { name: "StudyBuddy", type: "flutter", emoji: "📚", desc: "Offline-first study planner with spaced repetition and focus timer.", stack: ["Flutter", "Dart", "Firebase"] },
  { name: "CampusEats", type: "flutter", emoji: "🍜", desc: "Canteen pre-ordering app with live queue tracking and UPI checkout.", stack: ["Flutter", "Riverpod", "Supabase"] },
  { name: "DevBoard", type: "web", emoji: "📊", desc: "Kanban dashboard for student dev teams with GitHub sync.", stack: ["React", "TypeScript", "Node"] },
  { name: "Artfolio", type: "web", emoji: "🎨", desc: "Minimal portfolio builder for illustrators with drag-to-arrange grids.", stack: ["Next.js", "Tailwind", "Postgres"] },
];

export const skills = [
  { cat: "Mobile Dev", items: ["Flutter", "Dart", "Riverpod", "Bloc", "Firebase"] },
  { cat: "Frontend / Backend Web", items: ["React", "TypeScript", "Tailwind", "Node.js", "REST APIs"] },
  { cat: "Tools & Core CS", items: ["Git", "Figma", "DSA", "OOP", "SQL", "Linux"] },
];

export const timeline = [
  { when: "2026", title: "Flutter Developer Intern", where: "Startup Studio" },
  { when: "2025", title: "Web Dev Lead", where: "University Coding Club" },
  { when: "2023 – 2027", title: "B.E. Software Engineering", where: "University" },
];

export const journal = [
  { date: "Oct 2026", title: "Learning: Flutter animations deep-dive", body: "Exploring implicit vs explicit animations, Hero transitions and custom painters." },
  { date: "Sep 2026", title: "Building: CampusEats v2", body: "Migrating state to Riverpod 2 and adding push notifications." },
  { date: "Aug 2026", title: "Reading: Designing Data-Intensive Apps", body: "Chapter notes on replication and why consistency is hard." },
];

export const terminalOut: Record<string, string[]> = {
  help: ["Commands: help, about, projects, skills, contact, clear"],
  about: ["Shifa — 4th-year SE student.", "Flutter & Web dev who loves cozy, useful UI."],
  projects: projects.map((p) => `• ${p.name} [${p.type}] — ${p.desc}`),
  skills: skills.map((s) => `${s.cat}: ${s.items.join(", ")}`),
  contact: ["email: shifa@example.com", "github: github.com/shifa", "linkedin: linkedin.com/in/shifa"],
};
