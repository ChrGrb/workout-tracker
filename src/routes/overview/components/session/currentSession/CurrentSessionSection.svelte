<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import { PauseIcon, PlayIcon, Trash2Icon } from "svelte-feather-icons";
  import SessionButton from "../SessionButton.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import type { Exercise, ExerciseType, WorkoutSession } from "@prisma/client";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import AddExerciseCard from "$lib/components/AddCard.svelte";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
  import CurrentSessionHeadlineEditable from "./CurrentSessionHeadlineEditable.svelte";

  export let currentSessionExercises:
    | (WorkoutSession & {
        exercises: (Exercise & { type: ExerciseType })[];
      })
    | null;
  export let userId: string;

  let form: HTMLFormElement;
  let isDeleteLoading = false;
  let isStartLoading = false;

  $: isFinishButtonActive = (exercises: Exercise[]) => {
    return exercises.length > 0;
  };

  async function addExercise() {
    goto("/overview/exercise/addExercise");
  }
</script>

<div class="flex flex-col gap-12" in:fade={{ duration: 100, delay: 120 }}>
  {#if currentSessionExercises !== null}
    <div class="flex flex-col gap-8">
      <CurrentSessionHeadlineEditable
        workoutSession={currentSessionExercises}
      />
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        {#if currentSessionExercises.exercises}
          {#each currentSessionExercises.exercises as exercise}
            <ExerciseCard {exercise} />
          {/each}
        {/if}
        <AddExerciseCard addAction={addExercise}>Add exercise</AddExerciseCard>
      </div>
    </div>

    <div class="flex flex-row w-full gap-4">
      <SessionButton
        sessionId={currentSessionExercises.id}
        formAction="?/finishCurrentSession"
        buttonDisabled={!isFinishButtonActive(
          currentSessionExercises.exercises
        )}
        classes="w-full grow"
        buttonClasses="w-full"
        highlight={true}
      >
        <p>Finish Session</p>
        <PauseIcon size="14" />
      </SessionButton>

      <SessionButton
        sessionId={currentSessionExercises.id}
        formAction="?/deleteCurrentSession"
        bind:form
        buttonAction={() =>
          confirmDelete(form, "session", () => {
            isDeleteLoading = false;
          })}
        buttonIcon={true}
        bind:isLoading={isDeleteLoading}
      >
        <Trash2Icon size="18" />
      </SessionButton>
    </div>
  {:else}
    <div in:fade={{ duration: 100, delay: 120 }}>
      <SubmitFormWrapper
        action="?/createSession"
        bind:isLoading={isStartLoading}
      >
        <input
          type="text"
          name="userId"
          value={userId}
          class="hidden"
          slot="form-content"
        />
        <Button
          slot="button"
          type="submit"
          highlight={true}
          isLoading={isStartLoading}
        >
          <div class="flex flex-row gap-4 justify-center items-center">
            <p>Start session</p>
            <PlayIcon size="14" />
          </div>
        </Button>
      </SubmitFormWrapper>
    </div>
  {/if}
</div>
