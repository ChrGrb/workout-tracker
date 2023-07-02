<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { WorkoutSet } from "@prisma/client";

  export let workoutSet: WorkoutSet;
</script>

<div
  class="flex flex-col gap-4 justify-center bg-slate-400 rounded-md px-4 py-6 text-white"
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
