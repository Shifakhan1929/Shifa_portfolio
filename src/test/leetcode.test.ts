import { describe, expect, it } from "vitest";
import { activityMonths, calendarStats, DIFFICULTIES, FALLBACK_STATS, normalizeStats, parseCalendar, previewCalendar } from "@/components/os/leetcode";

describe("LeetCode data", () => {
  it("uses the supplied solved counts and problem totals immediately", () => {
    expect([FALLBACK_STATS.totalSolved, FALLBACK_STATS.easySolved, FALLBACK_STATS.mediumSolved, FALLBACK_STATS.hardSolved]).toEqual([155, 103, 48, 4]);
    expect(DIFFICULTIES.map((d) => d.total)).toEqual([974, 2135, 986]);
    expect(DIFFICULTIES.reduce((sum, d) => sum + d.total, 0)).toBe(4095);
  });
  it("uses the supplied activity counts", () => {
    expect([FALLBACK_STATS.submissions, FALLBACK_STATS.activeDays, FALLBACK_STATS.maxStreak]).toEqual([288, 151, 33]);
    expect(calendarStats(previewCalendar(2026), "2025-11-01", "2026-10-31")).toEqual({ submissions: 288, activeDays: 151, maxStreak: 33 });
  });
  it("parses timestamp calendars and computes totals and consecutive-day streaks", () => {
    const calendar = parseCalendar(JSON.stringify({ "1767225600": 3, "1767312000": 2, "1767571200": 1 }));
    expect(calendar).toEqual({ "2026-01-01": 3, "2026-01-02": 2, "2026-01-05": 1 });
    expect(calendarStats(calendar ?? {}, "2026-01-01", "2026-12-31")).toEqual({ submissions: 6, activeDays: 3, maxStreak: 2 });
  });
  it("updates success responses and handles the backup field without a calendar", () => {
    const live = normalizeStats({ status: "success", totalSolved: 156, easySolved: 104, mediumSolved: 48, hardSolved: 4, submissionCalendar: { "1767225600": 2 } }, FALLBACK_STATS);
    expect(live?.stats.totalSolved).toBe(156);
    expect(live?.hasCalendar).toBe(true);
    const backup = normalizeStats({ solvedProblem: 157, easySolved: 104, mediumSolved: 49, hardSolved: 4 }, FALLBACK_STATS);
    expect(backup?.stats.totalSolved).toBe(157);
    expect(backup?.hasCalendar).toBe(false);
    expect(normalizeStats({ status: "error", totalSolved: 0 }, FALLBACK_STATS)).toBeNull();
    expect(parseCalendar("invalid")).toBeNull();
  });
  it("shows the requested November to October rolling year in October", () => {
    expect(activityMonths(new Date("2026-10-25")).map((m) => m.label)).toEqual(["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]);
  });
});