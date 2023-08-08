<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { goto } from "$app/navigation";
  import ExerciseTypeRadioButton from "./components/ExerciseTypeRadioButton.svelte";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import ExerciseTypeRadioButtonSkeleteon from "./components/ExerciseTypeRadioButtonSkeleteon.svelte";
  import { fade } from "svelte/transition";
  import AddCard from "$lib/components/AddCard.svelte";
  import Header from "$lib/base/Header.svelte";

  export let data: PageData;

  let exerciseTypeSelection = "";
  $: isInvalid = exerciseTypeSelection.length === 0;
</script>

<Container>
  <ExitButton exitPath="/overview" />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 items-start w-1/2 md:w-1/4">
      <Header>Add <br /> Exercise</Header>
    </div>
    <SubmitFormWrapper action="?/addExercise" isButtonDisabled={isInvalid}>
      <div slot="form-content">
        {#await data.streamed.exerciseTypes}
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4"
            transition:fade={{ duration: 100 }}
          >
            <ExerciseTypeRadioButtonSkeleteon />
            <ExerciseTypeRadioButtonSkeleteon />
          </div>
        {:then exerciseTypes}
          <div
            class="grid grid-cols-2 md:grid-cols-4 gap-4"
            in:fade={{ duration: 100, delay: 120 }}
          >
            {#each exerciseTypes as exerciseType (exerciseType.id)}
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
            <AddCard
              addAction={() =>
                goto("/overview/exercise/addExerciseType", {
                  invalidateAll: true,
                })}
            >
              Add Type
            </AddCard>
          </div>
        {/await}
      </div>
    </SubmitFormWrapper>
  </div>
</Container>
