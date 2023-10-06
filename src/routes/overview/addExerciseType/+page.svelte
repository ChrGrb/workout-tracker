<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import Header from "$lib/base/Header.svelte";
  import { getAddExercisePath } from "$lib/utils/routing/routes";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import createExerciseTypeAction from "./actions/createExerciseTypeAction";
  import { useUserId } from "$lib/stores/stores";
  import { goto } from "$app/navigation";

  export let data: PageData;

  let exerciseTypeName = "";
  $: isInvalid = exerciseTypeName.length === 0;

  let userId = useUserId();
</script>

<Header>
  <svelte:fragment>Add Exercise Type</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton exitPath={data.callback} />
  </svelte:fragment>
</Header>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
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
        if ($userId) createExerciseTypeAction($userId, exerciseTypeName);

        goto(data.callback);
      }}
      disabled={isInvalid}
    >
      Add
    </Button>
  </div>
</Container>
