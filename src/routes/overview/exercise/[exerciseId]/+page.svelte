<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Container from "$lib/base/Container.svelte";
  import { svelteTime } from "svelte-time";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import { goto } from "$app/navigation";
  import ExerciseSetCard from "$lib/components/ExerciseSetCard.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import {
    InfoIcon,
    MoreHorizontalIcon,
    PlusIcon,
    Trash2Icon,
  } from "svelte-feather-icons";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import {
    Accordion,
    AccordionItem,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import DeleteButton from "$lib/base/DeleteButton.svelte";
  import ExerciseOverviewSkeleton from "./components/ExerciseOverviewSkeleton.svelte";
  import ExerciseOverviewSetSkeleton from "./components/ExerciseOverviewSetSkeleton.svelte";
  import ExerciseOverviewRecommendationSkeleteon from "./components/ExerciseOverviewRecommendationSkeleteon.svelte";
  import { fade } from "svelte/transition";

  export let data: PageData;

  async function addSet(exerciseId: string) {
    goto("/overview/exercise/" + exerciseId + "/addSet");
  }

  let form: HTMLFormElement;

  const popupFeatured: PopupSettings = {
    // Represents the type of event that opens/closed the popup
    event: "click",
    // Matches the data-popup value on your popup element
    target: "popupFeatured",
    // Defines which side of your trigger the popup will appear
    placement: "bottom",
    middleware: {
      offset: { crossAxis: -80 },
    },
  };
</script>

{#await data.streamed.exercise then exercise}
  <div
    class="card variant-filled-surface p-2 pr-0 shadow-xl z-50"
    data-popup="popupFeatured"
  >
    <div class="flex flex-col items-end">
      <SubmitFormWrapper
        action="?/deleteCurrentExercise"
        bind:form
        formClasses="w-full grow"
      >
        <input
          type="text"
          name="exerciseId"
          value={exercise.id}
          class="hidden"
          slot="form-content"
        />
        <DeleteButton toDeleteName="exercise" bind:form slot="button">
          <p slot="title">Delete Exercise</p>
        </DeleteButton>
      </SubmitFormWrapper>
    </div>
  </div>
{/await}

<Container>
  <ExitButton exitPath={"/overview"} />
  {#await data.streamed.exercise}
    <div transition:fade={{ duration: 100 }}>
      <ExerciseOverviewSkeleton />
    </div>
  {:then exercise}
    <div class="flex flex-col gap-12" in:fade={{ duration: 100, delay: 120 }}>
      <div class="flex flex-col gap-4 pr-24">
        <Headline>{exercise.type.name}</Headline>
        <time
          use:svelteTime={{
            timestamp: exercise.createdAt,
            format: "dddd @ h:mm A · MMMM D, YYYY",
          }}
        />
      </div>

      <Accordion>
        {#if exercise.type.description}
          <AccordionItem
            class="card variant-soft-primary"
            regionControl="variant-soft-primary"
            regionPanel="pt-4 pb-6"
            hover=""
          >
            <svelte:fragment slot="lead"><InfoIcon size="18" /></svelte:fragment
            >
            <svelte:fragment slot="summary">Description</svelte:fragment>
            <svelte:fragment slot="content"
              ><article class="whitespace-pre-line">
                {exercise.type.description}
              </article></svelte:fragment
            >
          </AccordionItem>
        {/if}
        {#await data.streamed.recommendations}
          <div transition:fade={{ duration: 100 }}>
            <ExerciseOverviewRecommendationSkeleteon />
          </div>
        {:then recommendations}
          {#if recommendations}
            <div in:fade={{ duration: 100, delay: 120 }}>
              <AccordionItem
                class="card variant-soft-primary"
                regionControl="variant-soft-primary"
                regionPanel="py-4"
                hover=""
                open
              >
                <svelte:fragment slot="lead"
                  ><InfoIcon size="18" /></svelte:fragment
                >
                <svelte:fragment slot="summary">Recommendations</svelte:fragment
                >
                <svelte:fragment slot="content">
                  <div class="flex flex-row w-full basis-1/2">
                    <div class="flex flex-col basis-1/2 items-center">
                      <p class="font-semibold">Reps</p>
                      <p class="">{recommendations.recommendedReps}</p>
                      <p />
                    </div>
                    <div class="flex flex-col basis-1/2 items-center">
                      <p class="font-semibold">Weight</p>
                      <p class="">
                        {recommendations.recommendedWeight} kg
                      </p>
                      <p />
                    </div>
                  </div>
                </svelte:fragment>
              </AccordionItem>
            </div>
          {/if}
        {/await}
      </Accordion>

      <hr />

      {#await data.streamed.exerciseActive}
        <div transition:fade={{ duration: 100 }}>
          <ExerciseOverviewSetSkeleton />
        </div>
      {:then exerciseActive}
        <div
          class="flex flex-col w-full gap-4"
          in:fade={{ duration: 100, delay: 120 }}
        >
          <div class="flex flex-row justify-between items-center">
            <Headline style="small">Sets</Headline>
            {#if exerciseActive.active}
              <button use:popup={popupFeatured} type="button">
                <MoreHorizontalIcon size="24" />
              </button>
            {/if}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            {#if exercise.sets}
              {#each exercise.sets as set (set.id)}
                <div animate:flip={{ duration: 100, easing: sineInOut }}>
                  <ExerciseSetCard
                    exerciseSet={set}
                    deleteAction="?/deleteSet"
                  />
                </div>
              {/each}
            {/if}
          </div>
        </div>

        {#if exerciseActive.active}
          <Button
            action={() => {
              addSet(exercise.id);
            }}
            loadingOnClick={true}
            classes="w-full variant-filled-primary"
          >
            <div class="flex flex-row gap-4 items-center">
              <p class="text-bold">Add set</p>
            </div>
          </Button>
        {/if}
      {/await}
    </div>
  {/await}
</Container>
