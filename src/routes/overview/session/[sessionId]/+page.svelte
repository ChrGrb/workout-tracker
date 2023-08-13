<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/ExerciseCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import DeleteButton from "$lib/base/DeleteButton.svelte";
  import Header from "$lib/base/Header.svelte";
  import SessionHeadlineEditable from "../../components/session/currentSession/SessionHeadlineEditable.svelte";

  export let data: PageData;

  let form: HTMLFormElement;
  let isDeleteLoading = false;
</script>

<Container>
  <ExitButton exitPath={"/overview"} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 pr-24 items-start">
      <Header>
        <SessionHeadlineEditable workoutSession={data.session} slot="content" />
      </Header>
      <time
        use:svelteTime={{
          timestamp: data.session.createdAt,
          format: "dddd @ HH:mm · MMMM D, YYYY",
        }}
      />
    </div>
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-start">
        <Headline style="small">Exercises</Headline>
      </div>
      <div class="flex flex-col gap-2">
        {#if data.session.exercises && data.session.exercises.length > 0}
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            {#each data.session.exercises as exercise (exercise.id)}
              <div animate:flip={{ duration: 100, easing: sineInOut }}>
                <WorkoutCard {exercise} />
              </div>
            {/each}
          </div>
        {:else}
          <Headline style="small">No exercises in session</Headline>
        {/if}
      </div>
    </div>

    <SubmitFormWrapper
      action="?/deleteCurrentSession"
      formClasses="w-full grow"
      bind:form
    >
      <input
        type="text"
        name="sessionId"
        value={data.session.id}
        class="hidden"
        slot="form-content"
      />
      <DeleteButton
        bind:form
        toDeleteName="session"
        classes="w-full variant-soft-error"
        slot="button"
      >
        <p slot="title">Delete Session</p>
      </DeleteButton>
    </SubmitFormWrapper>
  </div>
</Container>
