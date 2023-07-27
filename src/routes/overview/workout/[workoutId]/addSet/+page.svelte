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

  export let data: PageData;
  let repetitions = "";
  let weight = "";
  let notes = "";

  $: isInvalid =
    repetitions.length === 0 ||
    +repetitions < 0 ||
    weight.length === 0 ||
    +weight < 0;
</script>

<Container>
  <ExitButton exitPath={"/overview/workout/" + data.workout.id} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline>Add <br /> Set</Headline>
    </div>
    <form method="POST" use:enhance>
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <CheckboxInput name="isWarmup" id="isWarmup" label="Warmup" />
          <TextInput
            name="reps"
            id="reps"
            type="number"
            label="Repetitions"
            bind:input={repetitions}
          />
          <TextInput
            name="weight"
            id="weight"
            type="number"
            label="Weight"
            bind:input={weight}
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

        <Button type="submit" disabled={isInvalid}>Add</Button>
      </div>
    </form>
  </div>
</Container>
