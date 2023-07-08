<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/WorkoutCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";

  export let data: PageData;
</script>

<Container>
  <ExitButton exitPath={"/overview"} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 pr-24">
      <Headline>Session</Headline>
      <time
        use:svelteTime={{
          timestamp: data.session.createdAt,
          format: "dddd @ h:mm A · MMMM D, YYYY",
        }}
      />
    </div>
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-start">
        <Headline style="small">Workouts</Headline>
      </div>
      <div class="flex flex-col gap-2">
        {#if data.session.workouts && data.session.workouts.length > 0}
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            {#each data.session.workouts as workout}
              <WorkoutCard {workout} />
            {/each}
          </div>
        {:else}
          <Headline style="small">No workouts in session</Headline>
        {/if}
      </div>
    </div>
  </div>
</Container>
