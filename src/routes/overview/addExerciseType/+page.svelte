<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import Header from "$lib/base/Header.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import createExerciseTypeAction from "./actions/createExerciseTypeAction";
  import { useUserId } from "$lib/stores/stores";
  import { goto } from "$app/navigation";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import { addForcedBackToUrl } from "$lib/utils/routing/callbacks";

  export let data: PageData;

  let exerciseTypeName = "";
  let exerciseCategory = "WEIGHT";
  $: isInvalid = exerciseTypeName.length === 0;

  let userId = useUserId();
</script>

<Header contentAlwaysVisible={true}>
  <svelte:fragment>Add Exercise Type</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton exitPath={data.callback} />
  </svelte:fragment>
</Header>

<Container>
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

    <Button
      action={async () => {
        if ($userId)
          createExerciseTypeAction($userId, exerciseTypeName, exerciseCategory);

        goto(addForcedBackToUrl(data.callback));
      }}
      disabled={isInvalid}
    >
      Add
    </Button>
  </div>
</Container>
