<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { WorkoutSet } from "@prisma/client";
  import clsx from "clsx";

  export let workoutSet: WorkoutSet;
</script>

<div
  class={clsx("card flex flex-col gap-4 justify-center px-4 py-6", {
    "variant-filled-primary": !workoutSet.warmup,
    "variant-soft-primary": workoutSet.warmup,
  })}
>
  <Headline style="small">{workoutSet.warmup ? "Warmup" : "Workout"}</Headline>
  <div class="flex flex-row justify-between">
    <div class="flex flex-row gap-1">
      <p class="font-medium">{workoutSet.reps}</p>
      <p>reps</p>
    </div>
    <div class="flex flex-row gap-1">
      <p class="font-medium">{workoutSet.weight}</p>
      <p>kg</p>
    </div>
  </div>
</div>
