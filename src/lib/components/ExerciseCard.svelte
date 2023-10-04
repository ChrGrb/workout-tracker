<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { useUserId } from "$lib/stores/stores";
  import calculateExerciseScore from "$lib/utils/data/calculateExerciseScore";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import getExerciseTypePreviousScore from "$lib/utils/replicache/getters/getExerciseTypePreviousScore";
  import { getExercisePath } from "$lib/utils/routes";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import {
    MinusIcon,
    TrendingDownIcon,
    TrendingUpIcon,
  } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";

  export let exercise: ExerciseFull;

  let userId = useUserId();

  getExerciseTypePreviousScore(exercise.type, $userId ?? "").then((value) => {
    previousScore = value ?? 0;
  });

  $: exerciseSets = filterDeleted(exercise.sets);
  $: workoutSets = exerciseSets.filter(
    (set) => set.exerciseSetType === "WORKOUT"
  );

  $: previousScore = 0;
  $: score = exerciseSets ? calculateExerciseScore(exercise) : null;

  $: scoreImprovement = score
    ? Math.round(
        (previousScore && score < previousScore
          ? -(1 - score / previousScore) * 100
          : ((score / previousScore! ?? 0) - 1) * 100) * 100
      ) / 100
    : null;

  $: averageWeight =
    workoutSets.length > 0
      ? Math.round(
          (workoutSets.reduce((acc, set) => acc + set.weight, 0) /
            workoutSets.length) *
            2
        ) / 2
      : 0;

  $: averageReps =
    workoutSets.length > 0
      ? Math.round(
          workoutSets.reduce((acc, set) => acc + set.reps, 0) /
            workoutSets.length
        )
      : 0;
</script>

<Button
  classes={clsx(
    "card w-full flex flex-row gap-2 justify-center p-4 text-center justify-between relative drop-shadow-lg",
    {
      "variant-soft": !exercise.sets || exerciseSets.length === 0,
      "variant-filled-primary": exercise.sets && exerciseSets.length > 0,
    }
  )}
  action={() => {
    goto(
      getExercisePath({
        sessionId: exercise.sessionId,
        exerciseId: exercise.id,
      })
    );
  }}
  loadingOnClick={true}
>
  <svelte:component
    this={ProgressRadial}
    slot="spinner"
    width="w-[48px]"
    stroke={100}
    meter="stroke-primary-50"
  />
  <div class="flex flex-col justify-between align-stretch items-start">
    <Headline
      style="small"
      classes="break-words whitespace-normal line-clamp-3 max-w-[95%] text-start"
    >
      {exercise.type.name}
    </Headline>

    <time
      use:svelteTime={{
        timestamp: exercise.createdAt,
        format: "HH:mm · MMMM D",
      }}
      class="font-light text-sm"
    />
  </div>
  {#if +averageWeight > 0 && +averageReps > 0}
    <div
      class="flex flex-row gap-2 flex-wrap justify-end align-end items-center !ml-0"
    >
      <div class="flex flex-row badge rounded-full pr-2.5 bg-white text-black">
        <p>{averageReps} reps</p>
      </div>

      <div class="flex flex-row badge rounded-full pr-2.5 bg-white text-black">
        <p>{averageWeight} kg</p>
      </div>

      {#if scoreImprovement && scoreImprovement < Infinity}
        <div
          class={clsx(
            "flex flex-row badge rounded-full pr-2.5 bg-gradient-to-tr text-white",
            {
              "from-success-700 to-success-900": scoreImprovement >= 0,
              "from-warning-700 to-warning-900":
                scoreImprovement < 0 && scoreImprovement >= -5,
              "from-error-700 to-error-900": scoreImprovement < 5,
            }
          )}
        >
          <p>{scoreImprovement.toFixed(1)}%</p>
          {#if scoreImprovement > 0}
            <TrendingUpIcon size="14" />
          {:else if scoreImprovement === 0}
            <MinusIcon size="14" />
          {:else}
            <TrendingDownIcon size="14" />
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</Button>
