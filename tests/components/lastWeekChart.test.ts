import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import LastWeekChart from "../../src/routes/overview/components/LastWeekChart.svelte";

describe("LastWeekChart", () => {
  it("renders the heading and 7 weekday cells when not loading", () => {
    render(LastWeekChart, { props: { workoutSessions: [], loading: false } });
    expect(screen.getByText("Last week")).toBeInTheDocument();
  });
});
