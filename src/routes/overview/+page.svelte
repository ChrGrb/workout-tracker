<script lang="ts">

  import Container from "$lib/base/Container.svelte";
  import { MoreVerticalIcon } from "svelte-feather-icons";
  import Button from "$lib/base/Button.svelte";
  import PreviousSessions from "./components/session/PreviousSessions.svelte";
  import SettingsDrawer from "./components/settings/SettingsDrawer.svelte";
  import { fade } from "svelte/transition";
  import Header from "$lib/base/Header.svelte";
  import {
    useExerciseCooldownTimers,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import CurrentSessionSection from "./components/session/currentSession/CurrentSessionSection.svelte";
  import LastWeekChart from "./components/LastWeekChart.svelte";
  import createSessionAction from "./actions/createSessionAction";
  import finishSessionAction from "./actions/finishSessionAction";
  import deleteSessionAction from "./actions/deleteSessionAction";
  import updateSessionNameAction from "./actions/updateSessionNameAction";
  import type {
    UserWithSettings,
    WorkoutSessionFull,
    WorkoutSessionTemplateWithExerciseTypes,
  } from "$lib/utils/prismaTypes";
  import * as Drawer from "$lib/components/ui/drawer";
  import { getZ } from "$lib/zero/z.svelte";
  import { queries } from "$lib/zero/queries";

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

  // Zero synced queries (reactive). Kept in $state vars so child `bind:` props and
  // the existing Prisma-derived types downstream are unchanged. `createdAt` is now
  // an epoch-millis number rather than a Date/ISO string, which the consumers
  // (new Date(...), svelte-time) handle transparently.
  const z = getZ();
  const sessionsQuery = z.createQuery(queries.sessions());
  const templatesQuery = z.createQuery(queries.templates());
  const meQuery = z.createQuery(queries.me());

  $effect(() => {
    sessions = sessionsQuery.data as unknown as WorkoutSessionFull[];
  });

  $effect(() => {
    sessionTemplates =
      templatesQuery.data as unknown as WorkoutSessionTemplateWithExerciseTypes[];
  });

  $effect(() => {
    const u = meQuery.data as unknown as UserWithSettings | undefined;
    if (u) {
      user = u;
      if (u.settings) settings.set(u.settings);
    }
  });
</script>

<Drawer.Root>
  <Header contentAlwaysVisible={true} headlineStyle="medium">
    Overview
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
