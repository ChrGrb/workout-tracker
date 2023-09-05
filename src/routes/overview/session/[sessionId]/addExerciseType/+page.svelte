<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import Header from "$lib/base/Header.svelte";
  import { getAddExercisePath } from "$lib/utils/routes";
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

<Container>
  <ExitButton exitPath={getAddExercisePath({ sessionId: data.sessionId })} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 items-start">
      <Header>Add <br /> Exercise Type</Header>
    </div>

    <div class="flex flex-col gap-4">
      <TextInput
        name="exerciseTypeName"
        id="exerciseTypeName"
        type="text"
        label="Name"
        required={true}
        bind:input={exerciseTypeName}
      />
      <input
        type="text"
        name="sessionId"
        value={data.sessionId}
        class="hidden"
      />
    </div>

    <Button
      action={async () => {
        if ($userId) createExerciseTypeAction($userId, exerciseTypeName);

        goto(getAddExercisePath({ sessionId: data.sessionId }));
      }}
      disabled={isInvalid}
    >
      Add
    </Button>
  </div>
</Container>
