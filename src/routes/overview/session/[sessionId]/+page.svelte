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
  import LiquidGlass from "$lib/base/LiquidGlass.svelte";
  import SessionHeadlineEditable from "../../components/session/currentSession/SessionHeadlineEditable.svelte";
  import updateSessionNameAction from "../../actions/updateSessionNameAction";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import { getZ } from "$lib/zero/z.svelte";
  import { queries } from "$lib/zero/queries";
  import Button from "$lib/base/Button.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import deleteSessionAction from "../../actions/deleteSessionAction";
  import {
    MoreHorizontalIcon,
    Share2Icon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import { goto } from "$app/navigation";
  import { getOverviewPath } from "$lib/utils/routing/routes";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import { formatWorkoutForExport } from "$lib/utils/data/formatWorkoutExport";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import { getAreaScoresFromExercises } from "$lib/utils/data/getAreaScoresFromExercises";
  import MuscleChart from "../../components/session/MuscleChart.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let session: WorkoutSessionFull | null | undefined = $state(null);

  const sessionQuery = getZ().createQuery(
    queries.sessionById({ id: data.sessionId }),
  );
  $effect(() => {
    session = (sessionQuery.data as unknown as WorkoutSessionFull) ?? null;
  });

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  // Export the workout as plain text for another app's AI importer (Bevel).
  // Prefer the native share sheet; fall back to the clipboard.
  async function exportWorkout() {
    if (!session) return;
    const text = formatWorkoutForExport($state.snapshot(session));

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: session.name, text });
        return;
      } catch (err) {
        // The user dismissed the share sheet — don't fall through to copying.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      toastStore.trigger({
        message: "Workout copied to clipboard",
        background: "variant-filled-success",
      });
    } catch {
      toastStore.trigger({
        message: "Could not export the workout",
        background: "variant-filled-error",
      });
    }
  }

  const sessionAreas = $derived(
    getAreaScoresFromExercises(
      (session as unknown as WorkoutSessionFull)?.exercises,
    ),
  );
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
  {#snippet actionEnd()}
    {#if session}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <LiquidGlass
            specular
            className="h-10 w-10 rounded-full flex items-center justify-center !bg-black/15 text-white transition-transform active:scale-95"
          >
            <MoreHorizontalIcon size="24" />
          </LiquidGlass>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content class="w-56">
          <DropdownMenu.Item>
            <Button
              action={exportWorkout}
              classes="btn !bg-transparent text-inherit transition-all drop-shadow-none border-none"
            >
              <div class="flex flex-row gap-4 justify-center items-center">
                Export workout
                <Share2Icon size="18" />
              </div>
            </Button>
          </DropdownMenu.Item>
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
                  () => {},
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
    {/if}
  {/snippet}
</Header>

<Container>
  {#if session}
    <div class="flex flex-col gap-8">
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
            format: "MMM. D, YYYY · h:mm A ",
          }}
        ></time>
      </div>

      <div>
        <Headline style="small">Muscular Load</Headline>
        <div class="px-10">
          <MuscleChart areas={sessionAreas} />
        </div>
      </div>

      <div class="flex flex-col w-full gap-4">
        <Headline style="small">Exercises</Headline>
        <div class="flex flex-col gap-2">
          {#if session.exercises && session.exercises.length > 0}
            <div class="flex flex-col gap-4">
              {#each session.exercises.toSorted(sortByCreatedAt) as exercise (exercise.id)}
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
