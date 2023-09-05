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
  import Header from "$lib/base/Header.svelte";
  import {
    getReplicache,
    useExerciseTimers,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import CurrentSessionSection from "./components/session/currentSession/CurrentSessionSection.svelte";
  import LastWeekChart from "./components/LastWeekChart.svelte";
  import { onMount } from "svelte";
  import createSessionAction from "./actions/createSessionAction";
  import finishSessionAction from "./actions/finishSessionAction";
  import deleteSessionAction from "./actions/deleteSessionAction";
  import updateSessionNameAction from "./actions/updateSessionNameAction";
  import type {
    UserWithSettings,
    WorkoutSessionFull,
  } from "$lib/utils/prismaTypes";
  let sessions: WorkoutSessionFull[] = [];
  let user: UserWithSettings | null = null;

  let settings = useSettings();

  let modalSettingsComponent: ModalComponent;

  function openSettings() {
    const modal: ModalSettings = {
      type: "component",
      component: modalSettingsComponent,
    };
    modalStore.trigger(modal);
  }

  let userId = useUserId();

  useExerciseTimers();

  $: activeSession =
    sessions.filter((session) => !session.finished).at(0) ?? null;
  $: inactiveSessions = sessions.filter((session) => session.finished);

  onMount(() => {
    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (await tx.scan({ prefix: `user/${$userId ?? ""}/session` })).toArray(),
      {
        onData: (session) => {
          try {
            sessions = session.map((element) =>
              JSON.parse(element!.toString())
            ) as WorkoutSessionFull[];
            sessions = sessions.filter((session) => !session.isDeleted);
          } catch {}
        },
      }
    );

    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (await tx.scan({ prefix: `user/${$userId ?? ""}/user` })).toArray(),
      {
        onData: (value) => {
          try {
            user = JSON.parse(value!.toString()) as UserWithSettings;

            modalSettingsComponent = {
              ref: SettingsDrawer,
              props: { user: user },
            } as ModalComponent;

            settings.set(user.settings);
          } catch {}
        },
      }
    );
  });
</script>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-row gap-4 justify-between">
      <Header>Overview</Header>
      <Button action={openSettings} icon={true}>
        <MoreVerticalIcon size="24" />
      </Button>
    </div>

    <CurrentSessionSection
      bind:currentSession={activeSession}
      createSessionAction={() => {
        if ($userId) createSessionAction($userId);
      }}
      finishSessionAction={() => {
        if (activeSession) finishSessionAction(activeSession);
      }}
      deleteSessionAction={() => {
        if (activeSession) deleteSessionAction(activeSession);
      }}
      updateSessionNameAction={() => {
        if (activeSession) updateSessionNameAction(activeSession);
      }}
      userId={$userId ?? ""}
    />

    <hr />

    <div in:fade={{ duration: 100, delay: 120 }} class="flex flex-col gap-8">
      <LastWeekChart workoutSessions={inactiveSessions} />
      <PreviousSessions previousSessions={inactiveSessions} />
    </div>
  </div>
</Container>
