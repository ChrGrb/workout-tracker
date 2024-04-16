<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import { goto } from "$app/navigation";
  import ExerciseSetCard from "$lib/components/ExerciseSetCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { MoreHorizontalIcon, Trash2Icon } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import { Accordion, popup, type PopupSettings } from "@skeletonlabs/skeleton";
  import { fade } from "svelte/transition";
  import Header from "$lib/base/Header.svelte";
  import ExerciseTimer from "./components/ExerciseTimer.svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import {
    getReplicache,
    useExerciseTimers,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import { getAddExerciseSetPath } from "$lib/utils/routing/routes";
  import { onMount } from "svelte";
  import type {
    ExerciseFull,
    WorkoutSessionFull,
  } from "$lib/utils/prismaTypes";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import deleteExerciseAction from "./actions/deleteExerciseAction";
  import deleteExerciseSetAction from "./actions/deleteExerciseSetAction";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import ExerciseInfoCard from "./components/ExerciseInfoCard.svelte";
  import ExerciseOverviewGraph from "./components/ExerciseOverviewGraph.svelte";
  import { getPreviousExercisesOfType } from "$lib/utils/data/previousExercisesOfType";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import { page } from "$app/stores";
  import { addCallbackToUrl } from "$lib/utils/routing/callbacks";
  import clsx from "clsx";

  export let data: PageData;

  let userId = useUserId();
  let exercise: ExerciseFull | undefined;
  let isActive = false;

  async function addSet() {
    if (exercise)
      goto(
        addCallbackToUrl(
          getAddExerciseSetPath({
            sessionId: exercise.sessionId,
            exerciseId: exercise.id,
          }),
          $page.url.pathname,
        ),
      );
  }

  const popupFeatured: PopupSettings = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target: "popupFeatured",
    // Defines which side of your trigger the popup will appear
    placement: "bottom",
    middleware: {
      offset: { crossAxis: -80 },
    },
  };

  let settings = useSettings();
  let exerciseTimers = useExerciseTimers();

  $: if (data.hasTimer && $settings.useTimer) {
    let thisExerciseTimer = currentExerciseTimer;
    if (thisExerciseTimer === undefined) {
      exerciseTimers.update((exerciseTimers) => {
        if (exercise)
          exerciseTimers.push({
            exerciseId: exercise.id!,
            startTime: Date.now(),
          });
        return exerciseTimers;
      });
    }
    currentExerciseTimer = $exerciseTimers.find(
      (element) => element.exerciseId == exercise?.id,
    );
  }

  $: currentExerciseTimer = $exerciseTimers.find(
    (element) => element.exerciseId == exercise?.id,
  );

  let previousExercises: ExerciseFull[] | null = null;

  $: previousExercisesOfType =
    previousExercises && exercise
      ? getPreviousExercisesOfType(previousExercises, exercise)
      : null;

  $: showInfoSection = exercise && exercise.type.description;

  onMount(() => {
    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (
          await tx.scan({
            prefix: `user/${$userId}/session/${data.sessionId}`,
          })
        ).toArray(),
      {
        onData: (value) => {
          try {
            isActive = !(JSON.parse(value?.toString()) as WorkoutSessionFull)
              .finished;
            exercise = filterDeleted(
              (JSON.parse(value?.toString()) as WorkoutSessionFull).exercises,
            )
              .filter((exercise) => exercise.id === data.exerciseId)
              .at(0);
          } catch {}
        },
      },
    );

    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (
          await tx.scan({
            prefix: `user/${$userId}/session`,
          })
        ).toArray(),
      {
        onData: (value) => {
          try {
            previousExercises = filterDeleted(
              value.map((element) =>
                JSON.parse(element!.toString()),
              ) as WorkoutSessionFull[],
            )
              .filter((workoutSession) => workoutSession.id !== data.sessionId)
              .flatMap((workoutSession) => workoutSession.exercises);
          } catch (error) {
            previousExercises = null;
          }
        },
      },
    );
  });
</script>

