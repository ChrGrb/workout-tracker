<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import type { ExerciseSet } from "@prisma/client";
  import clsx from "clsx";
  import { InfoIcon, Trash2Icon } from "svelte-feather-icons";
  import SubmitFormWrapper from "./forms/SubmitFormWrapper.svelte";
  import DeleteButton from "$lib/base/DeleteButton.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";

  export let exerciseSet: ExerciseSet;
  export let deleteAction: () => void;

  $: exerciseSetTypeString =
    exerciseSet.exerciseSetType.charAt(0).toUpperCase() +
    exerciseSet.exerciseSetType.slice(1).toLowerCase();

  let form: HTMLFormElement;
</script>

<div
  class={clsx("card flex flex-col gap-8 justify-center p-6", {
    "variant-filled-primary": exerciseSet.exerciseSetType == "WORKOUT",
    "variant-soft-primary":
      exerciseSet.exerciseSetType == "WARMUP" ||
      exerciseSet.exerciseSetType == "COOLDOWN",
  })}
>
  <div class="flex flex-row items-start justify-between">
    <Headline style="small">
      {exerciseSetTypeString}
    </Headline>
    <Button
      action={() => confirmDeleteWithAction(deleteAction, "set", () => {})}
      classes="btn !bg-transparent text-inherit transition-all drop-shadow-none"
      icon={true}
    >
      <div class="flex flex-row gap-4 justify-center items-center">
        <Trash2Icon size="18" />
      </div>
    </Button>
  </div>
  <div class="flex flex-row justify-between">
    <div
      class={clsx("flex flex-row gap-1 px-4 py-2 rounded-full ", {
        "bg-white text-primary-900": exerciseSet.exerciseSetType == "WORKOUT",
      })}
    >
      <p class="font-medium">{exerciseSet.reps}</p>
      <p>reps</p>
    </div>
    <div
      class={clsx("flex flex-row gap-1 px-4 py-2 rounded-full ", {
        "bg-white text-primary-900": exerciseSet.exerciseSetType == "WORKOUT",
      })}
    >
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
