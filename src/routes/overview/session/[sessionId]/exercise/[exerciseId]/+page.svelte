<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import { goto } from "$app/navigation";
  import ExerciseSetCard from "$lib/components/ExerciseSetCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import {
    InfoIcon,
    MoreHorizontalIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import {
    Accordion,
    AccordionItem,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import ExerciseOverviewRecommendationSkeleteon from "./components/ExerciseOverviewRecommendationSkeleteon.svelte";
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
  import { getAddExerciseSetPath, getOverviewPath } from "$lib/utils/routes";
  import { onMount } from "svelte";
  import type {
    ExerciseFull,
    WorkoutSessionFull,
  } from "$lib/utils/prismaTypes";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import deleteExerciseAction from "./actions/deleteExerciseAction";
  import deleteExerciseSetAction from "./actions/deleteExerciseSetAction";

  export let data: PageData;

  let userId = useUserId();
  let exercise: ExerciseFull | undefined;
  let isActive = false;

  async function addSet() {
    if (exercise)
      goto(
        getAddExerciseSetPath({
          sessionId: exercise.sessionId,
          exerciseId: exercise.id,
        })
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

  $: currentExerciseTimer = $exerciseTimers.find(
    (element) => element.exerciseId == exercise?.id
  );

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
  }

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
            exercise = (
              JSON.parse(value?.toString()) as WorkoutSessionFull
            ).exercises
              .filter(
                (exercise) =>
                  exercise.id === data.exerciseId &&
                  exercise.isDeleted === false
              )
              .at(0);
          } catch {}
        },
      }
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
                goto(getOverviewPath);
              }
            },
            "exercise",
            () => {}
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
  <svelte:fragment>{exercise?.type.name}</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton exitPath={getOverviewPath} />
  </svelte:fragment>
</Header>

<Container>
  {#if exercise}
    <div class="flex flex-col gap-12" in:fade={{ duration: 100 }}>
      <div class="flex flex-col gap-4 relative items-start">
        <time
          use:svelteTime={{
            timestamp: exercise.createdAt,
            format: "MMMM D, YYYY · h:mm A ",
          }}
        />
      </div>

      <Accordion>
        {#if exercise.type.description}
          <AccordionItem
            class="card"
            regionControl="variant-soft-primary"
            regionPanel="pt-4 pb-6"
            hover=""
          >
            <svelte:fragment slot="lead"><InfoIcon size="18" /></svelte:fragment
            >
            <svelte:fragment slot="summary">Description</svelte:fragment>
            <svelte:fragment slot="content"
              ><article class="whitespace-pre-line">
                {exercise.type.description}
              </article></svelte:fragment
            >
          </AccordionItem>
        {/if}
        {#await data.streamed.recommendations}
          <div transition:fade={{ duration: 100 }}>
            <ExerciseOverviewRecommendationSkeleteon />
          </div>
        {:then recommendations}
          {#if recommendations}
            <div in:fade={{ duration: 100, delay: 120 }}>
              <AccordionItem
                class="card"
                regionControl="variant-soft-primary"
                regionPanel="py-4"
                hover=""
                open
              >
                <svelte:fragment slot="lead"
                  ><InfoIcon size="18" /></svelte:fragment
                >
                <svelte:fragment slot="summary">Recommendations</svelte:fragment
                >
                <svelte:fragment slot="content">
                  <div class="flex flex-row w-full basis-1/2">
                    <div class="flex flex-col basis-1/2 items-center">
                      <p class="font-semibold">Reps</p>
                      <p class="">{recommendations.recommendedReps}</p>
                      <p />
                    </div>
                    <div class="flex flex-col basis-1/2 items-center">
                      <p class="font-semibold">Weight</p>
                      <p class="">
                        {recommendations.recommendedWeight} kg
                      </p>
                      <p />
                    </div>
                  </div>
                </svelte:fragment>
              </AccordionItem>
            </div>
          {/if}
        {/await}
      </Accordion>

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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pb-56">
          {#if exercise.sets}
            {#each exercise.sets.filter((set) => !set.isDeleted) as set (set.id)}
              <div animate:flip={{ duration: 100, easing: sineInOut }}>
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
                            timer.exerciseId != currentExerciseTimer?.exerciseId
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
