<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { WorkoutAverage } from "$lib/types/workoutAverage";
  import { ChevronRightIcon } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";

  type WorkoutWithType = {
    id: string;
    userId: string;
    workoutTypeId: string;
    sessionId: string;
    createdAt: Date;
    workoutType: {
      id: string;
      userId: string;
      name: string;
    };
    averageWeight: number | null;
    averageReps: number | null;
  };

  export let workout: WorkoutWithType;

  console.log(workout);
</script>

<a
  class="card variant-filled-primary flex flex-col justify-center p-4 aspect-square text-center"
  href={"/overview/workout/" + workout.id}
>
  <Headline style="small">{workout.workoutType.name}</Headline>
  <time
    use:svelteTime={{
      timestamp: workout.createdAt,
      format: "HH:mm · MMMM D",
    }}
    class="font-light text-sm"
  />
  {#if workout.averageWeight && workout.averageReps}
    <div class="flex flex-row gap-2 justify-center mt-2">
      <div class="flex flex-row badge variant-ringed-surface pr-2.5">
        <div class="h-2 w-2 rounded-full bg-white" />
        <p>{workout.averageReps} reps</p>
      </div>

      <div class="flex flex-row badge variant-ringed-surface pr-2.5">
        <div class="h-2 w-2 rounded-full bg-white" />
        <p>{workout.averageWeight} kg</p>
      </div>
    </div>
  {/if}
</a>
