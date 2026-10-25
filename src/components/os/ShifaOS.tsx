import { useEffect, useRef, useState, type ReactNode } from "react";
import { projects, skills, timeline, journal, terminalOut, SOCIAL_LINKS, type Project } from "./data";
import { StandbyCenterpiece, type Mood } from "./StandbyCenterpiece";

type WinId = "portfolio" | "terminal" | "bin";
type TabId = "overview" | "projects" | "skills" | "journal";
const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "🏠 Overview.me" },
  { id: "projects", label: "🚀 Projects.app" },
  { id: "skills", label: "🛠️ Skills_&_Exp.json" },
  { id: "journal", label: "📓 Journal.md" },
];

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(t);
  }, []);
  return now;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const f = () => setM(q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);
  return m;
}

export function ShifaOS() {
  const mobile = useIsMobile();
  return mobile ? <Pocket /> : <Desktop />;
}

/* ---------------- Desktop ---------------- */

function Desktop() {
  const now = useClock();
  const [classic, setClassic] = useState(false);
  const [open, setOpen] = useState<Record<WinId, boolean>>({ portfolio: true, terminal: false, bin: false });
  const [min, setMin] = useState<Record<WinId, boolean>>({ portfolio: false, terminal: false, bin: false });
  const [focus, setFocus] = useState<WinId>("portfolio");
  const [tab, setTab] = useState<TabId>("overview");
  const [mood, setMood] = useState<Mood>("surprised");
  const [portfolioVersion, setPortfolioVersion] = useState(0);
  const [tabsEmpty, setTabsEmpty] = useState(false);
  const standby = tabsEmpty || !Object.values(open).some(Boolean);

  useEffect(() => { if (standby) setMood("surprised"); }, [standby]);

  const launch = (id: WinId, t?: TabId) => {
    if (id === "portfolio") {
      setTabsEmpty(false);
      if (!open.portfolio) setPortfolioVersion((version) => version + 1);
    }
    setOpen((o) => ({ ...o, [id]: true }));
    setMin((m) => ({ ...m, [id]: false }));
    setFocus(id);
    if (t) setTab(t);
  };

  const icons: { label: string; image: string; act: () => void }[] = [
    { label: "Portfolio_Explorer", image: "/folder-explorer.svg", act: () => launch("portfolio", "overview") },
    { label: "Projects", image: "/folder-projects.svg", act: () => launch("portfolio", "projects") },
    { label: "Terminal_CLI", image: "/app-terminal.svg", act: () => launch("terminal") },
    { label: "Resume.pdf", image: "/doc-pdf.svg", act: () => window.open(SOCIAL_LINKS.resume, "_blank") },
    { label: "GitHub", image: "/github.svg", act: () => window.open(SOCIAL_LINKS.github, "_blank") },
    { label: "LinkedIn", image: "/linkedin.svg", act: () => window.open(SOCIAL_LINKS.linkedin, "_blank") },
    { label: "Learning_Journal", image: "/app-journal.svg", act: () => launch("portfolio", "journal") },
    { label: "Contact_Me", image: "/app-mail.svg", act: () => launch("terminal") },
    { label: "Recycle_Bin", image: "/app-trash.svg", act: () => launch("bin") },
  ];

  if (classic) {
    return (
      <div className="min-h-screen bg-background">
        <SystemBar now={now} classic={classic} setClassic={setClassic} app="Classic View" />
        <div className="mx-auto max-w-5xl p-8">
          <PortfolioBody tab={tab} setTab={setTab} />
        </div>
      </div>
    );
  }

  return (
    <div className="wallpaper relative h-screen overflow-hidden font-sans">
      <SystemBar now={now} classic={classic} setClassic={setClassic} app={open[focus] ? (focus === "portfolio" ? "Portfolio Explorer" : focus === "terminal" ? "Terminal" : "Recycle Bin") : "Desktop"} />

      <div className="absolute bottom-20 left-4 top-14 z-0 flex flex-col gap-3 overflow-y-auto">
        {icons.map((i) => (
          <button key={i.label} onDoubleClick={i.act} onClick={i.act} onPointerEnter={() => { if (standby && i.label === "Recycle_Bin") setMood("bin"); }} onFocus={() => { if (standby && i.label === "Recycle_Bin") setMood("bin"); }} className="group flex w-24 flex-col items-center gap-1 rounded-lg p-2 hover:bg-card/30">
            <span className="pop flex h-12 w-12 items-center justify-center rounded-xl bg-card p-2 transition-transform group-hover:-translate-y-0.5">
              <img src={i.image} alt={i.label} className="h-full w-full object-contain filter drop-shadow-xs" />
            </span>
            <span className="rounded bg-espresso/60 px-1.5 font-mono text-[10px] text-cream">{i.label}</span>
          </button>
        ))}
      </div>

      {!standby && <div className="pop absolute right-6 top-16 z-0 w-64 rotate-2 rounded-xl bg-amber/90 p-4">
        <div className="flex items-center gap-3">
          <img
            src="/shifa.jpg"
            alt="Shifa"
            className="h-12 w-12 shrink-0 rounded-xl border border-espresso object-cover object-top shadow-sm"
          />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest">sticky_note.txt</p>
            <p className="text-base font-extrabold leading-tight">Hey, I'm Shifa! 👋</p>
          </div>
        </div>
        <p className="mt-2 text-xs">Software Engineer | Flutter & Web Developer</p>
        <span className="pop mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 font-mono text-[10px]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sage" /> Available for Internships / Full-Time
        </span>
      </div>}

      {standby && <StandbyCenterpiece mood={mood} setMood={setMood} reopen={() => {
        setPortfolioVersion((version) => version + 1);
        launch("portfolio", "overview");
      }} />}

      {open.portfolio && !min.portfolio && (
        <Window id="portfolio" title="Shifa_Portfolio_Explorer.exe" focused={focus === "portfolio"} onFocus={() => setFocus("portfolio")}
          onClose={() => setOpen((o) => ({ ...o, portfolio: false }))} onMin={() => setMin((m) => ({ ...m, portfolio: true }))}
          initial={{ wPct: 0.62, hPct: 0.78 }}>
          <PortfolioBody key={portfolioVersion} tab={tab} setTab={setTab} onEmpty={() => {
            setTabsEmpty(true);
            setOpen((o) => ({ ...o, portfolio: false }));
          }} />
        </Window>
      )}
      {open.terminal && !min.terminal && (
        <Window id="terminal" title="shifa@dev-os:~" focused={focus === "terminal"} onFocus={() => setFocus("terminal")}
          onClose={() => setOpen((o) => ({ ...o, terminal: false }))} onMin={() => setMin((m) => ({ ...m, terminal: true }))}
          initial={{ w: 520, h: 360, x: 0.55, y: 0.45 }}>
          <Terminal />
        </Window>
      )}
      {open.bin && !min.bin && (
        <Window id="bin" title="Recycle_Bin" focused={focus === "bin"} onFocus={() => setFocus("bin")}
          onClose={() => setOpen((o) => ({ ...o, bin: false }))} onMin={() => setMin((m) => ({ ...m, bin: true }))}
          initial={{ w: 360, h: 260, x: 0.15, y: 0.5 }}>
          <div className="grid grid-cols-3 gap-4 p-5 font-mono text-xs">
            {["3am_bugs.log", "imposter_syndrome.exe", "final_final_v7.dart", "todo_tomorrow.txt", "css_center.div"].map((f) => (
              <div key={f} className="flex flex-col items-center gap-1 text-center"><span className="text-3xl">📄</span>{f}</div>
            ))}
          </div>
        </Window>
      )}

      {/* Taskbar */}
      <div className="glass pop absolute bottom-3 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-2xl px-2 py-1.5">
        <button className="pop flex items-center gap-2 rounded-xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
          <img
            src="/shifa.jpg"
            alt="Shifa"
            className="h-5 w-5 rounded-full border border-primary-foreground/30 object-cover object-top"
          />
          <span>✨ Shifa</span>
        </button>
        {(["portfolio", "terminal", "bin"] as WinId[]).map((id) => (
          <button key={id} onClick={() => launch(id)} className={`relative rounded-xl px-3 py-1.5 font-mono text-xs hover:bg-accent ${focus === id && open[id] && !min[id] ? "bg-accent" : ""}`}>
            {id === "portfolio" ? "🗂️ Explorer" : id === "terminal" ? "⌨️ Terminal" : "🗑️ Bin"}
            {open[id] && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function SystemBar({ now, classic, setClassic, app }: { now: Date | null; classic: boolean; setClassic: (b: boolean) => void; app: string }) {
  return (
    <div className="glass relative z-[70] flex h-10 items-center justify-between border-b-[1.5px] border-espresso px-4 font-mono text-xs">
      <div className="flex items-center gap-4"><b>✨ Shifa OS v2.4</b><span className="text-muted-foreground">{app}</span></div>
      <div className="pop flex rounded-full bg-cream p-0.5">
        <button onClick={() => setClassic(false)} className={`rounded-full px-3 py-0.5 ${!classic ? "bg-espresso text-cream" : ""}`}>🖥️ OS Mode</button>
        <button onClick={() => setClassic(true)} className={`rounded-full px-3 py-0.5 ${classic ? "bg-espresso text-cream" : ""}`}>📄 Classic Fullscreen</button>
      </div>
      <div className="flex items-center gap-3">
        <span>📶</span><span>98% ⚡</span>
        <span>{now ? now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) + "  " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>
      </div>
    </div>
  );
}

type Init = { wPct?: number; hPct?: number; w?: number; h?: number; x?: number; y?: number };

function Window({ title, children, focused, onFocus, onClose, onMin, initial }: { id: WinId; title: string; children: ReactNode; focused: boolean; onFocus: () => void; onClose: () => void; onMin: () => void; initial: Init }) {
  const [max, setMax] = useState(false);
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const drag = useRef<{ dx: number; dy: number } | null>(null);

  useEffect(() => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = initial.w ?? vw * (initial.wPct ?? 0.6);
    const h = initial.h ?? vh * (initial.hPct ?? 0.7);
    const x = initial.x !== undefined ? vw * initial.x - w / 2 : (vw - w) / 2;
    const y = initial.y !== undefined ? vh * initial.y - h / 2 : 56;
    setRect({ x, y, w, h });
  }, []);

  useEffect(() => {
    const mv = (e: PointerEvent) => {
      if (!drag.current) return;
      setRect((r) => r && { ...r, x: e.clientX - drag.current!.dx, y: Math.max(40, e.clientY - drag.current!.dy) });
    };
    const up = () => (drag.current = null);
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
    return () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
  }, []);

  if (!rect) return null;
  const style = max ? { left: 0, top: 40, width: "100%", height: "calc(100% - 40px)" } : { left: rect.x, top: rect.y, width: rect.w, height: rect.h };

  return (
    <div onPointerDown={onFocus} style={style} className={`os-window absolute flex flex-col overflow-hidden transition-[width,height] duration-200 ${focused ? "z-50" : "z-40"} ${max ? "rounded-none" : ""}`}>
      <div className="titlebar flex h-9 shrink-0 cursor-grab items-center justify-between px-3 active:cursor-grabbing"
        onPointerDown={(e) => { if (!max) drag.current = { dx: e.clientX - rect.x, dy: e.clientY - rect.y }; }}
        onDoubleClick={() => setMax((m) => !m)}>
        <span className="font-mono text-xs font-semibold">{title}</span>
        <div className="flex gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <WinBtn onClick={onMin} cls="bg-amber">_</WinBtn>
          <WinBtn onClick={() => setMax((m) => !m)} cls="bg-sage text-cream">□</WinBtn>
          <WinBtn onClick={onClose} cls="bg-primary text-primary-foreground">×</WinBtn>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

function WinBtn({ children, onClick, cls }: { children: ReactNode; onClick: () => void; cls: string }) {
  return <button onClick={onClick} className={`flex h-5 w-5 items-center justify-center rounded-md border-[1.5px] border-espresso font-mono text-[11px] leading-none ${cls}`}>{children}</button>;
}

/* ---------------- Portfolio content ---------------- */

function PortfolioBody({ tab, setTab, onEmpty }: { tab: TabId; setTab: (t: TabId) => void; onEmpty?: () => void }) {
  const [tabs, setTabs] = useState<TabId[]>(TABS.map((t) => t.id));
  const close = (id: TabId) => {
    const next = tabs.filter((t) => t !== id);
    setTabs(next);
    const first = next[0];
    if (tab === id && first) setTab(first);
    if (!next.length) onEmpty?.();
  };
  const missing = TABS.filter((t) => !tabs.includes(t.id));
  useEffect(() => { if (!tabs.includes(tab)) setTabs((t) => [...t, tab]); }, [tab]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-end gap-1 border-b-[1.5px] border-espresso bg-secondary px-2 pt-2">
        {TABS.filter((t) => tabs.includes(t.id)).map((t) => (
          <div key={t.id} onClick={() => setTab(t.id)}
            className={`group flex cursor-pointer items-center gap-2 rounded-t-lg border-[1.5px] border-b-0 px-3 py-1.5 font-mono text-xs ${tab === t.id ? "-mb-[1.5px] border-espresso bg-cream" : "border-transparent hover:bg-accent"}`}>
            {t.label}
            <button aria-label={`Close ${t.label}`} onClick={(e) => { e.stopPropagation(); close(t.id); }} className="opacity-40 hover:opacity-100">×</button>
          </div>
        ))}
        {missing.length > 0 && (
          <button onClick={() => { const first = missing[0]; if (first) { setTabs((t) => [...t, first.id]); setTab(first.id); } }} className="px-3 py-1.5 font-mono text-sm hover:text-primary">+</button>
        )}
      </div>
      <div className="flex-1 overflow-auto bg-cream p-8">
        {tab === "overview" && <Overview go={setTab} />}
        {tab === "projects" && <Projects />}
        {tab === "skills" && <Skills />}
        {tab === "journal" && <Journal />}
      </div>
    </div>
  );
}

function Overview({ go }: { go: (t: TabId) => void }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-6">
        <div className="pop relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-espresso bg-amber shadow-sm">
          <img
            src="/shifa.jpg"
            alt="Shifa"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <div className="flex-1">
          <p className="font-mono text-xs text-sage">~/hello-world</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-espresso leading-snug">
            Hi, I'm Shifa. I build{" "}
            <span className="text-primary font-extrabold text-[1.12em]">seamless, fast apps</span>{" "}
            with Flutter & the Web.
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">Software Engineer transforming complex ideas into polished, scalable mobile and web experiences.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href={SOCIAL_LINKS.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="pop inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          📄 Get Resume ↗
        </a>
        <a
          href={SOCIAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="pop inline-flex items-center gap-2 rounded-lg bg-cream px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          <img src="/github.svg" alt="GitHub" className="h-4 w-4 object-contain" />
          GitHub ↗
        </a>
        <a
          href={SOCIAL_LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="pop inline-flex items-center gap-2 rounded-lg bg-cream px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          <img src="/linkedin.svg" alt="LinkedIn" className="h-4 w-4 object-contain rounded-[2px]" />
          LinkedIn ↗
        </a>
        <a
          href={SOCIAL_LINKS.email}
          className="pop inline-flex items-center gap-2 rounded-lg bg-cream px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          <img src="/app-mail.svg" alt="Contact" className="h-4 w-4 object-contain" />
          Contact Me ↗
        </a>
      </div>
      <div className="pop rounded-2xl border-[1.5px] border-espresso bg-card p-5 shadow-sm">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-primary">// about_me.txt</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </div>
        <p className="text-sm leading-relaxed text-espresso/90">
          I'm a Software Engineer with a strong focus on building intuitive, high-performance mobile apps and responsive web products. As a Flutter Developer, I specialize in architecting scalable cross-platform solutions with Riverpod, BLoC, REST APIs, and Firebase, paired with modern web development using React.js and Node.js. Beyond core engineering, I lead creative digital strategy, visual storytelling, and community initiatives—bridging clean architecture with standout user experiences.
        </p>
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-sm font-semibold">// featured_projects</h2>
          <button onClick={() => go("projects")} className="font-mono text-xs text-primary hover:underline">view all →</button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">{projects.slice(0, 2).map((p) => <ProjectCard key={p.name} p={p} />)}</div>
      </div>
    </div>
  );
}

function ProjectScreenPreview({ p }: { p: Project }) {
  if (p.type === "web" && p.image) {
    const isVeerangana = p.name === "Veerangana Web";
    return (
      <div className="flex h-44 w-32 shrink-0 flex-col overflow-hidden rounded-[12px] border-[1.5px] border-espresso bg-espresso shadow-sm">
        <div className="flex h-5 shrink-0 items-center justify-between border-b border-espresso bg-secondary px-2">
          <div className="flex items-center gap-1">
            <i className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <i className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-1 flex h-3 flex-1 items-center justify-center rounded-sm bg-espresso/10 px-1 font-mono text-[7px] text-muted-foreground truncate">
            {p.name === "Shifa OS Portfolio" ? "shifa-os.dev" : "veerangana.web"}
          </div>
        </div>
        <div className={`relative flex-1 overflow-hidden select-none ${isVeerangana ? "bg-[#782b45]" : "bg-[#2a2438]"}`}>
          <img
            src={p.image}
            alt={`${p.name} Preview`}
            className={`h-full w-full object-cover transition-transform duration-300 hover:scale-105 ${isVeerangana ? "object-center" : "object-top"}`}
          />
        </div>
      </div>
    );
  }

  if (p.image) {
    return (
      <div className="flex h-44 w-28 shrink-0 flex-col items-center rounded-[16px] border-[1.5px] border-espresso bg-espresso p-1 shadow-sm">
        <div className="mb-1 h-1 w-6 shrink-0 rounded-full bg-cream/40" />
        <div className="relative flex w-full flex-1 overflow-hidden rounded-[10px] bg-espresso select-none">
          <img
            src={p.image}
            alt={`${p.name} App Screen`}
            className={`h-full w-full object-cover transition-transform duration-300 hover:scale-105 ${p.name === "ConnectCall" ? "object-center" : "object-top"}`}
          />
        </div>
      </div>
    );
  }

  if (p.name === "ConnectCall") {
    return (
      <div className="flex h-44 w-28 shrink-0 flex-col items-center rounded-[16px] border-[1.5px] border-espresso bg-espresso p-1 shadow-sm">
        <div className="mb-1 h-1 w-6 shrink-0 rounded-full bg-cream/40" />
        <div className="relative flex w-full flex-1 flex-col justify-between overflow-hidden rounded-[10px] bg-gradient-to-b from-[#042f2e] via-[#115e59] to-[#042f2e] p-1.5 text-cream select-none">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-[7.5px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ● 04:18
            </span>
            <span className="font-mono text-[7px] text-teal-300/80">HD</span>
          </div>

          <div className="self-end rounded-md border border-teal-300/40 bg-teal-950/80 p-1 shadow-md">
            <div className="flex h-7 w-6 items-center justify-center rounded bg-teal-800/60 text-[9px]">
              👩‍💻
            </div>
          </div>

          <div className="mt-auto flex items-center justify-center gap-1.5 rounded-full bg-black/40 py-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-800/80 text-[7px]">
              🎤
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-800/80 text-[7px]">
              📷
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[7px] shadow-sm animate-pulse">
              📞
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (p.name === "Veerangana") {
    return (
      <div className="flex h-44 w-28 shrink-0 flex-col items-center rounded-[16px] border-[1.5px] border-espresso bg-espresso p-1 shadow-sm">
        <div className="mb-1 h-1 w-6 shrink-0 rounded-full bg-cream/40" />
        <div className="relative flex w-full flex-1 flex-col justify-between overflow-hidden rounded-[10px] bg-[#1a0b10] p-1.5 text-cream select-none">
          <div className="flex justify-center">
            <span className="flex items-center gap-0.5 rounded-full border border-red-500/40 bg-red-950/80 px-1.5 py-0.2 font-mono text-[7px] font-bold text-red-300">
              📍 Live GPS
            </span>
          </div>
          <div className="my-auto flex flex-col items-center justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-300/40 bg-gradient-to-br from-red-500 to-rose-700 shadow-md shadow-red-500/50 animate-pulse">
              <span className="font-mono text-[9px] font-black text-white leading-none">🚨 SOS</span>
            </div>
          </div>
          <div className="mt-auto rounded-md border border-rose-500/40 bg-rose-950/70 px-1 py-0.5 text-center">
            <span className="font-mono text-[7px] font-bold text-rose-300">1091 Helpline</span>
          </div>
        </div>
      </div>
    );
  }

  if (p.name === "Supplify") {
    return (
      <div className="flex h-44 w-28 shrink-0 flex-col items-center rounded-[16px] border-[1.5px] border-espresso bg-espresso p-1 shadow-sm">
        <div className="mb-1 h-1 w-6 shrink-0 rounded-full bg-cream/40" />
        <div className="relative flex w-full flex-1 flex-col justify-between overflow-hidden rounded-[10px] bg-[#0b1329] p-1.5 text-cream select-none">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 font-mono text-[7px] font-bold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              ⚡ Live Sync
            </span>
          </div>
          <div className="my-auto flex h-10 items-end justify-center gap-1.5 px-1">
            <div className="h-5 w-2.5 rounded-t bg-sky-400/90 shadow-xs" />
            <div className="h-9 w-2.5 rounded-t bg-emerald-400 shadow-xs" />
            <div className="h-7 w-2.5 rounded-t bg-indigo-400 shadow-xs" />
          </div>
          <div className="mt-auto rounded-md border border-sky-500/30 bg-slate-800/80 px-1 py-0.5 text-center">
            <span className="font-mono text-[7px] font-bold text-sky-300">📦 1.2k Stock</span>
          </div>
        </div>
      </div>
    );
  }

  if (p.name === "Veerangana Web") {
    return (
      <div className="flex h-44 w-32 shrink-0 flex-col overflow-hidden rounded-[12px] border-[1.5px] border-espresso bg-espresso shadow-sm">
        <div className="flex h-4 shrink-0 items-center gap-1 border-b border-espresso bg-secondary px-1.5">
          <i className="h-1.5 w-1.5 rounded-full bg-red-400" />
          <i className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-[#151119] p-2 text-cream select-none">
          <div>
            <div className="flex items-center gap-1 border-b border-rose-500/20 pb-1">
              <span className="text-[9px] leading-none">🛡️</span>
              <p className="text-[8px] font-black tracking-tight text-rose-200">Safety Portal</p>
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-1 w-14 rounded bg-white/20" />
              <div className="h-1 w-10 rounded bg-white/10" />
            </div>
          </div>
          <div className="mt-auto self-end rounded-lg border border-rose-300/40 bg-gradient-to-r from-rose-500 to-pink-600 px-1.5 py-1 shadow-md shadow-rose-500/30 animate-pulse">
            <span className="font-mono text-[7.5px] font-extrabold text-white">🤖 Sakhi AI</span>
          </div>
        </div>
      </div>
    );
  }

  // Shifa OS Portfolio (Card 6)
  return (
    <div className="flex h-44 w-32 shrink-0 flex-col overflow-hidden rounded-[12px] border-[1.5px] border-espresso bg-espresso shadow-sm">
      <div className="flex h-4 shrink-0 items-center gap-1 border-b border-espresso bg-secondary px-1.5">
        <i className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <i className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <i className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#2a2438] to-[#1c1825] p-2 text-cream select-none">
        <div>
          <div className="flex items-center gap-1 border-b border-white/15 pb-1">
            <span className="text-[9px] leading-none">🖥️</span>
            <p className="text-[8px] font-black tracking-tight text-amber-200">Shifa OS</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="h-7 w-12 rounded border border-amber/40 bg-amber/20 p-1 shadow-xs">
              <div className="h-1 w-6 rounded-full bg-amber-300/60" />
            </div>
            <span className="text-[12px]">⌨️</span>
          </div>
        </div>
        <div className="mt-auto flex items-center justify-center gap-1 rounded-full bg-white/10 py-0.5 px-1 border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="pop flex gap-4 rounded-xl bg-card p-4 transition-transform hover:-translate-y-1">
      <ProjectScreenPreview p={p} />
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <h3 className="font-bold">{p.name}</h3>
          <span className="font-mono text-[10px] text-muted-foreground">
            {p.type === "flutter" ? "📱 Flutter" : "🌐 Web"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {p.stack.map((s) => (
            <span key={s} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-3">
          <a
            href={p.github ?? SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border-[1.5px] border-espresso px-2 py-1 font-mono text-[11px] hover:bg-accent"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [f, setF] = useState<"all" | "flutter" | "web">("all");
  return (
    <div>
      <div className="pop mb-6 inline-flex rounded-full bg-cream p-1 font-mono text-xs">
        {([["all", "All"], ["flutter", "Flutter 📱"], ["web", "Web 🌐"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setF(k)} className={`rounded-full px-3 py-1 ${f === k ? "bg-espresso text-cream" : ""}`}>{l}</button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">{projects.filter((p) => f === "all" || p.type === f).map((p) => <ProjectCard key={p.name} p={p} />)}</div>
    </div>
  );
}

function Skills() {
  return (
    <div className="space-y-8">
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s, i) => (
          <div
            key={s.cat}
            className="pop flex flex-col justify-between rounded-xl bg-espresso p-4 text-cream transition-transform hover:-translate-y-0.5"
          >
            <div>
              <p className={`font-mono text-xs font-bold ${s.headerColor}`}>"{s.cat}": [</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-md border border-cream/20 bg-cream/10 px-2 py-0.5 font-mono text-[11px] font-medium text-cream/90 transition-colors hover:bg-cream/20"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 font-mono text-xs font-semibold text-cream/40">
              {i < skills.length - 1 ? "]," : "]"}
            </p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-4 font-mono text-sm font-semibold">// experience & education</h2>
        <div className="space-y-4 border-l-2 border-espresso pl-6">
          {timeline.map((t) => (
            <div key={t.title} className="relative">
              {t.featured ? (
                <span className="absolute -left-[33px] top-4 flex h-4 w-4 items-center justify-center">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-[#f87171] opacity-60" />
                  <span className="relative h-3.5 w-3.5 rounded-full border-2 border-espresso bg-[#f87171] shadow-sm" />
                </span>
              ) : (
                <span className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-espresso bg-amber" />
              )}
              <div
                className={`pop rounded-xl bg-card p-4 transition-transform hover:-translate-y-0.5 ${
                  t.featured ? "border-2 border-[#f87171] ring-2 ring-[#f87171]/20" : "border-[1.5px] border-espresso"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">{t.when}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ${
                      t.badgeType === "featured"
                        ? "border border-[#f87171]/50 bg-[#f87171]/15 text-[#e05252]"
                        : t.badgeType === "creative"
                        ? "border border-amber/50 bg-amber/25 text-espresso"
                        : "border border-sage/50 bg-sage/25 text-espresso"
                    }`}
                  >
                    {t.badge}
                  </span>
                </div>
                <div className="mt-1.5">
                  <h3 className="text-base font-extrabold text-espresso">{t.title}</h3>
                  <p className="font-mono text-xs font-semibold text-sage">{t.where}</p>
                </div>
                {t.desc && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                )}
                {t.skills && t.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.skills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-md border-[1.5px] border-espresso bg-cream px-2 py-0.5 font-mono text-[11px] font-medium text-espresso shadow-xs"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Journal() {
  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl font-extrabold"># What I'm learning & building</h1>
      {journal.map((j) => (
        <section key={j.title}>
          <p className="font-mono text-xs text-sage">{j.date}</p>
          <h2 className="text-xl font-bold">## {j.title}</h2>
          <p className="mt-1 leading-relaxed text-muted-foreground">{j.body}</p>
        </section>
      ))}
    </article>
  );
}

/* ---------------- Terminal ---------------- */

function Terminal() {
  const [lines, setLines] = useState<string[]>(["Welcome to Shifa OS terminal. Type 'help'."]);
  const [v, setV] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView();
  }, [lines]);
  const run = (c: string) => {
    const cmd = c.trim().toLowerCase();
    if (cmd === "clear") return setLines([]);
    setLines((l) => [...l, `shifa@dev-os:~$ ${c}`, ...(terminalOut[cmd] ?? [`command not found: ${cmd}`])]);
  };
  return (
    <div className="flex h-full flex-col bg-espresso p-3 font-mono text-xs text-cream">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {Object.keys(terminalOut).concat("clear").map((c) => (
          <button key={c} onClick={() => run(c)} className="rounded-md border border-cream/30 px-2 py-0.5 hover:bg-primary hover:text-primary-foreground">{c}</button>
        ))}
      </div>
      <div className="flex-1 space-y-0.5 overflow-auto">
        {lines.map((l, i) => <p key={i} className={l.startsWith("shifa@") ? "text-amber" : ""}>{l}</p>)}
        <form onSubmit={(e) => { e.preventDefault(); if (v) run(v); setV(""); }} className="flex gap-2">
          <span className="text-sage">shifa@dev-os:~$</span>
          <input autoFocus value={v} onChange={(e) => setV(e.target.value)} className="flex-1 bg-transparent outline-none" />
        </form>
        <div ref={end} />
      </div>
    </div>
  );
}

/* ---------------- Mobile: Pocket Edition ---------------- */

type MApp = null | "about" | "projects" | "skills" | "terminal" | "journal" | "contact";

function Pocket() {
  const now = useClock();
  const [app, setApp] = useState<MApp>(null);
  const grid: { id: MApp; label: string; image: string; act?: () => void }[] = [
    { id: "about", label: "About", image: "/folder-explorer.svg" },
    { id: "projects", label: "Projects", image: "/folder-projects.svg" },
    { id: "skills", label: "Skills", image: "/app-terminal.svg" },
    { id: "terminal", label: "Terminal", image: "/app-terminal.svg" },
    { id: "journal", label: "Journal", image: "/app-journal.svg" },
    { id: "contact", label: "Resume", image: "/doc-pdf.svg", act: () => window.open(SOCIAL_LINKS.resume, "_blank") },
  ];
  return (
    <div className="wallpaper relative min-h-screen overflow-hidden pb-24 font-sans">
      <div className="flex justify-between px-5 py-2 font-mono text-xs text-cream"><span>ShifaOS 5G</span><span>{now?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span><span>98% 🔋</span></div>
      <div className="pop mx-4 mt-2 rounded-2xl bg-amber p-4">
        <div className="flex items-center gap-3">
          <img
            src="/shifa.jpg"
            alt="Shifa"
            className="h-14 w-14 shrink-0 rounded-2xl border-2 border-espresso object-cover object-top shadow-sm"
          />
          <div>
            <p className="text-xl font-extrabold leading-tight">Hey, I'm Shifa! 👋</p>
            <p className="text-xs text-espresso/80">Software Engineer | Flutter & Web Developer</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={SOCIAL_LINKS.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="pop rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
          >
            📄 Get Resume ↗
          </a>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="pop inline-flex items-center gap-1.5 rounded-lg bg-cream px-3 py-1 text-xs font-semibold hover:bg-accent"
          >
            <img src="/github.svg" alt="GitHub" className="h-3.5 w-3.5 object-contain" />
            GitHub ↗
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="pop inline-flex items-center gap-1.5 rounded-lg bg-cream px-3 py-1 text-xs font-semibold hover:bg-accent"
          >
            <img src="/linkedin.svg" alt="LinkedIn" className="h-3.5 w-3.5 object-contain rounded-[2px]" />
            LinkedIn ↗
          </a>
          <a
            href={SOCIAL_LINKS.email}
            className="pop inline-flex items-center gap-1.5 rounded-lg bg-cream px-3 py-1 text-xs font-semibold hover:bg-accent"
          >
            <img src="/app-mail.svg" alt="Contact" className="h-3.5 w-3.5 object-contain" />
            Contact Me ↗
          </a>
        </div>
      </div>
      <p className="mx-5 mt-5 font-mono text-xs text-cream">featured_projects →</p>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-3">
        {projects.map((p) => (
          <div key={p.name} className="pop w-64 shrink-0 snap-center rounded-xl bg-card p-4">
            <div className="text-3xl">{p.emoji}</div>
            <p className="mt-1 font-bold">{p.name} <span className="font-mono text-[10px] text-muted-foreground">{p.type}</span></p>
            <p className="text-xs text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-3 grid grid-cols-3 gap-5">
        {grid.map((g) => (
          <button
            key={g.label}
            onClick={() => {
              if (g.act) {
                g.act();
              } else {
                setApp(g.id);
              }
            }}
            className="flex flex-col items-center gap-1"
          >
            <span className="pop flex h-16 w-16 items-center justify-center rounded-2xl bg-card p-3">
              <img src={g.image} alt={g.label} className="h-full w-full object-contain" />
            </span>
            <span className="text-xs font-semibold text-cream">{g.label}</span>
          </button>
        ))}
      </div>

      {app && (
        <div className="fixed inset-0 z-50 flex flex-col bg-cream animate-in slide-in-from-bottom duration-300">
          <div className="sticky top-0 border-b-[1.5px] border-espresso bg-secondary px-4 py-3">
            <button onClick={() => setApp(null)} className="font-mono text-sm font-semibold">‹ Back to Home</button>
          </div>
          <div className="flex-1 overflow-auto p-5 pb-28">
            {app === "about" && <Overview go={() => setApp("projects")} />}
            {app === "projects" && <Projects />}
            {app === "skills" && <Skills />}
            {app === "journal" && <Journal />}
            {app === "terminal" && <div className="h-[70vh]"><Terminal /></div>}
            {app === "contact" && (
              <div className="space-y-3 font-mono text-sm">
                <a
                  href={SOCIAL_LINKS.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop flex items-center justify-between rounded-lg bg-primary p-3 font-bold text-primary-foreground"
                >
                  <span>📄 Get Resume (Google Drive)</span>
                  <span>↗</span>
                </a>
                <a
                  href={SOCIAL_LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop flex items-center justify-between rounded-lg bg-card p-3 hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <img src="/github.svg" alt="GitHub" className="h-4 w-4 object-contain" />
                    <span>GitHub: @Shifakhan1929</span>
                  </span>
                  <span>↗</span>
                </a>
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pop flex items-center justify-between rounded-lg bg-card p-3 hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <img src="/linkedin.svg" alt="LinkedIn" className="h-4 w-4 object-contain rounded-[2px]" />
                    <span>LinkedIn: /in/shifakhan2</span>
                  </span>
                  <span>↗</span>
                </a>
                <a
                  href={SOCIAL_LINKS.email}
                  className="pop flex items-center justify-between rounded-lg bg-card p-3 hover:bg-accent"
                >
                  <span className="flex items-center gap-2">
                    <img src="/app-mail.svg" alt="Email" className="h-4 w-4 object-contain" />
                    <span>Email: shifakhan1929@gmail.com</span>
                  </span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="glass pop fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 gap-1 rounded-2xl p-1.5">
        {([[null, "🏠"], ["projects", "🚀"], ["terminal", "⌨️"], ["contact", "✉️"]] as [MApp, string][]).map(([id, e]) => (
          <button key={e} onClick={() => setApp(id)} className={`rounded-xl px-4 py-2 text-xl ${app === id ? "bg-accent" : ""}`}>{e}</button>
        ))}
      </div>
    </div>
  );
}
