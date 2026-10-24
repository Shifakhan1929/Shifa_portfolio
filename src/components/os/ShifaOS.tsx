import { useEffect, useRef, useState, type ReactNode } from "react";
import { projects, skills, timeline, journal, terminalOut, type Project } from "./data";

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
  const [toast, setToast] = useState(true);
  const [tab, setTab] = useState<TabId>("overview");

  const launch = (id: WinId, t?: TabId) => {
    setOpen((o) => ({ ...o, [id]: true }));
    setMin((m) => ({ ...m, [id]: false }));
    setFocus(id);
    if (t) setTab(t);
  };

  const icons: { label: string; emoji: string; act: () => void }[] = [
    { label: "Portfolio_Explorer", emoji: "🗂️", act: () => launch("portfolio", "overview") },
    { label: "Projects", emoji: "🚀", act: () => launch("portfolio", "projects") },
    { label: "Terminal_CLI", emoji: "⌨️", act: () => launch("terminal") },
    { label: "Resume.pdf", emoji: "📄", act: () => {} },
    { label: "Learning_Journal", emoji: "📓", act: () => launch("portfolio", "journal") },
    { label: "Contact_Me", emoji: "✉️", act: () => launch("terminal") },
    { label: "Recycle_Bin", emoji: "🗑️", act: () => launch("bin") },
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

      <div className="absolute left-4 top-14 z-0 flex flex-col gap-3">
        {icons.map((i) => (
          <button key={i.label} onDoubleClick={i.act} onClick={i.act} className="group flex w-24 flex-col items-center gap-1 rounded-lg p-2 hover:bg-card/30">
            <span className="pop flex h-12 w-12 items-center justify-center rounded-xl bg-card text-2xl transition-transform group-hover:-translate-y-0.5">{i.emoji}</span>
            <span className="rounded bg-espresso/60 px-1.5 font-mono text-[10px] text-cream">{i.label}</span>
          </button>
        ))}
      </div>

      <div className="pop absolute right-6 top-16 z-0 w-64 rotate-2 rounded-xl bg-amber/90 p-4">
        <p className="font-mono text-[10px] uppercase tracking-widest">sticky_note.txt</p>
        <p className="mt-2 text-lg font-extrabold leading-tight">Hey, I'm Shifa! Welcome to my digital space 👋</p>
        <p className="mt-1 text-sm">4th Year SE Student | Flutter & Web Dev</p>
        <span className="pop mt-3 inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 font-mono text-[10px]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sage" /> Available for Internships / Full-Time
        </span>
      </div>

      {open.portfolio && !min.portfolio && (
        <Window id="portfolio" title="Shifa_Portfolio_Explorer.exe" focused={focus === "portfolio"} onFocus={() => setFocus("portfolio")}
          onClose={() => setOpen((o) => ({ ...o, portfolio: false }))} onMin={() => setMin((m) => ({ ...m, portfolio: true }))}
          initial={{ wPct: 0.62, hPct: 0.78 }}>
          <PortfolioBody tab={tab} setTab={setTab} />
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
        <button className="pop rounded-xl bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">✨ Shifa</button>
        {(["portfolio", "terminal", "bin"] as WinId[]).map((id) => (
          <button key={id} onClick={() => launch(id)} className={`relative rounded-xl px-3 py-1.5 font-mono text-xs hover:bg-accent ${focus === id && open[id] && !min[id] ? "bg-accent" : ""}`}>
            {id === "portfolio" ? "🗂️ Explorer" : id === "terminal" ? "⌨️ Terminal" : "🗑️ Bin"}
            {open[id] && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />}
          </button>
        ))}
      </div>

      {toast && (
        <div className="pop absolute bottom-20 right-5 z-[60] w-72 rounded-xl bg-card p-3 text-sm animate-in slide-in-from-right">
          <div className="flex items-start justify-between gap-2">
            <p>💡 <b>Tip:</b> Drag windows around, switch tabs, or maximize for full-screen reading!</p>
            <button onClick={() => setToast(false)} className="font-mono text-xs">×</button>
          </div>
        </div>
      )}
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

function PortfolioBody({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  const [tabs, setTabs] = useState<TabId[]>(TABS.map((t) => t.id));
  const close = (id: TabId) => {
    const next = tabs.filter((t) => t !== id);
    setTabs(next);
    if (tab === id && next.length) setTab(next[0]);
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
            <button onClick={(e) => { e.stopPropagation(); close(t.id); }} className="opacity-40 hover:opacity-100">×</button>
          </div>
        ))}
        {missing.length > 0 && (
          <button onClick={() => { setTabs((t) => [...t, missing[0].id]); setTab(missing[0].id); }} className="px-3 py-1.5 font-mono text-sm hover:text-primary">+</button>
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
        <div className="pop flex h-24 w-24 items-center justify-center rounded-2xl bg-amber text-5xl">👩‍💻</div>
        <div className="flex-1">
          <p className="font-mono text-xs text-sage">~/hello-world</p>
          <h1 className="text-4xl font-extrabold tracking-tight">Hi, I'm Shifa. I build <span className="text-primary">cozy, fast apps</span> with Flutter & the Web.</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">4th-year Software Engineering student turning ideas into polished mobile and web experiences.</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button className="pop rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">⬇ Download Resume</button>
        <button className="pop rounded-lg bg-cream px-4 py-2 text-sm font-semibold hover:bg-accent">GitHub</button>
        <button className="pop rounded-lg bg-cream px-4 py-2 text-sm font-semibold hover:bg-accent">LinkedIn</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[["12+", "Projects shipped"], ["2", "Internships"], ["500+", "Commits this year"]].map(([n, l]) => (
          <div key={l} className="pop rounded-xl bg-card p-4"><p className="text-3xl font-extrabold">{n}</p><p className="font-mono text-xs text-muted-foreground">{l}</p></div>
        ))}
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

function ProjectCard({ p }: { p: Project }) {
  return (
    <div className="pop flex gap-4 rounded-xl bg-card p-4 transition-transform hover:-translate-y-1">
      {p.type === "flutter" ? (
        <div className="flex h-36 w-20 shrink-0 flex-col items-center rounded-[14px] border-[1.5px] border-espresso bg-espresso p-1">
          <div className="mb-1 h-1 w-6 rounded-full bg-cream/40" />
          <div className="flex w-full flex-1 items-center justify-center rounded-[10px] bg-amber/80 text-3xl">{p.emoji}</div>
        </div>
      ) : (
        <div className="flex h-24 w-32 shrink-0 flex-col overflow-hidden rounded-lg border-[1.5px] border-espresso">
          <div className="flex h-3 gap-0.5 bg-secondary px-1 py-0.5"><i className="h-1.5 w-1.5 rounded-full bg-primary" /><i className="h-1.5 w-1.5 rounded-full bg-amber" /></div>
          <div className="flex flex-1 items-center justify-center bg-sage/30 text-3xl">{p.emoji}</div>
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2"><h3 className="font-bold">{p.name}</h3><span className="font-mono text-[10px] text-muted-foreground">{p.type === "flutter" ? "📱 Flutter" : "🌐 Web"}</span></div>
        <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
        <div className="mt-2 flex flex-wrap gap-1">{p.stack.map((s) => <span key={s} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[10px]">{s}</span>)}</div>
        <div className="mt-auto flex gap-2 pt-3">
          <button className="rounded-md border-[1.5px] border-espresso px-2 py-1 font-mono text-[11px] hover:bg-accent">GitHub</button>
          <button className="rounded-md border-[1.5px] border-espresso bg-sage px-2 py-1 font-mono text-[11px] text-cream">Live Demo ↗</button>
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
      <div className="grid gap-4 lg:grid-cols-3">
        {skills.map((s, i) => (
          <div key={s.cat} className="pop rounded-xl bg-card p-4">
            <p className={`font-mono text-xs font-semibold ${["text-primary", "text-sage", "text-amber"][i]}`}>"{s.cat}": [</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{s.items.map((it) => <span key={it} className="rounded-md border-[1.5px] border-espresso bg-cream px-2 py-0.5 text-xs font-medium">{it}</span>)}</div>
            <p className="mt-2 font-mono text-xs">]</p>
          </div>
        ))}
      </div>
      <div>
        <h2 className="mb-4 font-mono text-sm font-semibold">// experience & education</h2>
        <div className="space-y-4 border-l-[1.5px] border-espresso pl-6">
          {timeline.map((t) => (
            <div key={t.title} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-[1.5px] border-espresso bg-primary" />
              <p className="font-mono text-xs text-muted-foreground">{t.when}</p>
              <p className="font-bold">{t.title}</p>
              <p className="text-sm text-muted-foreground">{t.where}</p>
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
  useEffect(() => end.current?.scrollIntoView(), [lines]);
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
  const grid: { id: MApp; label: string; emoji: string }[] = [
    { id: "about", label: "About", emoji: "👩‍💻" }, { id: "projects", label: "Projects", emoji: "🚀" },
    { id: "skills", label: "Skills", emoji: "🛠️" }, { id: "terminal", label: "Terminal", emoji: "⌨️" },
    { id: "journal", label: "Journal", emoji: "📓" }, { id: "contact", label: "Resume", emoji: "📄" },
  ];
  return (
    <div className="wallpaper relative min-h-screen overflow-hidden pb-24 font-sans">
      <div className="flex justify-between px-5 py-2 font-mono text-xs text-cream"><span>ShifaOS 5G</span><span>{now?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span><span>98% 🔋</span></div>
      <div className="pop mx-4 mt-2 rounded-2xl bg-amber p-4">
        <p className="text-xl font-extrabold">Hey, I'm Shifa! 👋</p>
        <p className="text-sm">4th Year SE Student | Flutter & Web Dev</p>
        <div className="mt-3 flex gap-2">
          {["Resume", "GitHub", "Contact"].map((b) => <button key={b} className="pop rounded-lg bg-cream px-3 py-1 text-xs font-semibold">{b}</button>)}
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
          <button key={g.label} onClick={() => setApp(g.id)} className="flex flex-col items-center gap-1">
            <span className="pop flex h-16 w-16 items-center justify-center rounded-2xl bg-card text-3xl">{g.emoji}</span>
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
            {app === "contact" && <div className="space-y-3 font-mono text-sm">{terminalOut.contact.map((c) => <p key={c} className="pop rounded-lg bg-card p-3">{c}</p>)}</div>}
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
