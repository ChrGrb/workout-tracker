<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import {
    CheckIcon,
    EditIcon,
    InfoIcon,
    MoreHorizontalIcon,
    Trash2Icon,
    XIcon,
  } from "svelte-feather-icons";
  import {
    confirmDelete,
    confirmDeleteWithAction,
  } from "$lib/modals/ConfirmDeleteModalWrapper";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import { fade } from "svelte/transition";
  import { sineIn, sineOut } from "svelte/easing";
  import {
    modalStore,
    type ModalSettings,
    type ModalComponent,
    type PopupSettings,
    popup,
  } from "@skeletonlabs/skeleton";
  import WorkoutDescriptionModal from "$lib/modals/WorkoutDescriptionModal.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import DeleteButton from "$lib/base/DeleteButton.svelte";
  import deleteExerciseTypeAction from "../actions/deleteExerciseTypeAction";
  import type { ExerciseType } from "@prisma/client";
  import { useUserId } from "$lib/stores/stores";

  export let group: string;
  export let required: boolean;
  export let exerciseType: ExerciseType;

  let userId = useUserId();

  let form: HTMLFormElement;
  let editMode = false;

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
</script>

<div
  class="card variant-filled-surface p-2 pr-0 shadow-xl z-50"
  data-popup={"popupFeatured" + exerciseType.name}
>
  <div class="flex flex-col items-end">
    <Button
      action={() =>
        confirmDeleteWithAction(
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
    type="radio"
    class="hidden peer"
    bind:group
    {required}
  />
  <label
    for={exerciseType.name}
    class="card flex flex-col justify-center aspect-square text-center variant-soft-primary drop-shadow-md peer-checked:drop-shadow-lg peer-checked:variant-filled-primary text-on-surface-token peer-checked:text-on-primary-token transition-all relative"
  >
    <div
      transition:fade={{
        delay: editMode ? 0 : 150,
        duration: 200,
        easing: sineIn,
      }}
      class="absolute inset-0 flex flex-col items-center justify-center p-4"
    >
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
