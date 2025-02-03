<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { MoreHorizontalIcon, Trash2Icon } from "svelte-feather-icons";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import deleteExerciseTypeAction from "../actions/deleteExerciseTypeAction";
  import type { ExerciseType } from "@prisma/client";
  import { useUserId } from "$lib/stores/stores";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { getModalStore } from "@skeletonlabs/skeleton";

  interface Props {
    group: string;
    required: boolean;
    exerciseType: ExerciseType;
    onEditClicked: (exerciseId: string) => void;
  }

  let {
    group = $bindable(),
    required,
    exerciseType,
    onEditClicked
  }: Props = $props();

  let dropdownMenuOpen = $state(false);

  let userId = useUserId();

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
        <DropdownMenu.Root bind:open={dropdownMenuOpen}>
          <DropdownMenu.Trigger
            class=" btn-icon flex flex-row justify-center items-center"
          >
            <MoreHorizontalIcon size="24" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Button
                action={() => {
                  dropdownMenuOpen = false;
                  onEditClicked(exerciseType.id);
                }}
                classes="btn !bg-transparent text-inherit transition-all drop-shadow-none border-none w-full"
              >
                <div
                  class="flex flex-row gap-4 justify-between items-center w-full"
                >
                  Edit
                  <Trash2Icon size="18" />
                </div>
              </Button>
            </DropdownMenu.Item>

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
                <div
                  class="flex flex-row gap-4 justify-between items-center w-full"
                >
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
