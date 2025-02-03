<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { useUserId } from "$lib/stores/stores";
  import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
  import { getModalStore, ProgressRadial } from "@skeletonlabs/skeleton";
  import createSessionFromTemplateAction from "../../../../actions/createSessionFromTemplateAction";
  import { useMotionValue } from "svelte-motion";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import clsx from "clsx";
  import SwipeToAction from "$lib/base/SwipeToAction.svelte";
  import deleteWorkoutSessionTemplateAction from "../../../../actions/deleteWorkoutSessionTemplate";

  interface Props {
    workoutSessionTemplate: WorkoutSessionTemplateWithExerciseTypes;
  }

  let { workoutSessionTemplate }: Props = $props();

  let userId = useUserId();
  let x = $state(useMotionValue(0));

  const modalStore = getModalStore();
</script>

<SwipeToAction
  deleteAction={() => {
    confirmDeleteWithAction(
      modalStore,
      () => {
        deleteWorkoutSessionTemplateAction(workoutSessionTemplate);
      },
      "session template",
      () => {}
    );
  }}
  buttonWidth={50}
  bind:x
>
  <Button
    classes={clsx(
      "card w-full flex flex-row gap-2 justify-between p-4 text-center relative drop-shadow-lg variant-filled-primary",
      {
        "active:scale-100 active:brightness-100": $x !== 0,
      }
    )}
    action={() => {
      if ($x === 0 || $x === undefined)
        createSessionFromTemplateAction($userId ?? "", workoutSessionTemplate);
    }}
  >
    {#snippet spinner()}
        <ProgressRadial
        
        width="w-[48px]"
        stroke={100}
        meter="stroke-primary-50"
      />
      {/snippet}
    <Headline
      style="small"
      classes="break-words whitespace-normal line-clamp-3 max-w-[95%] text-start"
    >
      {workoutSessionTemplate.name}
    </Headline>
    {#if workoutSessionTemplate.exerciseTypes.length > 0}
      <div class="flex flex-row gap-2 flex-wrap justify-center !ml-0">
        <div
          class="flex flex-row badge rounded-full pr-2.5 bg-white text-black"
        >
          <p>{workoutSessionTemplate.exerciseTypes.length} exercises</p>
        </div>
      </div>
    {/if}
  </Button>
</SwipeToAction>
