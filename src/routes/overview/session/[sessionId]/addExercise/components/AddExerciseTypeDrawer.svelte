<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import { useUserId } from "$lib/stores/stores";
  import * as Drawer from "$lib/components/ui/drawer";
  import createExerciseTypeAction from "../actions/createExerciseTypeAction";
  import updateExerciseTypeAction from "../actions/updateExerciseTypeAction";

  export let exerciseTypeName = "";
  export let exerciseCategory: "WEIGHT" | "TIME" = "WEIGHT";
  export let exerciseTypeId = "";
  export let isOpen;
  export let editMode = false;

  let userId = useUserId();

  $: isInvalid = exerciseTypeName.length === 0;

  $: if (!isOpen) {
    reset();
  }

  const reset = () => {
    exerciseTypeName = "";
    exerciseCategory = "WEIGHT";
  };
</script>

<Drawer.Content
  class="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96vh] rounded-t-[10px]"
>
  <Drawer.Header>
    <Drawer.Title>Add Exercise Type</Drawer.Title>
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
                    category: exerciseCategory,
                  },
                  $userId
                );
              } else {
                createExerciseTypeAction(
                  $userId,
                  exerciseTypeName,
                  exerciseCategory
                );
              }

            reset();
          }}
          disabled={isInvalid}
        >
          Add
        </Button>
      </Drawer.Close>
    </div>
  </div>
</Drawer.Content>
