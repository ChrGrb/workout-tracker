<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { useUserId } from "$lib/stores/stores";
  import type { WorkoutSessionTemplateWithExerciseTypes } from "$lib/utils/prismaTypes";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import createSessionFromTemplateAction from "../../../../actions/createSessionFromTemplateAction";

  export let workoutSessionTemplate: WorkoutSessionTemplateWithExerciseTypes;

  let userId = useUserId();
</script>

<Button
  classes={"card w-full flex flex-row gap-2 justify-between p-4 text-center relative drop-shadow-lg variant-filled-primary"}
  action={() => {
    createSessionFromTemplateAction($userId ?? "", workoutSessionTemplate);
  }}
>
  <svelte:component
    this={ProgressRadial}
    slot="spinner"
    width="w-[48px]"
    stroke={100}
    meter="stroke-primary-50"
  />
  <Headline
    style="small"
    classes="break-words whitespace-normal line-clamp-3 max-w-[95%] text-start"
  >
    {workoutSessionTemplate.name}
  </Headline>
  {#if workoutSessionTemplate.exerciseTypes.length > 0}
    <div class="flex flex-row gap-2 flex-wrap justify-center !ml-0">
      <div class="flex flex-row badge rounded-full pr-2.5 bg-white text-black">
        <p>{workoutSessionTemplate.exerciseTypes.length} exercises</p>
      </div>
    </div>
  {/if}
</Button>
