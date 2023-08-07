<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import type { ExerciseSet } from "@prisma/client";
  import clsx from "clsx";
  import { InfoIcon, Trash2Icon } from "svelte-feather-icons";
  import SubmitFormWrapper from "./forms/SubmitFormWrapper.svelte";
  import DeleteButton from "$lib/base/DeleteButton.svelte";

  export let exerciseSet: ExerciseSet;
  export let deleteAction: string;

  $: exerciseSetTypeString =
    exerciseSet.exerciseSetType.charAt(0).toUpperCase() +
    exerciseSet.exerciseSetType.slice(1).toLowerCase();

  let form: HTMLFormElement;
</script>

<div
  class={clsx("card flex flex-col gap-8 justify-center p-6", {
    "variant-filled-primary":
      exerciseSet.exerciseSetType == "WORKOUT" ||
      exerciseSet.exerciseSetType == "COOLDOWN",
    "variant-soft-primary": exerciseSet.exerciseSetType == "WARMUP",
  })}
>
  <div class="flex flex-row items-start justify-between">
    <Headline style="small">
      {exerciseSetTypeString}
    </Headline>
    <SubmitFormWrapper action={deleteAction} bind:form>
      <svelte:fragment slot="form-content">
        <input
          type="text"
          name="workoutId"
          value={exerciseSet.exerciseId}
          class="hidden"
        />
        <input type="text" name="setId" value={exerciseSet.id} class="hidden" />
      </svelte:fragment>

      <DeleteButton
        toDeleteName="exercise"
        bind:form
        slot="button"
        classes="w-full variant-soft-error"
      />
    </SubmitFormWrapper>
  </div>
  <div class="flex flex-row justify-between">
    <div class="flex flex-row gap-1">
      <p class="font-medium">{exerciseSet.reps}</p>
      <p>reps</p>
    </div>
    <div class="flex flex-row gap-1">
      <p class="font-medium">{exerciseSet.weight}</p>
      <p>kg</p>
    </div>
  </div>
  {#if exerciseSet.notes && exerciseSet.notes !== ""}
    <div class="flex flex-col gap-2">
      <div class="flex flex-row justify-start items-center gap-2">
        <InfoIcon size="18" />
        <p class="font-semibold">Notes</p>
      </div>
      <p class="break-all">{exerciseSet.notes}</p>
    </div>
  {/if}
</div>
