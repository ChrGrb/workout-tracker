<script lang="ts">
  import type { Workout } from "@prisma/client";
  import { svelteTime } from "svelte-time";

  export let workout: Workout;
</script>

<a
  class="flex flex-col justify-center bg-slate-400 rounded-md p-4 aspect-square text-white text-center"
  href={"/overview/workout/" + workout.id}
>
  <p class="text-center font-medium text-lg">{workout.name}</p>
  <time
    use:svelteTime={{
      timestamp: workout.createdAt,
      format: "hh:mm · MMMM D",
    }}
    class="font-light text-sm"
  />
</a>
