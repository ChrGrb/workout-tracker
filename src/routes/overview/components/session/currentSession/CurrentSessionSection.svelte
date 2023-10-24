<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import {
    PauseIcon,
    PlayIcon,
    PlusIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import type { Exercise } from "@prisma/client";
  import { fade } from "svelte/transition";
  import { goto } from "$app/navigation";
  import AddExerciseCard from "$lib/components/AddCard.svelte";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import CurrentSessionHeadlineEditable from "./SessionHeadlineEditable.svelte";
  import type {
    WorkoutSessionFull,
    WorkoutSessionTemplateWithExerciseTypes,
  } from "$lib/utils/prismaTypes";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import Headline from "$lib/base/Headline.svelte";
  import WorkoutSessionTemplateCard from "./components/WorkoutSessionTemplateCard.svelte";
  import { getAddTemplatePath } from "$lib/utils/routing/routes";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";

  export let currentSession: WorkoutSessionFull | null;
  export let workoutSessionTemplates:
    | WorkoutSessionTemplateWithExerciseTypes[]
    | null;

  let isStartLoading = false;

  $: isFinishButtonActive = (exercises: Exercise[]) => {
    return exercises.length > 0;
  };

  async function addExercise() {
    goto(`/overview/session/${currentSession?.id}/addExercise`);
  }

  $: workoutSessionTemplates =
    workoutSessionTemplates?.sort(sortByCreatedAt) ?? null;

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
      <div class="flex flex-col gap-4">
        {#if currentSession.exercises}
          {#each filterDeleted(currentSession.exercises).sort(sortByCreatedAt) as exercise (exercise.id)}
            <div
              animate:flip={{ delay: 100, duration: 250, easing: sineInOut }}
              transition:fade
            >
              <ExerciseCard {exercise} />
            </div>
          {/each}
        {/if}
        <AddExerciseCard isInline={true} addAction={addExercise}>
          Add exercise
        </AddExerciseCard>
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
    <div class="flex flex-col gap-12" in:fade={{ duration: 100, delay: 120 }}>
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

      {#if workoutSessionTemplates}
        <div class="flex flex-col gap-4">
          <div class="flex flex-row justify-between">
            <Headline style="medium">Start from template</Headline>
            <Button
              icon={true}
              action={() => {
                goto(getAddTemplatePath);
              }}
            >
              <PlusIcon size="28" />
            </Button>
          </div>
          <div class="flex flex-col gap-4">
            {#each workoutSessionTemplates as workoutSessionTemplate (workoutSessionTemplate.id)}
              <div
                animate:flip={{ delay: 100, duration: 250, easing: sineInOut }}
                transition:fade
              >
                <WorkoutSessionTemplateCard {workoutSessionTemplate} />
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
