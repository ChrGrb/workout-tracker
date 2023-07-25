<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import type { WorkoutSet } from "@prisma/client";
  import clsx from "clsx";
  import { Trash2Icon } from "svelte-feather-icons";

  export let workoutSet: WorkoutSet;
  export let deleteAction: string;
</script>

<div
  class={clsx("card flex flex-col gap-8 justify-center p-6", {
    "variant-filled-primary": !workoutSet.warmup,
    "variant-soft-primary": workoutSet.warmup,
  })}
>
  <div class="flex flex-row items-start justify-between">
    <Headline style="small">
      {workoutSet.warmup ? "Warmup" : "Workout"}
    </Headline>
    <form method="POST" action={deleteAction} use:enhance>
      <input
        type="text"
        name="workoutId"
        value={workoutSet.workoutId}
        class="hidden"
      />
      <input type="text" name="setId" value={workoutSet.id} class="hidden" />
      <Button
        type="submit"
        icon={true}
        classes={clsx({
          "variant-soft-error": workoutSet.warmup,
          "variant-filled-primary": !workoutSet.warmup,
        })}
      >
        <div class="flex flex-row gap-4 justify-center items-center">
          <Trash2Icon size="20" />
        </div>
      </Button>
    </form>
  </div>
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
