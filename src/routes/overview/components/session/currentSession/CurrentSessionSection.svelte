<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { PauseIcon, PlayIcon, Trash2Icon } from "svelte-feather-icons";
  import type { Exercise, ExerciseType, WorkoutSession } from "@prisma/client";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import AddExerciseCard from "$lib/components/AddCard.svelte";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import CurrentSessionHeadlineEditable from "./SessionHeadlineEditable.svelte";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";

  export let currentSession: WorkoutSessionFull | null;
  export let userId: string;

  let isStartLoading = false;

  $: isFinishButtonActive = (exercises: Exercise[]) => {
    return exercises.length > 0;
  };

  async function addExercise() {
    goto(`/overview/session/${currentSession?.id}/addExercise`);
  }

  export let createSessionAction: () => void;
  export let finishSessionAction: () => void;
  export let deleteSessionAction: () => void;
  export let updateSessionNameAction: () => void;
</script>

<div class="flex flex-col gap-12" in:fade={{ duration: 100, delay: 120 }}>
  {#if currentSession !== null}
    <div class="flex flex-col gap-8">
      <CurrentSessionHeadlineEditable
        bind:workoutSession={currentSession}
        {updateSessionNameAction}
      />
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        {#if currentSession.exercises}
          {#each currentSession.exercises
            .filter((exercise) => !exercise.isDeleted)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as exercise}
            <ExerciseCard {exercise} />
          {/each}
        {/if}
        <AddExerciseCard addAction={addExercise}>Add exercise</AddExerciseCard>
      </div>
    </div>

    <div class="flex flex-row w-full gap-4">
      <Button
        disabled={!isFinishButtonActive(currentSession.exercises)}
        action={finishSessionAction}
        classes="w-full grow"
        highlight={true}
      >
        <p>Finish Session</p>
        <PauseIcon size="14" />
      </Button>

      <Button
        action={() => {
          confirmDeleteWithAction(deleteSessionAction, "session", () => {});
        }}
        icon={true}
      >
        <Trash2Icon size="18" />
      </Button>
    </div>
  {:else}
    <div in:fade={{ duration: 100, delay: 120 }}>
      <Button
        highlight={true}
        action={createSessionAction}
        isLoading={isStartLoading}
        classes="w-full"
      >
        <div class="flex flex-row gap-4 justify-center items-center">
          <p>Start session</p>
          <PlayIcon size="14" />
        </div>
      </Button>
    </div>
  {/if}
</div>
