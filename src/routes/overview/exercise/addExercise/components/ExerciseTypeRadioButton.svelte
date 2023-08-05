<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import {
    CheckIcon,
    EditIcon,
    InfoIcon,
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
  } from "@skeletonlabs/skeleton";
  import WorkoutDescriptionModal from "$lib/modals/WorkoutDescriptionModal.svelte";

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
</script>

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
    class="card flex flex-col justify-center aspect-square text-center variant-soft-primary peer-checked:variant-filled-primary text-primary-700 peer-checked:text-white transition-all relative"
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
        <form
          method="POST"
          action="?/deleteExerciseType"
          class="absolute top-2 right-2"
          use:enhance
          bind:this={form}
        >
          <input type="text" name="exerciseTypeId" value={id} class="hidden" />
          <input type="text" name="userId" value={userId} class="hidden" />
          <Button
            action={() => confirmDelete(form, "exercise type")}
            classes="variant-soft-error bg-transparent text-inherit transition-all"
            icon={true}
          >
            <div class="flex flex-row gap-4 justify-center items-center">
              <Trash2Icon size="18" />
            </div>
          </Button>
        </form>

        <div class="absolute bottom-2 right-2">
          <Button
            action={() => (editMode = true)}
            classes="variant-filled-surface transition-all"
            icon={true}
          >
            <div class="btn-icon flex flex-row justify-center items-center">
              <EditIcon size="18" />
            </div>
          </Button>
        </div>

        {#if description}
          <div class="absolute top-2 left-2">
            <Button
              action={() => modalStore.trigger(workoutDescriptionModalSettings)}
              classes="variant-filled-surface transition-all"
              icon={true}
            >
              <div class="btn-icon flex flex-row justify-center items-center">
                <InfoIcon size="18" />
              </div>
            </Button>
          </div>
        {/if}
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
        <div class="absolute top-2 right-2">
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
