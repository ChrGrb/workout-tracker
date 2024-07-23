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
  import deleteExerciseTypeAction from "../actions/deleteExerciseTypeAction";
  import type { ExerciseType } from "@prisma/client";
  import { useUserId } from "$lib/stores/stores";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  export let group: string;
  export let required: boolean;
  export let exerciseType: ExerciseType;

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

  const modalStore = getModalStore();
</script>

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
    class="card flex flex-col justify-center text-center variant-soft-primary drop-shadow-md peer-checked:drop-shadow-lg peer-checked:variant-filled-primary text-on-surface-token peer-checked:text-on-primary-token transition-colors relative"
  >
    <div class="flex flex-col items-start justify-start p-4">
      <Headline style="small">{exerciseType.name}</Headline>

      <div class="absolute bottom-2 right-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class=" btn-icon flex flex-row justify-center items-center"
          >
            <MoreHorizontalIcon size="24" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            {#if exerciseType.description}
              <DropdownMenu.Item class="w-full justify-end">
                <Button
                  action={() =>
                    modalStore.trigger(workoutDescriptionModalSettings)}
                  classes="btn !bg-transparent text-inherit transition-all drop-shadow-none border-none"
                  type="button"
                >
                  <div
                    class="flex flex-row gap-4 justify-between w-full items-center"
                  >
                    <p>Info</p>
                    <InfoIcon size="18" />
                  </div>
                </Button>
              </DropdownMenu.Item>
            {/if}

            <DropdownMenu.Item>
              <Button
                action={() =>
                  confirmDeleteWithAction(
                    modalStore,
                    () => {
                      if ($userId)
                        deleteExerciseTypeAction($userId, exerciseType);
                    },
                    "exercise type",
                    () => {}
                  )}
                classes="btn !bg-transparent text-inherit transition-all drop-shadow-none border-none"
              >
                <div class="flex flex-row gap-4 justify-center items-center">
                  Delete
                  <Trash2Icon size="18" />
                </div>
              </Button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  </label>
</div>
