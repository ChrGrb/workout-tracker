import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { makeExerciseSet } from "$lib/testing/fixtures";

vi.mock("@skeletonlabs/skeleton", () => ({ getModalStore: () => ({}) }));
vi.mock("$lib/base/SwipeToAction.svelte", () => import("../mocks/StubPassthrough.svelte"));

import ExerciseSetCard from "../../src/lib/components/ExerciseSetCard.svelte";

describe("ExerciseSetCard", () => {
  it("shows the set type, reps and total weight for a workout set", () => {
    render(ExerciseSetCard, {
      props: {
        exerciseSet: makeExerciseSet({
          exerciseSetType: "WORKOUT",
          reps: 8,
          weight: 60,
          additionalWeight: 0,
          time: 0,
        }),
        deleteAction: () => {},
      },
    });
    expect(screen.getByText("Workout")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });

  it("renders a warmup set's label", () => {
    render(ExerciseSetCard, {
      props: {
        exerciseSet: makeExerciseSet({ exerciseSetType: "WARMUP", reps: 5, weight: 40 }),
        deleteAction: () => {},
      },
    });
    expect(screen.getByText("Warmup")).toBeInTheDocument();
  });
});
