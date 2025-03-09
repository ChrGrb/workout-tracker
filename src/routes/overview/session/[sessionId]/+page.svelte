<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
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
  import { MoreHorizontalIcon, Trash2Icon } from "svelte-feather-icons";
  import { goto } from "$app/navigation";
  import { getOverviewPath } from "$lib/utils/routing/routes";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import { getModalStore } from "@skeletonlabs/skeleton";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let session: WorkoutSessionFull | null | undefined = $state(null);

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
            console.log(data);
            session = JSON.parse(data?.toString()) as WorkoutSessionFull;
          } catch {}
        },
      }
    );
  });

  const modalStore = getModalStore();
</script>

<Header>
  {#if session}
    {session.name}
  {:else}
    Session
  {/if}
  {#snippet action()}
    <ExitButton />
  {/snippet}
</Header>

<Container>
  {#if session}
    <div class="flex flex-col gap-12">
      <SessionHeadlineEditable
        bind:workoutSession={session}
        updateSessionNameAction={() => {
          if (session) updateSessionNameAction($state.snapshot(session));
        }}
      />
      <div class="flex flex-col gap-4 items-start">
        <time
          use:svelteTime={{
            timestamp: session.createdAt,
            format: "MMMM D, YYYY · h:mm A ",
          }}
        ></time>
      </div>
      <div class="flex flex-col w-full gap-4">
        <div class="flex flex-row justify-between items-center">
          <Headline style="small">Exercises</Headline>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <MoreHorizontalIcon size="24" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content class="w-56">
              <DropdownMenu.Item>
                <Button
                  action={() => {
                    confirmDeleteWithAction(
                      modalStore,
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
                  classes="btn !bg-transparent text-inherit transition-all drop-shadow-none border-none"
                >
                  <div class="flex flex-row gap-4 justify-center items-center">
                    Delete Session
                    <Trash2Icon size="18" />
                  </div>
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div class="flex flex-col gap-2">
          {#if session.exercises && filterDeleted(session.exercises).length > 0}
            <div class="flex flex-col gap-4">
              {#each filterDeleted(session.exercises).sort(sortByCreatedAt) as exercise (exercise.id)}
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
    </div>
  {/if}
</Container>
