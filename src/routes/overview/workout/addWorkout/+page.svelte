<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { goto } from "$app/navigation";
  import WorkoutTypeRadioButton from "./components/WorkoutTypeRadioButton.svelte";
  import AddWorkoutTypeButton from "./components/AddWorkoutTypeButton.svelte";
  import { enhance } from "$app/forms";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";

  export let data: PageData;

  let workoutTypeSelection = "";
  $: isInvalid = workoutTypeSelection.length === 0;
</script>

<Container>
  <ExitButton exitPath="/overview" />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline>Add <br /> Workout</Headline>
    </div>
    <form method="POST" action="?/addWorkout" use:enhance>
      <div class="flex flex-col gap-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each data.workoutTypes as workoutType (workoutType.id)}
            <div animate:flip={{ duration: 100, easing: sineInOut }}>
              <WorkoutTypeRadioButton
                name={workoutType.name}
                id={workoutType.id}
                bind:group={workoutTypeSelection}
                required={true}
                userId={workoutType.userId}
              />
            </div>
          {/each}
          <AddWorkoutTypeButton
            addAction={() =>
              goto("/overview/workout/addWorkoutType", { invalidateAll: true })}
          />
        </div>
        <Button type="submit" disabled={isInvalid}>Add</Button>
      </div>
    </form>
  </div>
</Container>
