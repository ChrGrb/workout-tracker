<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { goto } from "$app/navigation";
  import {
    PauseIcon,
    PlayIcon,
    SettingsIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import Button from "$lib/base/Button.svelte";
  import AddExerciseCard from "$lib/components/AddExerciseCard.svelte";
  import PreviousSessions from "./components/session/PreviousSessions.svelte";
  import SettingsDrawer from "./components/settings/SettingsDrawer.svelte";
  import {
    modalStore,
    type ModalComponent,
    type ModalSettings,
  } from "@skeletonlabs/skeleton";
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
  import type { Exercise } from "@prisma/client";
  import SessionButton from "./components/SessionButton.svelte";

  export let data: PageData;

  async function addExercise() {
    goto("/overview/exercise/addExercise");
  }

  const modalSettingsComponent: ModalComponent = {
    ref: SettingsDrawer,
    props: { user: data.user },
    slot: "<p>Skeleton</p>",
  };

  function openSettings() {
    console.log("modal trigger");
    const modal: ModalSettings = {
      type: "component",
      component: modalSettingsComponent,
    };
    modalStore.trigger(modal);
  }

  let form: HTMLFormElement;

  $: isFinishButtonActive = (exercises: Exercise[]) => {
    return exercises.length > 0;
  };
</script>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-row gap-4 justify-between">
      <Headline style="large">Overview</Headline>
      <Button action={openSettings} icon={true}>
        <SettingsIcon size="24" />
      </Button>
    </div>

    {#await data.streamed.currentSessionExercises then currentSessionExercises}
      {#if currentSessionExercises !== null}
        <div class="flex flex-col gap-8">
          <Headline style="medium">Current Session</Headline>

          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            {#if currentSessionExercises.exercises}
              {#each currentSessionExercises.exercises as exercise}
                <ExerciseCard {exercise} />
              {/each}
            {/if}
            <AddExerciseCard addAction={addExercise} />
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
          >
            <p>Finish Session</p>
            <PauseIcon size="14" />
          </SessionButton>

          <SessionButton
            sessionId={currentSessionExercises.id}
            formAction="?/deleteCurrentSession"
            bind:form
            buttonAction={() => confirmDelete(form, "session")}
            buttonClasses="variant-soft-error"
            buttonIcon={true}
          >
            <Trash2Icon size="18" />
          </SessionButton>
        </div>
      {:else}
        <form method="POST" action="?/createSession">
          <input
            type="text"
            name="userId"
            value={data.user.id}
            class="hidden"
          />
          <Button type="submit" classes="w-full">
            <div class="flex flex-row gap-4 justify-center items-center">
              <p>Start session</p>
              <PlayIcon size="14" />
            </div>
          </Button>
        </form>
      {/if}
    {/await}

    {#await data.streamed.previousSessions}
      <PreviousSessions loading={true} />
    {:then previousSessions}
      <PreviousSessions {previousSessions} />
    {/await}
  </div>
</Container>
