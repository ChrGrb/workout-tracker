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
  class="card variant-filled-primary flex flex-col gap-2 justify-center p-4 aspect-square text-center relative"
  href={"/overview/exercise/" + exercise.id}
>
  <Headline style="small">{exercise.type.name}</Headline>
  {#if exercise.averageWeight && exercise.averageReps}
    <div class="flex flex-row gap-2 justify-center mb-2">
      <div class="flex flex-row badge variant-ringed-surface pr-2.5">
        <p>{exercise.averageReps} reps</p>
      </div>

      <div class="flex flex-row badge variant-ringed-surface pr-2.5">
        <p>{exercise.averageWeight} kg</p>
      </div>
    </div>
  {/if}
  <time
    use:svelteTime={{
      timestamp: exercise.createdAt,
      format: "HH:mm · MMMM D",
    }}
    class="font-light text-sm absolute bottom-0 left-0 right-0 pb-3"
  />
</a>