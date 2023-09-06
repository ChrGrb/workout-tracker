<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import WorkoutCard from "$lib/components/ExerciseCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import Header from "$lib/base/Header.svelte";
  import SessionHeadlineEditable from "../../components/session/currentSession/SessionHeadlineEditable.svelte";
  import updateSessionNameAction from "../../actions/updateSessionNameAction";
  import { getReplicache, useUserId } from "$lib/stores/stores";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import { onMount } from "svelte";
  import Button from "$lib/base/Button.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import deleteSessionAction from "../../actions/deleteSessionAction";
  import { Trash2Icon } from "svelte-feather-icons";
  import { goto } from "$app/navigation";
  import { getOverviewPath } from "$lib/utils/routes";

  export let data: PageData;

  let session: WorkoutSessionFull | null;

  let userId = useUserId();

  onMount(() => {
    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (
          await tx.scan({
            prefix: `user/${$userId}/session/${data.sessionId}`,
          })
        ).toArray(),
      {
        onData: (data) => {
          try {
            session = JSON.parse(data?.toString()) as WorkoutSessionFull;
          } catch {}
        },
      }
    );
  });
</script>

<Header>
  {#if session}
    <SessionHeadlineEditable
      bind:workoutSession={session}
      updateSessionNameAction={() => {
        if (session) updateSessionNameAction(session);
      }}
      slot="content"
    />
  {:else}
    Session
  {/if}
  <svelte:fragment slot="action">
    <ExitButton exitPath={getOverviewPath} />
  </svelte:fragment>
</Header>

<Container>
  {#if session}
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-4 items-start">
        <time
          use:svelteTime={{
            timestamp: session.createdAt,
            format: "MMMM D, YYYY · h:mm A ",
          }}
        />
      </div>
      <div class="flex flex-col w-full gap-4">
        <div class="flex flex-row justify-start">
          <Headline style="small">Exercises</Headline>
        </div>
        <div class="flex flex-col gap-2">
          {#if session.exercises && session.exercises.filter((exercise) => !exercise.isDeleted).length > 0}
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
              {#each session.exercises
                .filter((exercise) => !exercise.isDeleted)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as exercise (exercise.id)}
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

      <Button
        action={() => {
          confirmDeleteWithAction(
            () => {
              if (session) {
                deleteSessionAction(session);
                goto(getOverviewPath);
              }
            },
            "session",
            () => {}
          );
        }}
      >
        <p>Delete</p>
        <Trash2Icon size="18" />
      </Button>
    </div>
  {/if}
</Container>
