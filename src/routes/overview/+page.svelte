<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/WorkoutCard.svelte";
  import { goto } from "$app/navigation";
  import {
    ChevronRightIcon,
    LogOutIcon,
    PauseIcon,
    PlayIcon,
    UserIcon,
  } from "svelte-feather-icons";
  import { signOut } from "@auth/sveltekit/client";
  import Button from "$lib/base/Button.svelte";
  import AddWorkoutCard from "$lib/components/AddWorkoutCard.svelte";
  import { svelteTime } from "svelte-time";

  export let data: PageData;

  async function addWorkout() {
    goto("/overview/workout/addWorkout");
  }
</script>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline style="large">Overview</Headline>
      <div class="flex flex-row justify-between items-center">
        <div class="flex flex-row gap-2">
          <UserIcon size="24" />
          <p>{data.user.email}</p>
        </div>
        <Button action={signOut} icon={true}><LogOutIcon size="24" /></Button>
      </div>
    </div>

    {#if data.sessionCurrent !== null}
      <div class="flex flex-col gap-8">
        <Headline style="medium">Current Session</Headline>

        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          {#if data.sessionCurrent.workouts}
            {#each data.sessionCurrent.workouts as workout}
              <WorkoutCard {workout} />
            {/each}
          {/if}
          <AddWorkoutCard addAction={addWorkout} />
        </div>
      </div>

      <form method="POST" action="?/finishCurrentSession" class="w-full">
        <input
          type="text"
          name="sessionId"
          value={data.sessionCurrent.id}
          class="hidden"
        />
        <Button type="submit" classes="w-full">
          <div class="flex flex-row gap-2 justify-center items-center">
            <p>Finish Session</p>
            <PauseIcon size="14" />
          </div>
        </Button>
      </form>
    {:else}
      <form method="POST" action="?/createSession">
        <input type="text" name="userId" value={data.user.id} class="hidden" />
        <Button type="submit" classes="w-full">
          <div class="flex flex-row gap-2 justify-center items-center">
            <p>Start session</p>
            <PlayIcon size="14" />
          </div>
        </Button>
      </form>
    {/if}

    {#if data.sessionsPrevious}
      <div class="flex flex-col gap-8">
        <Headline style="medium">Previous Sessions</Headline>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          {#each data.sessionsPrevious as session}
            <a href={"/overview/session/" + session.id}>
              <div
                class="card variant-filled p-4 flex flex-row items-center justify-between gap-2"
              >
                <div class="flex flex-col">
                  <Headline style="small">Session</Headline>
                  <time
                    use:svelteTime={{
                      timestamp: session.createdAt,
                      format: "hh:mm · MMMM D",
                    }}
                    class="font-light text-sm"
                  />
                </div>
                <ChevronRightIcon size="24" />
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Container>
