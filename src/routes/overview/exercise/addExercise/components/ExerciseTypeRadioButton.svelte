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
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
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

  export let name: string;
  export let id: string;
  export let required = false;
  export let group = "";
  export let userId: string;
  export let description: string | null = null;

  let form: HTMLFormElement;
  let editMode = false;

  const workoutDescriptionModal: ModalComponent = {
    ref: WorkoutDescriptionModal,
    props: {},
  };

  const workoutDescriptionModalSettings: ModalSettings = {
    type: "component",
    component: workoutDescriptionModal,
    title: name,
    body: description ?? "",
    buttonTextCancel: "Close",
  };

  const popupFeatured: PopupSettings = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target: "popupFeatured",
    // Defines which side of your trigger the popup will appear
    placement: "top",
    middleware: {
      offset: { crossAxis: -24, mainAxis: -10 },
    },
  };
</script>

<div
  class="card variant-filled-surface p-2 pr-0 shadow-xl z-50"
  data-popup="popupFeatured"
>
  <div class="flex flex-col items-end">
    <SubmitFormWrapper action="?/deleteExerciseType" bind:form>
      <svelte:fragment slot="form-content">
        <input type="text" name="exerciseTypeId" value={id} class="hidden" />
        <input type="text" name="userId" value={userId} class="hidden" />
      </svelte:fragment>
      <DeleteButton
        bind:form
        toDeleteName="exercise type"
        slot="button"
        classes="variant-filled-surface drop-shadow-none"
      >
        <p slot="title" class="drop-shadow-none">Delete</p>
      </DeleteButton>
    </SubmitFormWrapper>
    <Button
      action={() => (editMode = true)}
      type="button"
      classes="variant-filled-surface transition-all drop-shadow-none"
    >
      <div class="flex flex-row gap-4 justify-center items-center">
        <p>Edit</p>
        <EditIcon size="18" />
      </div>
    </Button>

    {#if description}
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
    id={name}
    name="exercise-type-id"
    value={id}
    type="radio"
    class="hidden peer"
    bind:group
    {required}
  />
  <label
    for={name}
    class="card flex flex-col justify-center aspect-square text-center variant-soft-primary drop-shadow-md peer-checked:drop-shadow-lg peer-checked:variant-filled-primary text-on-surface-token peer-checked:text-on-primary-token transition-all relative"
  >
    {#if !editMode}
      <div
        transition:fade={{
          delay: editMode ? 0 : 150,
          duration: 200,
          easing: sineIn,
        }}
        class="absolute inset-0 flex flex-col items-center justify-center p-4"
      >
        <Headline style="small">{name}</Headline>

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
    {:else}
      <div
        transition:fade={{
          delay: editMode ? 150 : 0,
          duration: 200,
          easing: sineOut,
        }}
        class="absolute inset-0 flex flex-col items-center justify-center p-4"
      >
        <form
          use:enhance={() => {
            editMode = false;
          }}
          method="POST"
          action="?/updateExerciseType"
        >
          <input type="text" name="exerciseTypeId" value={id} class="hidden" />
          <input type="text" name="userId" value={userId} class="hidden" />
          <TextInput
            label=""
            name="exerciseTypeName"
            type="text"
            id="exerciseTypeName"
            input={name}
            inputClasses="variant-filled-tertiary text-center h3"
          />

          <div class="absolute bottom-2 right-2">
            <Button
              action={() => {}}
              classes="variant-soft-error bg-transparent text-inherit transition-all"
              icon={true}
              type="submit"
            >
              <div class="flex flex-row gap-4 justify-center items-center">
                <CheckIcon size="18" />
              </div>
            </Button>
          </div>
        </form>
        <div class="absolute bottom-2 left-2">
          <Button
            action={() => {
              editMode = false;
            }}
            classes="variant-soft-error bg-transparent text-inherit transition-all"
            icon={true}
          >
            <div class="flex flex-row gap-4 justify-center items-center">
              <XIcon size="18" />
            </div>
          </Button>
        </div>
      </div>
    {/if}
  </label>
</div>
