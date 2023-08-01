<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import { svelteTime } from "svelte-time";

  type ExerciseWithType = {
    id: string;
    userId: string;
    typeId: string;
    sessionId: string;
    createdAt: Date;
    type: {
      id: string;
      userId: string;
      name: string;
    };
    averageWeight: number | null;
    averageReps: number | null;
  };

  export let exercise: ExerciseWithType;
</script>

<a
  class="card variant-filled-primary flex flex-col justify-center p-4 aspect-square text-center"
  href={"/overview/exercise/" + exercise.id}
>
  <Headline style="small">{exercise.type.name}</Headline>
  <time
    use:svelteTime={{
      timestamp: exercise.createdAt,
      format: "HH:mm · MMMM D",
    }}
    class="font-light text-sm"
  />
  {#if exercise.averageWeight && exercise.averageReps}
    <div class="flex flex-row gap-2 justify-center mt-2">
      <div class="flex flex-row badge variant-ringed-surface pr-2.5">
        <div class="h-2 w-2 rounded-full bg-white" />
        <p>{exercise.averageReps} reps</p>
      </div>

      <div class="flex flex-row badge variant-ringed-surface pr-2.5">
        <div class="h-2 w-2 rounded-full bg-white" />
        <p>{exercise.averageWeight} kg</p>
      </div>
    </div>
  {/if}
</a>
