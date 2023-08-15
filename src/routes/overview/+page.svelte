<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import { MoreVerticalIcon } from "svelte-feather-icons";
  import Button from "$lib/base/Button.svelte";
  import PreviousSessions from "./components/session/PreviousSessions.svelte";
  import SettingsDrawer from "./components/settings/SettingsDrawer.svelte";
  import {
    modalStore,
    type ModalComponent,
    type ModalSettings,
  } from "@skeletonlabs/skeleton";
  import { fade } from "svelte/transition";
  import SessionSkeleton from "./components/session/SessionSkeleton.svelte";
  import Header from "$lib/base/Header.svelte";
  import { useExerciseTimers, useSettings } from "$lib/stores/stores";
  import CurrentSessionSection from "./components/session/currentSession/CurrentSessionSection.svelte";
  import LastWeekChart from "./components/LastWeekChart.svelte";

  export let data: PageData;

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
      <CurrentSessionSection {currentSessionExercises} userId={data.user.id} />
    {/await}

    <hr />

    {#await data.streamed.previousSessions}
      <div transition:fade={{ duration: 100 }} class="flex flex-col gap-8">
        <LastWeekChart loading={true} />
        <PreviousSessions loading={true} />
      </div>
    {:then previousSessions}
      <div in:fade={{ duration: 100, delay: 120 }} class="flex flex-col gap-8">
        <LastWeekChart workoutSessions={previousSessions} />
        <PreviousSessions {previousSessions} />
      </div>
    {/await}
  </div>
</Container>
