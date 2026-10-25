import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Code2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activityMonths, calendarStats, DIFFICULTIES, FALLBACK_STATS, LEETCODE_PROFILE, LEETCODE_USERNAME, normalizeStats, previewCalendar } from "./leetcode";

export function LeetCodeActivity() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [sync, setSync] = useState<"loading" | "live" | "partial" | "offline">("loading");
  const [now, setNow] = useState(new Date("2026-10-25T00:00:00Z"));
  useEffect(() => {
    setNow(new Date());
    const controller = new AbortController();
    let busy = false;
    async function update() {
      if (busy) return;
      busy = true;
      const urls = [`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`, `https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`];
      try {
        for (const url of urls) {
          try {
            const response = await fetch(url, { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]) });
            if (!response.ok) continue;
            const normalized = normalizeStats(await response.json(), FALLBACK_STATS);
            if (!normalized) continue;
            if (!controller.signal.aborted) {
              setStats((previous) => ({ ...normalized.stats, calendar: normalized.hasCalendar ? normalized.stats.calendar : previous.calendar }));
              setSync(normalized.hasCalendar ? "live" : "partial");
            }
            return;
          } catch { if (controller.signal.aborted) return; }
        }
        if (!controller.signal.aborted) setSync("offline");
      } finally { busy = false; }
    }
    void update();
    const interval = setInterval(() => { if (!document.hidden) void update(); }, 300000);
    return () => { controller.abort(); clearInterval(interval); };
  }, []);

  const months = activityMonths(now);
  const first = months[0];
  const end = now.toISOString().slice(0, 10);
  const calendar = sync === "live" ? stats.calendar : Object.keys(stats.calendar).length ? stats.calendar : previewCalendar(now.getUTCFullYear());
  const totals = Object.keys(stats.calendar).length && first ? calendarStats(stats.calendar, first.start.toISOString().slice(0, 10), end) : stats;

  return (
    <section aria-label="LeetCode coding activity" className="lc-dashboard min-w-0">
      <h2 className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm font-semibold text-foreground">
        <Code2 className="h-4 w-4 text-sage" /> // live_coding_activity <span className="text-xs font-normal text-muted-foreground">(LeetCode: @{LEETCODE_USERNAME})</span>
      </h2>
      <div className="lc-top-grid grid gap-3">
        <article aria-label="Solved problems" className="lc-card flex min-w-0 items-center justify-between gap-3 rounded-lg p-4">
          <div className="lc-progress relative h-40 w-40 shrink-0">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle className="lc-ring-track" cx="80" cy="80" r="68" fill="none" strokeWidth="5" />
              {DIFFICULTIES.map((difficulty, index) => (
                <circle key={difficulty.key} className={difficulty.className} cx="80" cy="80" r="68" fill="none" strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray={`${Math.max(1, stats[difficulty.key] / difficulty.total * 31)} 100`} strokeDashoffset={-index * 33.33} />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="flex items-baseline gap-1"><strong className="text-3xl font-bold tabular-nums">{stats.totalSolved}</strong><span className="lc-subtle text-xs">/4095</span></p>
              <p className="lc-solved mt-1 flex items-center gap-1 text-sm"><Check className="h-4 w-4" /> Solved</p>
              <p className="lc-subtle mt-3 text-[11px]">25 Attempting</p>
            </div>
          </div>
          <div className="flex min-w-20 flex-1 flex-col gap-2">
            {DIFFICULTIES.map((difficulty) => <div key={difficulty.key} className={`lc-stat ${difficulty.className} rounded-md px-3 py-2 text-center`}><p className="text-xs font-semibold">{difficulty.label}</p><p className="lc-count mt-0.5 text-xs tabular-nums">{stats[difficulty.key]}<span className="lc-subtle">/{difficulty.total}</span></p></div>)}
          </div>
        </article>
        <article aria-label="LeetCode badges" className="lc-card min-w-0 rounded-lg p-4">
          <div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Badges <span className="lc-subtle ml-1">2</span></h3><Button asChild variant="ghost" size="icon" className="h-6 w-6"><a href={LEETCODE_PROFILE} target="_blank" rel="noopener noreferrer" aria-label="Open Shifa’s LeetCode profile"><ArrowUpRight /></a></Button></div>
          <div className="flex justify-center gap-6 py-3">
            {[50, 100].map((days) => <div key={days} className="text-center"><div className={`lc-badge ${days === 50 ? "lc-badge-green" : "lc-badge-blue"} mx-auto flex h-20 w-[72px] flex-col items-center justify-center`}><Trophy className="h-5 w-5" /><strong className="mt-1 font-mono text-lg">{days}</strong><span className="text-[7px] font-bold">DAYS</span></div><p className="lc-subtle mt-1 text-[10px]">{days} Days Badge</p></div>)}
          </div>
          <p className="lc-subtle text-[10px]">Most Recent Badge →</p><p className="mt-1 text-xs font-bold">100 Days Badge 2026</p>
        </article>
      </div>
      <article aria-label="Submission heatmap" className="lc-card mt-3 min-w-0 rounded-lg p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-sm"><strong className="tabular-nums">{totals.submissions}</strong> submissions <span className="lc-subtle text-xs">in the past one year</span></p><span className={`lc-sync mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[9px] ${sync === "live" ? "lc-solved" : "lc-subtle"}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{sync === "live" ? "Live Sync" : sync === "partial" ? "Live stats · sample calendar" : sync === "loading" ? "Syncing · saved stats" : "Saved stats · offline"} (@{LEETCODE_USERNAME})</span></div>
          <div className="lc-subtle flex flex-wrap items-center gap-2 text-[10px]"><span>Total active days: <b className="lc-count">{totals.activeDays}</b></span><span> | </span><span>Max streak: <b className="lc-count">{totals.maxStreak}</b></span><select aria-label="Activity period" className="lc-period rounded-md px-2 py-1"><option>Current</option></select></div>
        </div>
        <div className="mt-4 overflow-x-auto pb-2">
          <div className="lc-heatmap flex min-w-[600px] justify-between gap-2">
            {months.map((month) => <div key={month.start.toISOString()} className="min-w-0"><div className="lc-month-grid grid grid-flow-col grid-rows-7 gap-[3px]">
              {Array.from({ length: month.start.getUTCDay() }, (_, i) => <span key={`blank-${i}`} className="lc-cell invisible" />)}
              {Array.from({ length: month.days }, (_, index) => {
                const date = new Date(Date.UTC(month.start.getUTCFullYear(), month.start.getUTCMonth(), index + 1)).toISOString().slice(0, 10);
                const count = date <= end ? calendar[date] ?? 0 : 0;
                const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4;
                return <span key={date} className={`lc-cell lc-level-${level}`} title={`${date}: ${count} submissions${sync !== "live" && !Object.keys(stats.calendar).length ? " (sample)" : ""}`} />;
              })}
            </div><p className="lc-subtle mt-2 text-center text-[9px]">{month.label}</p></div>)}
          </div>
        </div>
        <div className="lc-subtle mt-1 flex items-center justify-end gap-1 text-[9px]"><span className="mr-1">Less</span>{[0,1,2,3,4].map((level) => <span key={level} className={`lc-cell lc-level-${level}`} />)}<span className="ml-1">More</span></div>
      </article>
    </section>
  );
}