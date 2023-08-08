<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import Header from "$lib/base/Header.svelte";

  let exerciseTypeName = "";
  $: isInvalid = exerciseTypeName.length === 0;
</script>

<Container>
  <ExitButton exitPath="/overview/exercise/addExercise" />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 items-start">
      <Header>Add <br /> Exercise Type</Header>
    </div>
    <SubmitFormWrapper isButtonDisabled={isInvalid}>
      <svelte:fragment slot="form-content">
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
      </svelte:fragment>

      <svelte:fragment slot="button-content">
        <div class="flex flex-row gap-4">
          <Headline style="small">Add</Headline>
        </div>
      </svelte:fragment>
    </SubmitFormWrapper>
  </div>
</Container>
