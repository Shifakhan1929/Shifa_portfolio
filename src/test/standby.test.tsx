import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ShifaOS } from "@/components/os/ShifaOS";
import { StandbyCenterpiece } from "@/components/os/StandbyCenterpiece";

beforeAll(() => { Element.prototype.scrollIntoView = vi.fn(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });
const centerpiece = () => screen.queryByRole("region", { name: "Shifa Standby Centerpiece" });
function closePortfolio() {
  const bar = screen.getByText("Shifa_Portfolio_Explorer.exe").parentElement;
  if (!bar) throw new Error("Missing portfolio titlebar");
  fireEvent.click(within(bar).getByRole("button", { name: "×" }));
}

describe("Desktop standby", () => {
  it("appears when all windows close but not while terminal is open", () => {
    render(<ShifaOS />);
    fireEvent.click(screen.getByRole("button", { name: "⌨️ Terminal" }));
    closePortfolio();
    expect(centerpiece()).not.toBeInTheDocument();
    const bar = screen.getByText("shifa@dev-os:~").parentElement;
    if (!bar) throw new Error("Missing terminal titlebar");
    fireEvent.click(within(bar).getByRole("button", { name: "×" }));
    expect(centerpiece()).toBeInTheDocument();
  });

  it("appears when all four portfolio tabs close and restores all four on reopening", () => {
    render(<ShifaOS />);
    for (const label of ["🏠 Overview.me", "🚀 Projects.app", "🛠️ Skills_&_Exp.json", "📓 Journal.md"]) {
      fireEvent.click(screen.getByRole("button", { name: `Close ${label}` }));
    }
    expect(centerpiece()).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Re-open Portfolio" }));
    expect(centerpiece()).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Close / })).toHaveLength(4);
  });

  it("enters idle at exactly eight seconds and resets the timer on activity", () => {
    vi.useFakeTimers();
    const setMood = vi.fn();
    render(<StandbyCenterpiece mood="surprised" setMood={setMood} reopen={vi.fn()} />);
    act(() => vi.advanceTimersByTime(7999));
    expect(setMood).not.toHaveBeenCalled();
    fireEvent.pointerMove(window);
    act(() => vi.advanceTimersByTime(7999));
    expect(setMood).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(setMood).toHaveBeenCalledWith("idle");
  });

  it("clears the tab-empty standby when another app launches", () => {
    render(<ShifaOS />);
    while (screen.queryAllByRole("button", { name: /^Close / }).length) {
      fireEvent.click(screen.getAllByRole("button", { name: /^Close / })[0]);
    }
    expect(centerpiece()).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "⌨️ Terminal" }));
    expect(centerpiece()).not.toBeInTheDocument();
    expect(screen.getByText("shifa@dev-os:~")).toBeInTheDocument();
  });

  it("wakes an idle reaction on scrolling and removes timers on unmount", () => {
    vi.useFakeTimers();
    const setMood = vi.fn();
    const { unmount } = render(<StandbyCenterpiece mood="idle" setMood={setMood} reopen={vi.fn()} />);
    setMood.mockClear();
    fireEvent.scroll(window);
    expect(setMood).toHaveBeenCalledWith("surprised");
    unmount();
    setMood.mockClear();
    act(() => vi.advanceTimersByTime(8000));
    expect(setMood).not.toHaveBeenCalled();
  });

  it("shows phone standby after closing an app and reopens the portfolio", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    render(<ShifaOS />);
    expect(centerpiece()).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /About/ }));
    fireEvent.click(screen.getByRole("button", { name: "‹ Back to Home" }));
    expect(centerpiece()).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Re-open Portfolio" }));
    expect(centerpiece()).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "‹ Back to Home" })).toBeInTheDocument();
  });
});