{#if exercise}
  <div
    class="card variant-filled-surface p-2 pr-0 shadow-xl z-50"
    data-popup="popupFeatured"
  >
    <div class="flex flex-col items-end">
      <Button
        action={() =>
          confirmDeleteWithAction(
            () => {
              if (exercise) {
                deleteExerciseAction(exercise);
                goto(data.callback);
              }
            },
            "exercise",
            () => {},
          )}
        classes="btn !bg-transparent text-inherit transition-all drop-shadow-none"
      >
        <div class="flex flex-row gap-4 justify-center items-center">
          Delete Exercise
          <Trash2Icon size="18" />
        </div>
      </Button>
    </div>
  </div>
{/if}

<Header>
  <svelte:fragment slot="action">
    <ExitButton exitPath={data.callback} />
  </svelte:fragment>
</Header>

<Container>
  {#if exercise}
    <div class="flex flex-col gap-12" in:fade={{ duration: 100 }}>
      <div class="flex flex-col gap-4 relative items-start">
        <Headline>{exercise?.type.name}</Headline>
        <time
          use:svelteTime={{
            timestamp: exercise.createdAt,
            format: "MMMM D, YYYY · h:mm A ",
          }}
        />
      </div>

      {#if showInfoSection}
        <Accordion>
          {#if exercise.type.description}
            <ExerciseInfoCard>
              <svelte:fragment slot="headline">Description</svelte:fragment>
              <article class="whitespace-pre-line">
                {exercise.type.description}
              </article>
            </ExerciseInfoCard>
          {/if}
        </Accordion>
      {/if}
      <div class="flex flex-col gap-12">
        <Headline style="small">Previous Performances</Headline>
        <div class="flex flex-col gap-6">
          {#if previousExercisesOfType && (previousExercisesOfType.length ?? 0 > 0) && exercise}
            <div class="flex flex-col">
              <ExerciseOverviewGraph
                previousExercises={previousExercisesOfType}
                {exercise}
              />
            </div>
          {/if}
          {#if previousExercisesOfType}
            <div class="flex flex-col gap-2">
              {#each filterDeleted(previousExercisesOfType)
                .sort(sortByCreatedAt)
                .slice(0, 3) as previousExercise}
                <ExerciseCard exercise={previousExercise} previous={true} />
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <hr />

      <div
        class="flex flex-col w-full gap-4"
        in:fade={{ duration: 100, delay: 120 }}
      >
        <div class="flex flex-row justify-between items-center">
          <Headline style="small">Sets</Headline>
          {#if isActive}
            <button use:popup={popupFeatured} type="button">
              <MoreHorizontalIcon size="24" />
            </button>
          {/if}
        </div>
        <div
          class={clsx("grid grid-cols-1 md:grid-cols-2 gap-2", {
            "mb-24": isActive,
            "mb-8": !isActive,
            "pb-16": currentExerciseTimer,
          })}
        >
          {#if exercise.sets}
            {#each filterDeleted(exercise.sets) as set (set.id)}
              <div
                animate:flip={{ delay: 100, duration: 250, easing: sineInOut }}
                transition:fade
              >
                <ExerciseSetCard
                  exerciseSet={set}
                  deleteAction={() => {
                    if (exercise) deleteExerciseSetAction(exercise, set);
                  }}
                />
              </div>
            {/each}
          {/if}
        </div>
      </div>

      {#if isActive}
        <FloatBottomWrapper>
          <Container>
            <div class="flex flex-col gap-4">
              {#if currentExerciseTimer}
                <div transition:fade={{ duration: 200, easing: sineInOut }}>
                  <ExerciseTimer
                    timer={currentExerciseTimer}
                    finishAction={() => {
                      exerciseTimers.update((exerciseTimers) => {
                        return exerciseTimers.filter(
                          (timer) =>
                            timer.exerciseId !=
                            currentExerciseTimer?.exerciseId,
                        );
                      });
                    }}
                    timerLength={$settings.timerValue}
                  />
                </div>
              {/if}
              <Button
                action={() => {
                  addSet();
                }}
                loadingOnClick={true}
                classes="w-full variant-filled-primary"
              >
                <div class="flex flex-row gap-4 items-center">
                  <p class="text-bold">Add set</p>
                </div>
              </Button>
            </div>
          </Container>
        </FloatBottomWrapper>
      {/if}
    </div>
  {/if}
</Container>
