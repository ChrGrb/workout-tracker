<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/WorkoutCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import { Trash2Icon } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";

  export let data: PageData;

  let form: HTMLFormElement;
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
        <Headline style="small">Exercises</Headline>
      </div>
      <div class="flex flex-col gap-2">
        {#if data.session.workouts && data.session.workouts.length > 0}
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            {#each data.session.workouts as workout (workout.id)}
              <div animate:flip={{ duration: 100, easing: sineInOut }}>
                <WorkoutCard {workout} />
              </div>
            {/each}
          </div>
        {:else}
          <Headline style="small">No exercises in session</Headline>
        {/if}
      </div>
    </div>

    <form
      method="POST"
      action="?/deleteCurrentSession"
      class="w-full grow"
      use:enhance
      bind:this={form}
    >
      <input
        type="text"
        name="sessionId"
        value={data.session.id}
        class="hidden"
      />
      <Button
        action={() => confirmDelete(form, "session")}
        classes="w-full variant-soft-error"
      >
        <div class="flex flex-row gap-4 justify-center items-center">
          <p>Delete Session</p>
          <Trash2Icon size="14" />
        </div>
      </Button>
    </form>
  </div>
</Container>
