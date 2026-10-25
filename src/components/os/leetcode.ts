export const LEETCODE_USERNAME = "shifa_19";
export const LEETCODE_PROFILE = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;
export type Calendar = Record<string, number>;
export type CodingStats = {
  totalSolved: number; easySolved: number; mediumSolved: number; hardSolved: number;
  submissions: number; activeDays: number; maxStreak: number; calendar: Calendar;
};
export const FALLBACK_STATS: CodingStats = {
  totalSolved: 155, easySolved: 103, mediumSolved: 48, hardSolved: 4,
  submissions: 288, activeDays: 151, maxStreak: 33, calendar: {},
};
export const DIFFICULTIES = [
  { key: "easySolved", label: "Easy", total: 974, className: "lc-easy" },
  { key: "mediumSolved", label: "Med.", total: 2135, className: "lc-medium" },
  { key: "hardSolved", label: "Hard", total: 986, className: "lc-hard" },
] as const;

export function parseCalendar(raw: unknown): Calendar | null {
  try {
    const input: unknown = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!input || typeof input !== "object" || Array.isArray(input)) return null;
    const calendar: Calendar = {};
    for (const [key, count] of Object.entries(input)) {
      const stamp = /^\d+$/.test(key) ? Number(key) * 1000 : Date.parse(key);
      if (!Number.isFinite(stamp) || typeof count !== "number" || !Number.isFinite(count) || count < 0) continue;
      const date = new Date(stamp).toISOString().slice(0, 10);
      calendar[date] = (calendar[date] ?? 0) + Math.floor(count);
    }
    return calendar;
  } catch { return null; }
}

export function calendarStats(calendar: Calendar, start: string, end: string) {
  const days = Object.entries(calendar).filter(([day, count]) => day >= start && day <= end && count > 0).sort(([a], [b]) => a.localeCompare(b));
  let streak = 0, maxStreak = 0, previous = 0;
  for (const [day] of days) {
    const stamp = Date.parse(day);
    streak = stamp - previous === 86400000 ? streak + 1 : 1;
    previous = stamp;
    maxStreak = Math.max(maxStreak, streak);
  }
  return { submissions: days.reduce((sum, [, count]) => sum + count, 0), activeDays: days.length, maxStreak };
}

export function normalizeStats(raw: unknown, previous: CodingStats): { stats: CodingStats; hasCalendar: boolean } | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (data.status !== "success" && !(data.status === undefined && typeof data.solvedProblem === "number")) return null;
  const value = (key: string, alias?: string) => {
    const n = data[key] ?? (alias ? data[alias] : undefined);
    return typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.floor(n) : null;
  };
  const totalSolved = value("totalSolved", "solvedProblem");
  const easySolved = value("easySolved"), mediumSolved = value("mediumSolved"), hardSolved = value("hardSolved");
  if (totalSolved === null || easySolved === null || mediumSolved === null || hardSolved === null) return null;
  const calendar = parseCalendar(data.submissionCalendar);
  return { stats: { ...previous, totalSolved, easySolved, mediumSolved, hardSolved, calendar: calendar ?? previous.calendar }, hasCalendar: calendar !== null };
}

export function activityMonths(now: Date) {
  return Array.from({ length: 12 }, (_, index) => {
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + index, 1));
    const days = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0)).getUTCDate();
    return { label: start.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }), start, days };
  });
}

// Illustrative fallback, never presented as fetched submission history.
export function previewCalendar(year: number): Calendar {
  const calendar: Calendar = {};
  let index = 0;
  for (const [month, days] of [[0, 20], [2, 20], [3, 20], [4, 31], [5, 22], [7, 15], [8, 15], [9, 8]]) {
    if (month === undefined || days === undefined) continue;
    for (let day = 1; day <= days; day++) {
      calendar[new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10)] = index++ < 137 ? 2 : 1;
    }
  }
  return calendar;
}