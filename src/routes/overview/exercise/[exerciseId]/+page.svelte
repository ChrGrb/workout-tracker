<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import { goto } from "$app/navigation";
  import ExerciseSetCard from "$lib/components/ExerciseSetCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { InfoIcon, PlusIcon, Trash2Icon } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import { enhance } from "$app/forms";
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let data: PageData;

  async function addSet() {
    goto("/overview/exercise/" + data.exercise.id + "/addSet");
  }

  let form: HTMLFormElement;
</script>

<Container>
  <ExitButton exitPath={"/overview"} />
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 pr-24">
      <Headline>{data.exercise.type.name}</Headline>
      <time
        use:svelteTime={{
          timestamp: data.exercise.createdAt,
          format: "dddd @ h:mm A · MMMM D, YYYY",
        }}
      />
    </div>

    <Accordion>
      {#if data.exercise.type.description}
        <AccordionItem regionControl="variant-soft-primary">
          <svelte:fragment slot="lead"><InfoIcon size="18" /></svelte:fragment>
          <svelte:fragment slot="summary">Description</svelte:fragment>
          <svelte:fragment slot="content"
            ><article class="whitespace-pre-line">
              {data.exercise.type.description}
            </article></svelte:fragment
          >
        </AccordionItem>
      {/if}
      {#if data.recommendations}
        <AccordionItem regionControl="variant-soft-primary" open>
          <svelte:fragment slot="lead"><InfoIcon size="18" /></svelte:fragment>
          <svelte:fragment slot="summary">Recommendations</svelte:fragment>
          <svelte:fragment slot="content">
            <div class="flex flex-row w-full basis-1/2">
              <div class="flex flex-row basis-1/2">
                <p>
                  <span class="font-semibold">Reps </span>
                  {data.recommendations.recommendedReps}
                </p>
                <p />
              </div>
              <div class="flex flex-row basis-1/2">
                <p>
                  <span class="font-semibold">Weight </span>
                  {data.recommendations.recommendedWeight} kg
                </p>
                <p />
              </div>
            </div>
          </svelte:fragment>
        </AccordionItem>
      {/if}
    </Accordion>
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-between items-center">
        <Headline style="small">Sets</Headline>
        {#if data.exerciseActive}
          <Button action={addSet} icon={true} classes="variant-filled-primary"
            ><PlusIcon size="24" /></Button
          >
        {/if}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        {#if data.exercise.sets}
          {#each data.exercise.sets as set (set.id)}
            <div animate:flip={{ duration: 100, easing: sineInOut }}>
              <ExerciseSetCard exerciseSet={set} deleteAction="?/deleteSet" />
            </div>
          {/each}
        {/if}
      </div>
    </div>

    {#if data.exerciseActive}
      <form
        method="POST"
        action="?/deleteCurrentExercise"
        class="w-full grow"
        use:enhance
        bind:this={form}
      >
        <input
          type="text"
          name="exerciseId"
          value={data.exercise.id}
          class="hidden"
        />
        <Button
          action={() => confirmDelete(form, "exercise")}
          classes="w-full variant-soft-error"
        >
          <div class="flex flex-row gap-4 justify-center items-center">
            <p>Delete Exercise</p>
            <Trash2Icon size="14" />
          </div>
        </Button>
      </form>
    {/if}
  </div>
</Container>
