<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
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
  };

  export let workout: WorkoutWithType;
</script>

<a
  class="card variant-filled-primary flex flex-col justify-center p-4 aspect-square text-center"
  href={"/overview/workout/" + workout.id}
>
  <Headline style="small">{workout.workoutType.name}</Headline>
  <time
    use:svelteTime={{
      timestamp: workout.createdAt,
      format: "hh:mm · MMMM D",
    }}
    class="font-light text-sm"
  />
</a>
