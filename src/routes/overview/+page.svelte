<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/WorkoutCard.svelte";
  import { goto, invalidate } from "$app/navigation";
  import { LogOutIcon, UserIcon } from "svelte-feather-icons";
  import { signOut } from "@auth/sveltekit/client";
  import Button from "$lib/base/Button.svelte";
  import AddWorkoutCard from "$lib/components/AddWorkoutCard.svelte";

  export let data: PageData;

  async function addWorkout() {
    goto("/overview/workout/addWorkout");
  }
</script>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline style="large">Overview</Headline>
      <div class="flex flex-row justify-between">
        <div class="flex flex-row gap-2">
          <UserIcon size="24" />
          <p>{data.user.email}</p>
        </div>
        <Button action={signOut} icon={true}><LogOutIcon size="24" /></Button>
      </div>
    </div>

    <div class="flex flex-col gap-8">
      <Headline style="medium">Current Session</Headline>

      <div class="grid grid-cols-2 gap-4">
        {#each data.workouts as workout}
          <WorkoutCard {workout} />
        {/each}
        <AddWorkoutCard addAction={addWorkout} />
      </div>
    </div>

    <button on:click={addWorkout}>Add workout</button>
  </div>
</Container>
