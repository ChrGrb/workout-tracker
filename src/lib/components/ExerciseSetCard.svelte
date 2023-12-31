<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import type { ExerciseSet } from "@prisma/client";
  import clsx from "clsx";
  import { InfoIcon, Trash2Icon } from "svelte-feather-icons";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import { getExerciseSetWeight } from "$lib/utils/data/getExerciseSetWeight";
  import SwipeToAction from "$lib/base/SwipeToAction.svelte";

  export let exerciseSet: ExerciseSet;
  export let deleteAction: () => void;

  $: exerciseSetTypeString =
    exerciseSet.exerciseSetType.charAt(0).toUpperCase() +
    exerciseSet.exerciseSetType.slice(1).toLowerCase();
</script>

<SwipeToAction
  deleteAction={() => confirmDeleteWithAction(deleteAction, "set", () => {})}
>
  <div
    class={clsx("card flex flex-col gap-8 justify-center p-6", {
      "variant-filled-primary": exerciseSet.exerciseSetType == "WORKOUT",
      "variant-soft-surface bg-white":
        exerciseSet.exerciseSetType == "WARMUP" ||
        exerciseSet.exerciseSetType == "COOLDOWN",
    })}
  >
    <div class="flex flex-row items-start justify-between">
      <Headline style="small">
        {exerciseSetTypeString}
      </Headline>
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
        <p class="font-medium">{getExerciseSetWeight(exerciseSet)}</p>
        <p>kg</p>
      </div>
    </div>
    {#if exerciseSet.additionalWeight > 0.0}
      <div class="flex flex-col gap-2">
        <p class="font-semibold">Weight Split</p>
        <div class="flex flex-row items-center gap-2">
          <div
            class={clsx("flex flex-row gap-1 px-4 py-2 rounded-full ", {
              "bg-white text-primary-900":
                exerciseSet.exerciseSetType == "WORKOUT",
            })}
          >
            <p class="font-medium">{exerciseSet.weight}</p>
            <p>kg</p>
          </div>
          <hr class="grow" />
          <div
            class={clsx("flex flex-row gap-1 px-4 py-2 rounded-full ", {
              "bg-white text-primary-900":
                exerciseSet.exerciseSetType == "WORKOUT",
            })}
          >
            <p class="font-medium">{exerciseSet.additionalWeight}</p>
            <p>kg</p>
          </div>
        </div>
      </div>
    {/if}
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
</SwipeToAction>
