<script lang="ts">
  import { run } from "svelte/legacy";

  import Button from "$lib/base/Button.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import { useUserId } from "$lib/stores/stores";
  import * as Drawer from "$lib/components/ui/drawer";
  import createExerciseTypeAction from "../actions/createExerciseTypeAction";
  import updateExerciseTypeAction from "../actions/updateExerciseTypeAction";
  import InputSelect from "$lib/base/input/InputSelect.svelte";

  interface Props {
    exerciseTypeName?: string;
    exerciseCategory?: "WEIGHT" | "TIME";
    exerciseTypeArea?:
      | "CHEST"
      | "SHOULDERS"
      | "ARMS"
      | "CORE"
      | "BACK"
      | "LEGS"
      | null;
    exerciseTypeId?: string;
    isOpen: any;
    editMode?: boolean;
  }

  let {
    exerciseTypeName = $bindable(""),
    exerciseCategory = $bindable("WEIGHT"),
    exerciseTypeArea = $bindable(null),
    exerciseTypeId = "",
    isOpen,
    editMode = false,
  }: Props = $props();

  let userId = useUserId();

  const reset = () => {
    exerciseTypeName = "";
    exerciseCategory = "WEIGHT";
  };

  const areas = [
    { value: "CHEST", label: "Chest" },
    { value: "SHOULDERS", label: "Shoulders" },
    { value: "ARMS", label: "Arms" },
    { value: "CORE", label: "Core" },
    { value: "BACK", label: "Back" },
    { value: "LEGS", label: "Legs" },
  ];

  let isInvalid = $derived(exerciseTypeName.length === 0);

  $effect(() => {
    if (!isOpen) {
      reset();
    }
  });
</script>

<div>
  <Drawer.Header>
    <Drawer.Title
      >{editMode ? "Update Exercise Type" : "Add Exercise Type"}</Drawer.Title
    >
  </Drawer.Header>

  <div
    class="max-w-md w-full mx-auto flex flex-col overflow-auto p-4 rounded-t-[10px]"
  >
    <div class="flex flex-col gap-12">
      <div class="flex flex-col gap-4">
        <RadioSelect
          items={[
            { name: "Weight", value: "WEIGHT" },
            { name: "Time", value: "TIME" },
          ]}
          name="exerciseCategory"
          label="Category"
          bind:group={exerciseCategory}
        />
        <InputSelect
          items={areas}
          name="exerciseTypeArea"
          label="Area"
          bind:value={exerciseTypeArea}
        />
        <TextInput
          name="exerciseTypeName"
          id="exerciseTypeName"
          type="text"
          label="Name"
          required={true}
          bind:input={exerciseTypeName}
        />
      </div>

      <Drawer.Close class="w-full">
        <Button
          action={async () => {
            if ($userId)
              if (editMode) {
                updateExerciseTypeAction(
                  {
                    id: exerciseTypeId,
                    name: exerciseTypeName,
                    area: exerciseTypeArea,
                    category: exerciseCategory,
                  },
                  $userId
                );
              } else {
                createExerciseTypeAction(
                  $userId,
                  exerciseTypeName,
                  exerciseTypeArea,
                  exerciseCategory
                );
              }

            reset();
          }}
          disabled={isInvalid}
        >
          {editMode ? "Update" : "Add"}
        </Button>
      </Drawer.Close>
    </div>
  </div>
</div>
