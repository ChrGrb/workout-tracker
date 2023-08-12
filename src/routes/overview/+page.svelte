<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { goto } from "$app/navigation";
  import {
    MoreVerticalIcon,
    PauseIcon,
    PlayIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import Button from "$lib/base/Button.svelte";
  import AddExerciseCard from "$lib/components/AddCard.svelte";
  import PreviousSessions from "./components/session/PreviousSessions.svelte";
  import SettingsDrawer from "./components/settings/SettingsDrawer.svelte";
  import {
    modalStore,
    type ModalComponent,
    type ModalSettings,
  } from "@skeletonlabs/skeleton";
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
  import type { Exercise } from "@prisma/client";
  import SessionButton from "./components/session/SessionButton.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import { fade } from "svelte/transition";
  import SessionSkeleton from "./components/session/SessionSkeleton.svelte";
  import Header from "$lib/base/Header.svelte";
  import { useExerciseTimers, useSettings } from "$lib/stores/stores";

  export let data: PageData;

  async function addExercise() {
    goto("/overview/exercise/addExercise");
  }

  let settings = useSettings();
  settings.set(data.user.settings!);

  const modalSettingsComponent: ModalComponent = {
    ref: SettingsDrawer,
    props: { user: data.user },
  };

  function openSettings() {
    const modal: ModalSettings = {
      type: "component",
      component: modalSettingsComponent,
    };
    modalStore.trigger(modal);
  }

  let form: HTMLFormElement;
  let isDeleteLoading = false;
  let isStartLoading = false;

  $: isFinishButtonActive = (exercises: Exercise[]) => {
    return exercises.length > 0;
  };

  useExerciseTimers();
</script>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-row gap-4 justify-between">
      <Header>Overview</Header>
      <Button action={openSettings} icon={true}>
        <MoreVerticalIcon size="24" />
      </Button>
    </div>

    {#await data.streamed.currentSessionExercises}
      <div class="flex flex-col gap-8" transition:fade={{ duration: 100 }}>
        <SessionSkeleton />
      </div>
    {:then currentSessionExercises}
      <div class="flex flex-col gap-12" in:fade={{ duration: 100, delay: 120 }}>
        {#if currentSessionExercises !== null}
          <div class="flex flex-col gap-8">
            <Headline style="medium">Current Session</Headline>

            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              {#if currentSessionExercises.exercises}
                {#each currentSessionExercises.exercises as exercise}
                  <ExerciseCard {exercise} />
                {/each}
              {/if}
              <AddExerciseCard addAction={addExercise}>
                Add exercise
              </AddExerciseCard>
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
                value={data.user.id}
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
    {/await}

    <hr />

    {#await data.streamed.previousSessions}
      <div transition:fade={{ duration: 100 }}>
        <PreviousSessions loading={true} />
      </div>
    {:then previousSessions}
      <div in:fade={{ duration: 100, delay: 120 }}>
        <PreviousSessions {previousSessions} />
      </div>
    {/await}
  </div>
</Container>
