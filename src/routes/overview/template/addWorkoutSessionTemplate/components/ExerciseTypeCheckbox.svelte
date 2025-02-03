<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import {
    InfoIcon,
    MoreHorizontalIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import {
    type ModalSettings,
    type ModalComponent,
    type PopupSettings,
    popup,
    getModalStore,
  } from "@skeletonlabs/skeleton";
  import WorkoutDescriptionModal from "$lib/modals/WorkoutDescriptionModal.svelte";
  import type { ExerciseType } from "@prisma/client";
  import { useUserId } from "$lib/stores/stores";
  import deleteExerciseTypeAction from "../../../session/[sessionId]/addExercise/actions/deleteExerciseTypeAction";

  interface Props {
    checked: boolean;
    exerciseType: ExerciseType;
  }

  let { checked = $bindable(), exerciseType }: Props = $props();

  let userId = useUserId();

  const workoutDescriptionModal: ModalComponent = {
    ref: WorkoutDescriptionModal,
    props: {},
  };

  const workoutDescriptionModalSettings: ModalSettings = {
    type: "component",
    component: workoutDescriptionModal,
    title: exerciseType.name,
    body: exerciseType.description ?? "",
    buttonTextCancel: "Close",
  };

  const popupFeatured: PopupSettings = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target: "popupFeatured" + exerciseType.name,
    // Defines which side of your trigger the popup will appear
    placement: "top",
    middleware: {
      offset: { crossAxis: -24, mainAxis: -10 },
    },
  };

  const modalStore = getModalStore();
</script>

<div
  class="card variant-filled-surface p-2 pr-0 shadow-xl z-50"
  data-popup={"popupFeatured" + exerciseType.name}
>
  <div class="flex flex-col items-end">
    <Button
      action={() =>
        confirmDeleteWithAction(
          modalStore,
          () => {
            if ($userId) deleteExerciseTypeAction($userId, exerciseType);
          },
          "exercise type",
          () => {}
        )}
      classes="btn !bg-transparent variant-filled-surface text-inherit transition-all drop-shadow-none"
    >
      <div class="flex flex-row gap-4 justify-center items-center">
        Delete
        <Trash2Icon size="18" />
      </div>
    </Button>

    {#if exerciseType.description}
      <Button
        action={() => modalStore.trigger(workoutDescriptionModalSettings)}
        classes="variant-filled-surface transition-all drop-shadow-none"
        type="button"
      >
        <div class="flex flex-row gap-4 justify-center items-center">
          <p>Info</p>
          <InfoIcon size="18" />
        </div>
      </Button>
    {/if}
  </div>
</div>

<div>
  <input
    id={exerciseType.name}
    name="exercise-type-id"
    value={exerciseType.id}
    type="checkbox"
    class="hidden peer"
    bind:checked
  />
  <label
    for={exerciseType.name}
    class="card flex flex-col justify-center text-center variant-soft-primary drop-shadow-md peer-checked:drop-shadow-lg peer-checked:variant-filled-primary text-on-surface-token peer-checked:text-on-primary-token transition-colors relative"
  >
    <div class="flex flex-col items-start justify-between p-4">
      <Headline style="small">{exerciseType.name}</Headline>

      <div class="absolute bottom-2 right-2">
        <button
          class="variant-filled-surface !bg-transparent text-inherit transition-all dark:text-primary-50"
          type="button"
          use:popup={popupFeatured}
        >
          <div class="btn-icon flex flex-row justify-center items-center">
            <MoreHorizontalIcon size="18" />
          </div>
        </button>
      </div>
    </div>
  </label>
</div>
