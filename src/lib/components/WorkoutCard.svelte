<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import { Prisma, type Workout } from "@prisma/client";
  import { svelteTime } from "svelte-time";

  const workoutWithType = Prisma.validator<Prisma.WorkoutArgs>()({
    include: { workoutType: true },
  });
  type WorkoutWithType = Prisma.WorkoutGetPayload<typeof workoutWithType>;

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
