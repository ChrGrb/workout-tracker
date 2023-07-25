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
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";

  export let data: PageData;

  async function addSet() {
    goto("/overview/workout/" + data.workout.id + "/addSet");
  }

  let form: HTMLFormElement;
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
    {#if data.recommendations}
      <div class="flex flex-col gap-2 card variant-soft-success p-4">
        <Headline style="small">Recommendation</Headline>
        <div class="flex flex-row w-full basis-1/2">
          <div class="flex flex-row basis-1/2">
            <p>
              <span class="font-semibold">Reps </span>
              {data.recommendations.recommendedReps}
            </p>
            <p />
          </div>
          <div class="flex flex-row basis-1/2">
            <p>
              <span class="font-semibold">Weight </span>
              {data.recommendations.recommendedWeight} kg
            </p>
            <p />
          </div>
        </div>
      </div>
    {/if}
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
        bind:this={form}
      >
        <input
          type="text"
          name="workoutId"
          value={data.workout.id}
          class="hidden"
        />
        <Button
          action={() => confirmDelete(form, "workout")}
          classes="w-full variant-soft-error"
        >
          <div class="flex flex-row gap-4 justify-center items-center">
            <p>Delete Workout</p>
            <Trash2Icon size="14" />
          </div>
        </Button>
      </form>
    {/if}
  </div>
</Container>
