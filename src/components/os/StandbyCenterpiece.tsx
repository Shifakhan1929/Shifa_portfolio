import { useEffect } from "react";
import { Mail, RotateCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOCIAL_LINKS } from "./data";

export type Mood = "surprised" | "hire" | "resume" | "bin" | "reopen" | "idle";
export const IDLE_DELAY = 8000;
const reactions: Record<Mood, { badge: string; label: string; text: string }> = {
  surprised: { badge: "😲", label: "Surprised", text: "Whoa, you closed every window! 😄 Admiring the clean desktop, or ready to talk about how I can build fast Flutter & Web apps for your team?" },
  hire: { badge: "🤩", label: "Hire Me", text: "Now THAT is my favorite button on this entire OS! 🚀 Click it—I’m currently open for Software Engineer & Flutter roles!" },
  resume: { badge: "😎", label: "Resume", text: "Good choice! Inside: 2 dev roles, a live Google Play Store app, FiboHack 1.0 Winner, and 150+ LeetCode problems—all on one page." },
  bin: { badge: "🤫", label: "Bin", text: "Hey, careful in there! That’s where I threw away unnecessary Flutter widget rebuilds and my old node_modules." },
  reopen: { badge: "🙌", label: "Reopen", text: "Missed my projects already? Let’s fire Shifa_Portfolio_Explorer.exe right back up!" },
  idle: { badge: "☕", label: "Idle", text: "Still there? Grab a coffee, reopen my portfolio window below, or test out the Terminal CLI!" },
};

export function StandbyCenterpiece({ mood, setMood, reopen }: { mood: Mood; setMood: (mood: Mood) => void; reopen: () => void }) {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setMood("idle"), IDLE_DELAY);
    };
    reset();
    window.addEventListener("pointermove", reset);
    window.addEventListener("pointerdown", reset);
    window.addEventListener("keydown", reset);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", reset);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
    };
  }, [setMood]);

  const reaction = reactions[mood];
  return (
    <section aria-label="Shifa Standby Centerpiece" data-mood={mood} className="standby-centerpiece absolute inset-y-12 left-32 right-5 z-10 flex flex-col items-center justify-center gap-4 overflow-y-auto py-6 text-center">
      <div className="standby-bubble relative flex min-h-28 w-full max-w-lg items-center justify-center rounded-lg border-[1.5px] border-espresso bg-card px-5 py-4 shadow-sm">
        <p aria-live="polite" className="text-sm font-medium leading-relaxed">{reaction.text}</p>
      </div>
      <div className="relative mt-2 shrink-0">
        <div className="standby-frame h-40 w-40 overflow-hidden rounded-lg border-4 bg-card p-1">
          <img src="/shifa.jpg" alt="Shifa" className="h-full w-full rounded object-cover object-top" />
        </div>
        <span key={mood} aria-label={reaction.label} className="standby-badge pop absolute -right-4 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream text-2xl">{reaction.badge}</span>
      </div>
      <h1 className="text-xl font-extrabold text-cream">Shifa <span className="font-normal">is on standby.</span></h1>
      <p className="flex max-w-full items-center justify-center gap-2 rounded-full border border-cream/30 bg-espresso/80 px-3 py-2 text-xs font-medium text-cream">
        <span className="h-2 w-2 shrink-0 rounded-full bg-sage" />
        Open to Work — Software Engineer | Flutter &amp; Web
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button onClick={reopen} onPointerEnter={() => setMood("reopen")} onFocus={() => setMood("reopen")} className="pop h-10 font-bold"><RotateCw /> Re-open Portfolio</Button>
        <Button asChild variant="secondary" className="pop h-10 bg-cream" onPointerEnter={() => setMood("resume")} onFocus={() => setMood("resume")}>
          <a href={SOCIAL_LINKS.resume} target="_blank" rel="noopener noreferrer"><FileText /> View Resume</a>
        </Button>
        <Button asChild className="pop standby-contact h-10 font-bold" onPointerEnter={() => setMood("hire")} onFocus={() => setMood("hire")}>
          <a href={SOCIAL_LINKS.email}><Mail /> Hire / Contact Shifa</a>
        </Button>
      </div>
      <div aria-label="Mood previews" className="flex flex-wrap justify-center gap-1">
        {(["surprised", "hire", "resume", "bin", "idle"] as Mood[]).map((id) => (
          <Button key={id} variant="ghost" size="sm" aria-pressed={mood === id} onClick={() => setMood(id)} className="standby-chip h-7 px-2 font-mono text-[10px] text-cream">
            {reactions[id].badge} {reactions[id].label}
          </Button>
        ))}
      </div>
    </section>
  );
}