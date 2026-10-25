import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ShifaOS } from "@/components/os/ShifaOS";
import { StandbyCenterpiece } from "@/components/os/StandbyCenterpiece";

afterEach(() => { cleanup(); vi.useRealTimers(); });
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
});