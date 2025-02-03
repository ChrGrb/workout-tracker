<script lang="ts">
  import { run } from "svelte/legacy";

  import Container from "$lib/base/Container.svelte";
  import { MoreVerticalIcon } from "svelte-feather-icons";
  import Button from "$lib/base/Button.svelte";
  import PreviousSessions from "./components/session/PreviousSessions.svelte";
  import SettingsDrawer from "./components/settings/SettingsDrawer.svelte";
  import { type ModalComponent } from "@skeletonlabs/skeleton";
  import { fade } from "svelte/transition";
  import Header from "$lib/base/Header.svelte";
  import {
    getReplicache,
    useExerciseCooldownTimers,
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
    WorkoutSessionTemplateWithExerciseTypes,
  } from "$lib/utils/prismaTypes";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import type { ReadTransaction } from "replicache";
  import * as Drawer from "$lib/components/ui/drawer";

  let sessions: WorkoutSessionFull[] = $state([]);
  let user: UserWithSettings | null = $state(null);
  let sessionTemplates: WorkoutSessionTemplateWithExerciseTypes[] = $state([]);

  let settings = useSettings();

  let userId = useUserId();

  useExerciseCooldownTimers();

  let activeSession: WorkoutSessionFull | null = $state(null);

  $effect(() => {
    activeSession =
      sessions.filter((session) => !session.finished).at(0) ?? null;
  });
  let inactiveSessions = $derived(
    sessions.filter((session) => session.finished)
  );

  onMount(() => {
    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (await tx.scan({ prefix: `user/${$userId ?? ""}/session` })).toArray(),
      {
        onData: (session) => {
          try {
            sessions = filterDeleted(
              session.map((element) =>
                JSON.parse(element!.toString())
              ) as WorkoutSessionFull[]
            );
          } catch {}
        },
      }
    );

    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (
          await tx.scan({
            prefix: `user/${$userId ?? ""}/user/workoutSessionTemplates`,
          })
        ).toArray(),
      {
        onData: (value) => {
          try {
            sessionTemplates = filterDeleted(
              value.map((element) =>
                JSON.parse(element!.toString())
              ) as WorkoutSessionTemplateWithExerciseTypes[]
            );
          } catch {}
        },
      }
    );

    getReplicache($userId ?? "").subscribe(
      async (tx: ReadTransaction) => await tx.get(`user/${$userId ?? ""}/user`),
      {
        onData: (value) => {
          try {
            user = JSON.parse(value!.toString()) as UserWithSettings;

            settings.set(user.settings);
          } catch {}
        },
      }
    );
  });
</script>

<Drawer.Root>
  <Header contentAlwaysVisible={true} headlineStyle="medium">
    {#snippet children()}
      Overview
    {/snippet}
    {#snippet actionEnd()}
      <Drawer.Trigger>
        <Button icon={true}>
          <MoreVerticalIcon size="24" />
        </Button>
      </Drawer.Trigger>
    {/snippet}
  </Header>
  <Container>
    <div class="flex flex-col gap-12 pb-20">
      <CurrentSessionSection
        bind:workoutSessionTemplates={sessionTemplates}
        bind:currentSession={activeSession}
        createSessionAction={() => {
          if ($userId) createSessionAction($userId);
        }}
        finishSessionAction={() => {
          if (activeSession)
            finishSessionAction($state.snapshot(activeSession));
        }}
        deleteSessionAction={() => {
          if (activeSession)
            deleteSessionAction($state.snapshot(activeSession));
        }}
        updateSessionNameAction={() => {
          if (activeSession)
            updateSessionNameAction($state.snapshot(activeSession));
        }}
      />

      <hr />

      <div in:fade={{ duration: 100, delay: 120 }} class="flex flex-col gap-12">
        <LastWeekChart workoutSessions={inactiveSessions} />
        <PreviousSessions previousSessions={inactiveSessions} />
      </div>
    </div>
  </Container>

  {#if user}
    <SettingsDrawer {user} />
  {/if}
</Drawer.Root>
