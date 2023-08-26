<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import type { Exercise, ExerciseType } from "@prisma/client";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import {
    MinusIcon,
    TrendingDownIcon,
    TrendingUpIcon,
  } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";

  type ExerciseWithType = Exercise & {
    type: ExerciseType;
  };

  export let exercise: ExerciseWithType;

  $: scoreImprovement =
    Math.round(
      (exercise.previousScore && exercise.score < exercise.previousScore
        ? -(1 - exercise.score / exercise.previousScore) * 100
        : ((exercise.score / exercise.previousScore! ?? 0) - 1) * 100) * 100
    ) / 100;
</script>

<Button
  classes="card variant-filled-primary w-full flex flex-col gap-2 justify-center p-4 aspect-square text-center relative drop-shadow-lg"
  action={() => {
    goto("/overview/exercise/" + exercise.id);
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
  <Headline
    style="small"
    classes="break-words whitespace-normal line-clamp-3 max-w-[95%]"
  >
    {exercise.type.name}
  </Headline>
  {#if exercise.averageWeight && exercise.averageReps}
    <div
      class="flex flex-row gap-2 flex-wrap justify-center mb-6 md:mb-2 !ml-0"
    >
      <div class="flex flex-row badge rounded-full pr-2.5 bg-white text-black">
        <p>{exercise.averageReps} reps</p>
      </div>

      <div class="flex flex-row badge rounded-full pr-2.5 bg-white text-black">
        <p>{exercise.averageWeight} kg</p>
      </div>

      {#if scoreImprovement < Infinity}
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
  <time
    use:svelteTime={{
      timestamp: exercise.createdAt,
      format: "HH:mm · MMMM D",
    }}
    class="font-light text-sm absolute bottom-0 left-0 right-0 pb-3"
  />
</Button>
