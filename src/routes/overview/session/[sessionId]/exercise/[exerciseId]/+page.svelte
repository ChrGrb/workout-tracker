<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import { goto } from "$app/navigation";
  import ExerciseSetCard from "$lib/components/ExerciseSetCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import {
    MoreHorizontalIcon,
    PauseIcon,
    PlayIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { fade } from "svelte/transition";
  import Header from "$lib/base/Header.svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import {
    getReplicache,
    useBackNavigation,
    useExerciseCooldownTimers,
    useExerciseTimers,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import { onMount } from "svelte";
  import type {
    ExerciseFull,
    WorkoutSessionFull,
  } from "$lib/utils/prismaTypes";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import deleteExerciseAction from "./actions/deleteExerciseAction";
  import deleteExerciseSetAction from "./actions/deleteExerciseSetAction";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import ExerciseOverviewGraph from "./components/ExerciseOverviewGraph.svelte";
  import { getPreviousExercisesOfType } from "$lib/utils/data/previousExercisesOfType";
  import ExerciseCard from "$lib/components/ExerciseCard.svelte";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import clsx from "clsx";
  import ExerciseCooldownTimer from "./components/ExerciseCooldownTimer.svelte";
  import ExerciseTimer from "./components/ExerciseTimer.svelte";
  import addExerciseSetAction from "./actions/addExerciseSetAction";
  import * as Drawer from "$lib/components/ui/drawer";
  import AddExerciseDrawer from "./components/AddExerciseDrawer.svelte";

  export let data: PageData;

  let userId = useUserId();
  let exercise: ExerciseFull | undefined;
  let isActive = false;

  let settings = useSettings();
  let exerciseCooldownTimers = useExerciseCooldownTimers();
  let exerciseTimers = useExerciseTimers();
  let finishExerciseTimer: () => void;

  let hasTimer = false;

  $: currentExerciseTimer = $exerciseTimers.find(
    (element) => element.exerciseId == exercise?.id
  );

  $: if (hasTimer && $settings.useTimer) {
    hasTimer = false;
    let thisExerciseTimer = currentExerciseCooldownTimer;
    if (thisExerciseTimer === undefined) {
      exerciseCooldownTimers.update((exerciseTimers) => {
        if (exercise)
          exerciseTimers.push({
            exerciseId: exercise.id!,
            startTime: Date.now(),
          });
        return exerciseTimers;
      });
    }
    currentExerciseCooldownTimer = $exerciseCooldownTimers.find(
      (element) => element.exerciseId == exercise?.id
    );
  }

  $: currentExerciseCooldownTimer = $exerciseCooldownTimers.find(
    (element) => element.exerciseId == exercise?.id
  );

  let previousExercises: ExerciseFull[] | null = null;

  $: previousExercisesOfType =
    previousExercises && exercise
      ? getPreviousExercisesOfType(previousExercises, exercise)
      : null;

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
              (JSON.parse(value?.toString()) as WorkoutSessionFull).exercises
            )
              .filter((exercise) => exercise.id === data.exerciseId)
              .at(0);
          } catch {}
        },
      }
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
                JSON.parse(element!.toString())
              ) as WorkoutSessionFull[]
            )
              .filter((workoutSession) => workoutSession.id !== data.sessionId)
              .flatMap((workoutSession) => workoutSession.exercises);
          } catch (error) {
            previousExercises = null;
          }
        },
      }
    );
  });

  const modalStore = getModalStore();

  const backNavigation = useBackNavigation();
</script>

