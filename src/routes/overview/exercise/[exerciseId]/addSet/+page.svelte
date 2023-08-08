<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import CheckboxInput from "$lib/base/input/CheckboxInput.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { enhance } from "$app/forms";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import Header from "$lib/base/Header.svelte";

  export let data: PageData;
  let repetitions = "";
  let weight = "";
  let notes = "";
  let exerciseSetType = "WORKOUT";

  $: isInvalid =
    repetitions.length === 0 ||
    +repetitions < 0 ||
    weight.length === 0 ||
    +weight < 0;
</script>

<Container>
  <ExitButton exitPath={"/overview/exercise/" + data.exercise.id} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 w-1/2 md:w-1/4">
      <Header>Add <br /> Set</Header>
    </div>
    <SubmitFormWrapper isButtonDisabled={isInvalid}>
      <div class="flex flex-col gap-4" slot="form-content">
        <RadioSelect
          items={[
            { name: "Warmup", value: "WARMUP" },
            { name: "Workout", value: "WORKOUT" },
            { name: "Cooldown", value: "COOLDOWN" },
          ]}
          name="exerciseSetType"
          id="exerciseSetType"
          label="Type"
          group={exerciseSetType}
        />
        <TextInput
          name="reps"
          id="reps"
          type="number"
          label="Repetitions"
          bind:input={repetitions}
          required={true}
          metric="reps"
        />
        <TextInput
          name="weight"
          id="weight"
          type="number"
          label="Weight"
          step={0.01}
          bind:input={weight}
          required={true}
          metric="kg"
        />
        <TextArea
          name="notes"
          id="notes"
          rows={3}
          label="Notes"
          placeholder="Enter your notes here"
          bind:input={notes}
        />
      </div>
    </SubmitFormWrapper>
  </div>
</Container>
