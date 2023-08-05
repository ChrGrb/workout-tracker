<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import Button from "$lib/base/Button.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { enhance } from "$app/forms";
  import { ProgressRadial } from "@skeletonlabs/skeleton";

  let exerciseTypeName = "";
  $: isInvalid = exerciseTypeName.length === 0;
  let isLoading = false;
</script>

<Container>
  <ExitButton exitPath="/overview/workout/addWorkout" />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline>Add <br /> Exercise Type</Headline>
    </div>
    <form
      method="POST"
      use:enhance={() => {
        isLoading = true;
      }}
    >
      <div class="flex flex-col gap-8">
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

        <Button type="submit" disabled={isInvalid || isLoading}>
          <div class="flex flex-row gap-4">
            {#if isLoading}
              <ProgressRadial width="w-6" stroke={100} meter="stroke-white" />
            {:else}
              <Headline style="small">Add</Headline>
            {/if}
          </div>
        </Button>
      </div>
    </form>
  </div>
</Container>
