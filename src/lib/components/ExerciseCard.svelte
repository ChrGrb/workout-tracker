<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import SwipeToAction from "$lib/base/SwipeToAction.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import { useForwardNavigation, useUserId } from "$lib/stores/stores";
  import calculateExerciseScore from "$lib/utils/data/calculateExerciseScore";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import { getExerciseSetWeight } from "$lib/utils/data/getExerciseSetWeight";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import getExerciseTypePreviousScore from "$lib/utils/replicache/getters/getExerciseTypePreviousScore";
  import { getExercisePath, getOverviewPath } from "$lib/utils/routing/routes";
  import { getModalStore, ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import {
    MinusIcon,
    TrendingDownIcon,
    TrendingUpIcon,
  } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";
  import deleteExerciseAction from "../../routes/overview/session/[sessionId]/exercise/[exerciseId]/actions/deleteExerciseAction";
  import { useMotionValue } from "svelte-motion";
  import { Badge } from "./ui/badge";

  interface Props {
    exercise: ExerciseFull;
    previous?: boolean;
  }

  let { exercise, previous = false }: Props = $props();

  let userId = useUserId();

  getExerciseTypePreviousScore(
    exercise.type,
    $userId ?? "",
    exercise.createdAt
  ).then((value) => {
    previousScore = value ?? 0;
  });

  let exerciseSets = $derived(filterDeleted(exercise.sets));
  let workoutSets = $derived(
    exerciseSets.filter((set) => set.exerciseSetType === "WORKOUT")
  );

  let previousScore = $state(0);

  let score = $derived(exerciseSets ? calculateExerciseScore(exercise) : null);

  let scoreImprovement = $derived(
    score
      ? Math.round(
          (previousScore && score < previousScore
            ? -(1 - score / previousScore) * 100
            : (score / previousScore - 1) * 100) * 100
        ) / 100
      : null
  );

  let averageWeight = $derived(
    workoutSets.length > 0
      ? Math.round(
          (workoutSets.reduce(
            (acc, set) => acc + getExerciseSetWeight(set),
            0
          ) /
            workoutSets.length) *
            2
        ) / 2
      : 0
  );

  let averageReps = $derived(
    workoutSets.length > 0
      ? Math.round(
          workoutSets.reduce((acc, set) => acc + set.reps, 0) /
            workoutSets.length
        )
      : 0
  );

  let averageTime = $derived(
    workoutSets.length > 0
      ? Math.round(
          workoutSets.reduce((acc, set) => acc + set.time, 0) /
            workoutSets.length
        )
      : 0
  );

  let setAmount = $derived(workoutSets.length);

  let x = $state(useMotionValue(0));

  const modalStore = getModalStore();

  const forwardNavigation = useForwardNavigation();
</script>

<SwipeToAction
  disabled={previous}
  deleteAction={() =>
    confirmDeleteWithAction(
      modalStore,
      () => {
        if (exercise) {
          deleteExerciseAction($state.snapshot(exercise));
          goto(getOverviewPath);
        }
      },
      "exercise",
      () => {}
    )}
  bind:x
>
  <Button
    classes={clsx(
      "card w-full flex flex-row gap-2 justify-center p-4 text-center justify-between relative drop-shadow-lg",
      {
        "variant-soft bg-white": !exercise.sets || exerciseSets.length === 0,
        "variant-filled-primary": exercise.sets && exerciseSets.length > 0,
        "variant-soft": previous,
        "active:scale-100": $x !== 0,
      }
    )}
    action={() => {
      if ($x === 0 || $x === undefined) {
        forwardNavigation.set(true);
        goto(
          getExercisePath({
            sessionId: exercise.sessionId,
            exerciseId: exercise.id,
          })
        );
      }
    }}
  >
    {#snippet spinner()}
      <ProgressRadial width="w-[48px]" stroke={100} meter="stroke-primary-50" />
    {/snippet}
    <div class="flex flex-col justify-between align-stretch items-start w-full">
      <Headline
        style="small"
        classes="break-words whitespace-normal line-clamp-3 max-w-[95%] text-start"
      >
        {exercise.type.name}
      </Headline>

      {#if previous}
        <time
          use:svelteTime={{
            timestamp: exercise.createdAt,
            format: "MMMM D",
          }}
          class="font-light text-sm"
        ></time>
      {/if}
    </div>

    {#if (+averageWeight > 0 && +averageReps > 0) || +averageTime > 0}
      <div
        class={clsx(
          "flex flex-row gap-2 flex-wrap justify-end align-end items-center !ml-0 w-full",
          {
            "opacity-60": previous,
          }
        )}
      >
        {#if +averageTime > 0}
          <Badge variant="secondary">
            <div class="flex flex-row">
              <p>{(averageTime / 1000).toFixed(0)}</p>
              <p>s</p>
            </div>
          </Badge>
        {/if}

        {#if +averageWeight > 0 && +averageReps > 0}
          <Badge variant="secondary">
            <div class="flex flex-row">
              <p>{averageReps} reps</p>
            </div>
          </Badge>

          <Badge variant="secondary">
            <div class="flex flex-row">
              <p>{averageWeight} kg</p>
            </div>
          </Badge>
        {/if}

        <Badge variant="secondary">
          <div class="flex flex-row">
            <p>{setAmount} sets</p>
          </div>
        </Badge>

        {#if scoreImprovement && scoreImprovement < Infinity}
          <Badge
            variant="secondary"
            class={clsx("flex flex-row text-white", {
              "bg-success-700": scoreImprovement >= 0,
              "bg-warning-700": scoreImprovement < 0 && scoreImprovement >= -5,
              "bg-error-700": scoreImprovement < -5,
            })}
          >
            <div class={clsx("flex flex-row gap-2 items-center")}>
              <p>{scoreImprovement.toFixed(1)}%</p>
              {#if scoreImprovement > 0}
                <TrendingUpIcon size="14" />
              {:else if scoreImprovement == 0}
                <MinusIcon size="14" />
              {:else}
                <TrendingDownIcon size="14" />
              {/if}
            </div>
          </Badge>
        {/if}
      </div>
    {/if}
  </Button>
</SwipeToAction>
