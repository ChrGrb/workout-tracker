<script lang="ts">
  import { Prisma, type Workout } from "@prisma/client";
  import { PlusIcon } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";

  const workoutWithType = Prisma.validator<Prisma.WorkoutArgs>()({
    include: { workoutType: true },
  });
  type WorkoutWithType = Prisma.WorkoutGetPayload<typeof workoutWithType>;

  export let workout: WorkoutWithType;
</script>

<a
  class="flex flex-col justify-center bg-slate-400 rounded-md p-4 aspect-square text-white text-center"
  href={"/overview/workout/" + workout.id}
>
  <p class="text-center font-medium text-lg">{workout.workoutType.name}</p>
  <time
    use:svelteTime={{
      timestamp: workout.createdAt,
      format: "hh:mm · MMMM D",
    }}
    class="font-light text-sm"
  />
</a>
