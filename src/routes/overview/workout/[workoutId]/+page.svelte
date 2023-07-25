<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import { goto } from "$app/navigation";
  import WorkoutSetCard from "$lib/components/WorkoutSetCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { PlusIcon, Trash2Icon } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import { enhance } from "$app/forms";

  export let data: PageData;

  async function addSet() {
    goto("/overview/workout/" + data.workout.id + "/addSet");
  }
</script>

<Container>
  <ExitButton exitPath={"/overview"} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 pr-24">
      <Headline>{data.workout.workoutType.name}</Headline>
      <time
        use:svelteTime={{
          timestamp: data.workout.createdAt,
          format: "dddd @ h:mm A · MMMM D, YYYY",
        }}
      />
    </div>
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-between items-center">
        <Headline style="small">Sets</Headline>
        {#if data.workoutActive}
          <Button action={addSet} icon={true} classes="variant-filled-primary"
            ><PlusIcon size="24" /></Button
          >
        {/if}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        {#if data.workout.sets}
          {#each data.workout.sets as set (set.id)}
            <div animate:flip={{ duration: 100, easing: sineInOut }}>
              <WorkoutSetCard workoutSet={set} deleteAction="?/deleteSet" />
            </div>
          {/each}
        {/if}
      </div>
    </div>

    {#if data.workoutActive}
      <form
        method="POST"
        action="?/deleteCurrentWorkout"
        class="w-full grow"
        use:enhance
      >
        <input
          type="text"
          name="workoutId"
          value={data.workout.id}
          class="hidden"
        />
        <Button type="submit" classes="w-full variant-soft-error">
          <div class="flex flex-row gap-4 justify-center items-center">
            <p>Delete Workout</p>
            <Trash2Icon size="14" />
          </div>
        </Button>
      </form>
    {/if}
  </div>
</Container>
