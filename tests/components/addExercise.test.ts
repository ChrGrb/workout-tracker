import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

const EXERCISE_TYPES = [
  { id: "t-legs", name: "Squat", category: "WEIGHT", area: "LEGS", description: null },
  { id: "t-chest", name: "Bench Press", category: "WEIGHT", area: "CHEST", description: null },
  { id: "t-other", name: "Plank", category: "WEIGHT", area: null, description: null },
];

// Feed the page canned query data instead of a live Zero client. The page runs
// two queries (exercise types + equipment); only the exercise-type one should
// get the fixture rows.
const queryNameOf = (query: unknown): string =>
  (query as { query?: { queryName?: string } })?.query?.queryName ?? "";

vi.mock("$lib/zero/z.svelte", () => ({
  getZ: () => ({
    createQuery: (query: unknown) => ({
      data: queryNameOf(query) === "equipment" ? [] : EXERCISE_TYPES,
    }),
  }),
  getZOrUndefined: () => undefined,
  initZero: () => {},
  closeZero: () => {},
}));

// Stub the Skeleton-dependent children so we test the page's own logic.
vi.mock(
  "$/routes/overview/session/[sessionId]/addExercise/components/ExerciseTypeRadioButton.svelte",
  () => import("../mocks/StubExerciseTypeRadioButton.svelte"),
);
vi.mock(
  "$/routes/overview/session/[sessionId]/addExercise/components/AddExerciseTypeDrawer.svelte",
  () => import("../mocks/StubEmpty.svelte"),
);

import Page from "../../src/routes/overview/session/[sessionId]/addExercise/+page.svelte";

const renderPage = () =>
  render(Page, {
    props: { data: { session: null, url: "/", sessionId: "s1" } },
  });

beforeEach(() => vi.clearAllMocks());

describe("Add Exercise page", () => {
  it("renders every exercise type", () => {
    renderPage();
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("Plank")).toBeInTheDocument();
  });

  it("groups into sections in the fixed muscle-group order (Chest before Legs before Other)", () => {
    const { container } = renderPage();
    const text = container.textContent ?? "";
    expect(text.indexOf("Chest")).toBeGreaterThanOrEqual(0);
    expect(text.indexOf("Chest")).toBeLessThan(text.indexOf("Legs"));
    expect(text.indexOf("Legs")).toBeLessThan(text.indexOf("Other"));
  });

  it("filters sections when a muscle-group pill is selected", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Filter by muscle group" }));

    // "Chest" matches both the filter pill and the collapsible section header
    // (both are buttons); the pill is rendered first.
    await user.click(screen.getAllByRole("button", { name: "Chest" })[0]);

    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.queryByText("Squat")).not.toBeInTheDocument();
    expect(screen.queryByText("Plank")).not.toBeInTheDocument();
  });

  it("filters by name via the search field", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "Search exercises" }));
    await user.type(screen.getByPlaceholderText("Search exercises"), "squ");

    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.queryByText("Bench Press")).not.toBeInTheDocument();
  });

  it("enables the Add button only once a type is selected", async () => {
    const user = userEvent.setup();
    renderPage();
    const addButton = screen.getByRole("button", { name: "Add" });
    expect(addButton).toBeDisabled();

    await user.click(within(screen.getByText("Squat").closest("label")!).getByRole("radio"));
    expect(addButton).toBeEnabled();
  });
});