<Drawer.Root>
  <Header>
    {exercise?.type.name}
    <svelte:fragment slot="action">
      <ExitButton />
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

        {#if previousExercisesOfType?.length}
          <div class="flex flex-col gap-12">
            <Headline style="small">Previous Performances</Headline>
            <div class="flex flex-col gap-6">
              {#if previousExercisesOfType && previousExercisesOfType?.length && exercise}
                <div class="flex flex-col">
                  <ExerciseOverviewGraph
                    previousExercises={previousExercisesOfType}
                    {exercise}
                  />
                </div>
              {/if}
              <div class="flex flex-col gap-2">
                {#each filterDeleted(previousExercisesOfType)
                  .sort(sortByCreatedAt)
                  .slice(0, 3) as previousExercise}
                  <ExerciseCard exercise={previousExercise} previous={true} />
                {/each}
              </div>
            </div>
          </div>
        {/if}

        <hr />

        <div
          class="flex flex-col w-full gap-4"
          in:fade={{ duration: 100, delay: 120 }}
        >
          <div class="flex flex-row justify-between items-center">
            <Headline style="small">Sets</Headline>
            {#if isActive}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <MoreHorizontalIcon size="24" />
                </DropdownMenu.Trigger>

                <DropdownMenu.Content class="w-56">
                  <DropdownMenu.Item>
                    <Button
                      action={() =>
                        confirmDeleteWithAction(
                          modalStore,
                          () => {
                            if (exercise) {
                              deleteExerciseAction(exercise);

                              backNavigation.set(true);
                              history.back();
                            }
                          },
                          "exercise",
                          () => {}
                        )}
                      classes="btn !bg-transparent text-inherit transition-all drop-shadow-none border-none"
                    >
                      <div
                        class="flex flex-row gap-4 justify-center items-center"
                      >
                        Delete Exercise
                        <Trash2Icon size="18" />
                      </div>
                    </Button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            {/if}
          </div>
          <div
            class={clsx("grid grid-cols-1 md:grid-cols-2 gap-2", {
              "mb-24": isActive,
              "mb-8": !isActive,
              "pb-16": currentExerciseCooldownTimer,
            })}
          >
            {#if exercise.sets}
              {#each filterDeleted(exercise.sets) as set (set.id)}
                <div
                  animate:flip={{
                    delay: 100,
                    duration: 250,
                    easing: sineInOut,
                  }}
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
                {#if currentExerciseCooldownTimer}
                  <div transition:fade={{ duration: 200, easing: sineInOut }}>
                    <ExerciseCooldownTimer
                      timer={currentExerciseCooldownTimer}
                      finishAction={() => {
                        exerciseCooldownTimers.update((exerciseTimers) => {
                          return exerciseTimers.filter(
                            (timer) =>
                              timer.exerciseId !=
                              currentExerciseCooldownTimer?.exerciseId
                          );
                        });
                      }}
                      timerLength={$settings.timerValue}
                    />
                  </div>
                {/if}

                {#if exercise.type.category === "WEIGHT"}
                  <Drawer.Trigger>
                    <Button classes="w-full variant-filled-primary">
                      <div class="flex flex-row gap-4 items-center">
                        <p class="text-bold">Add set</p>
                      </div>
                    </Button></Drawer.Trigger
                  >
                {/if}

                {#if exercise.type.category === "TIME"}
                  {#if currentExerciseTimer}
                    <div transition:fade={{ duration: 200, easing: sineInOut }}>
                      <ExerciseTimer
                        timer={currentExerciseTimer}
                        finishAction={(elapsedTime) => {
                          exerciseTimers.update((exerciseTimers) => {
                            return exerciseTimers.filter(
                              (timer) =>
                                timer.exerciseId !=
                                currentExerciseTimer?.exerciseId
                            );
                          });
                          if (exercise !== undefined) {
                            addExerciseSetAction(exercise, {
                              time: elapsedTime,
                              exerciseSetType: "WORKOUT",
                            });
                          }
                        }}
                        bind:onFinish={finishExerciseTimer}
                      />
                    </div>
                  {/if}
                  {#if !currentExerciseTimer}
                    <Button
                      action={() => {
                        if (!currentExerciseTimer && exercise !== undefined) {
                          exerciseTimers.update((exerciseTimers) => {
                            if (exercise !== undefined)
                              exerciseTimers.push({
                                exerciseId: exercise.id,
                                startTime: Date.now(),
                              });
                            return exerciseTimers;
                          });
                        }
                      }}
                      loadingOnClick={true}
                      classes="w-full variant-filled-primary"
                    >
                      <div class="flex flex-row gap-4 items-center -ml-4">
                        <PlayIcon size="16" />
                        <p class="text-bold">Start Timer</p>
                      </div>
                    </Button>
                  {:else}
                    <Button
                      action={() => {
                        finishExerciseTimer();
                      }}
                      loadingOnClick={true}
                      classes="w-full variant-filled-primary"
                    >
                      <div class="flex flex-row gap-4 items-center -ml-4">
                        <PauseIcon size="16" />
                        <p class="text-bold">Stop Timer</p>
                      </div>
                    </Button>
                  {/if}
                {/if}
              </div>
            </Container>
          </FloatBottomWrapper>
        {/if}
      </div>
    {/if}
  </Container>

  {#if exercise}
    <AddExerciseDrawer {exercise} bind:hasTimer />
  {/if}
</Drawer.Root>
