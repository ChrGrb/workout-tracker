<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { goto } from "$app/navigation";
  import ExerciseTypeRadioButton from "./components/ExerciseTypeRadioButton.svelte";
  import AddExerciseTypeButton from "./components/AddExerciseTypeButton.svelte";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";

  export let data: PageData;

  let exerciseTypeSelection = "";
  $: isInvalid = exerciseTypeSelection.length === 0;
</script>

<Container>
  <ExitButton exitPath="/overview" />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline>Add <br /> Exercise</Headline>
    </div>
    <SubmitFormWrapper action="?/addExercise" isButtonDisabled={isInvalid}>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" slot="form-content">
        {#each data.exerciseTypes as exerciseType (exerciseType.id)}
          <div animate:flip={{ duration: 100, easing: sineInOut }}>
            <ExerciseTypeRadioButton
              name={exerciseType.name}
              id={exerciseType.id}
              bind:group={exerciseTypeSelection}
              required={true}
              userId={data.userId}
              description={exerciseType.description}
            />
          </div>
        {/each}
        <AddExerciseTypeButton
          addAction={() =>
            goto("/overview/exercise/addExerciseType", {
              invalidateAll: true,
            })}
        />
      </div>
    </SubmitFormWrapper>
  </div>
</Container>
