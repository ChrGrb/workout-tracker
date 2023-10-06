<script lang="ts">
  import calculateExerciseScore from "$lib/utils/data/calculateExerciseScore";
  import { getPreviousExercisesOfType } from "$lib/utils/data/previousExercisesOfType";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import clsx from "clsx";

  export let previousExercises: ExerciseFull[];
  export let exercise: ExerciseFull;

  let barHeight = 40;

  $: exerciseScores = getPreviousExercisesOfType(previousExercises, exercise)
    .sort(sortByCreatedAt)
    .reverse()
    .slice(-4)
    .concat(exercise)
    .map((exercise) => calculateExerciseScore(exercise));

  $: scoreMax = Math.max(...exerciseScores);

  $: exerciseBarHeights = exerciseScores.map(
    (exerciseScore) => (exerciseScore / scoreMax) * barHeight
  );
</script>

<div class="flex flex-row justify-evenly">
  {#each exerciseBarHeights as barHeight, index}
    <div class="flex flex-col justify-start items-center align-center gap-2">
      <div
        class="w-4 h-[40px] variant-soft-primary rounded-full relative overflow-hidden"
      >
        <div
          class={clsx("w-4 rounded-full absolute bottom-0", {
            "variant-filled-primary": index != exerciseBarHeights.length - 1,
            "bg-gradient-to-tr from-secondary-400 to-tertiary-400":
              index == exerciseBarHeights.length - 1,
          })}
          style="height: {barHeight}px"
        />
      </div>
    </div>
  {/each}
</div>
