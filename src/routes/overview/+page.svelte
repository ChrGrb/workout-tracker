<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/WorkoutCard.svelte";
  import { goto, invalidate } from "$app/navigation";
  import { UserIcon } from "svelte-feather-icons";

  export let data: PageData;

  async function addWorkout() {
    // const workout = {
    //   userId: data.user.id,
    //   name: "Test Workout",
    // };

    // const response = await fetch("/api/workout", {
    //   method: "POST",
    //   body: JSON.stringify({ workout: workout }),
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });

    // invalidate("app:workouts");
    goto("/overview/workout/addWorkout");
  }
</script>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline style="large">Overview</Headline>
      <div class="flex flex-row gap-2">
        <UserIcon size="24" />
        <p>{data.user.email}</p>
      </div>
    </div>

    <div class="flex flex-col gap-8">
      <Headline style="medium">Current Session</Headline>

      <div class="grid grid-cols-2 gap-4">
        {#each data.workouts as workout}
          <WorkoutCard {workout} />
        {/each}
      </div>
    </div>

    <button on:click={addWorkout}>Add workout</button>
  </div>
</Container>
