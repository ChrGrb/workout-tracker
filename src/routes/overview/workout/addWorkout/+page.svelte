<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import CheckboxInput from "$lib/base/input/CheckboxInput.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";

  export let data: PageData;
</script>

<Container>
  <ExitButton exitPath="/overview" />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline>Add <br /> Workout</Headline>
    </div>
    <form method="POST">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <TextInput
            name="workoutName"
            id="workoutName"
            type="text"
            label="Name"
          />
        </div>

        <Button type="submit">Add</Button>
      </div>
    </form>
  </div>
</Container>
