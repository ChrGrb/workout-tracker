<script lang="ts">
  import ExerciseOverviewRecommendationSkeleteon from "./ExerciseOverviewRecommendationSkeleteon.svelte";
  import ExerciseOverviewSetSkeleton from "./ExerciseOverviewSetSkeleton.svelte";
</script>

<div class="flex flex-col gap-12">
  <div class="flex flex-col gap-4 pr-24">
    <div class="placeholder animate-pulse h-[2.25em] w-36" />
    <div class="placeholder animate-pulse h-[1.5em] w-1/2" />
  </div>

  <ExerciseOverviewRecommendationSkeleteon />

  <ExerciseOverviewSetSkeleton />
</div>
