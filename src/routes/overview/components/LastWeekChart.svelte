<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import type { Exercise, WorkoutSession } from "@prisma/client";

  interface Props {
    workoutSessions?: (WorkoutSession & { exercises: Exercise[] })[];
    loading?: boolean;
  }

  let { workoutSessions = [], loading = false }: Props = $props();

  const addDays = (date: Date, days: number) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  let dates = Array.from({ length: 7 }, (_, i) =>
    addDays(new Date(Date.now()), -(i + 1)),
  ).reverse();

  let weekData = $derived(dates.map((date) => {
    let workoutOnDate = workoutSessions.find((workoutSession) => {
      const workoutSessionDate = new Date(workoutSession.createdAt);
      return workoutSessionDate.getFullYear() === date.getFullYear() &&
        workoutSessionDate.getMonth() === date.getMonth() &&
        workoutSessionDate.getDate() === date.getDate()
        ? true
        : false;
    });

    return {
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        date,
      ),
      exerciseCount: workoutOnDate
        ? filterDeleted(workoutOnDate.exercises).length
        : 0,
    };
  }));
</script>

{#if !loading}
  <div class="flex flex-col gap-4">
    <Headline style="small">Last week</Headline>

    <div class="flex flex-row justify-between w-full">
      {#each weekData as dayData}
        <div class="flex flex-col gap-2 items-center">
          {#if dayData.exerciseCount != 0}
            <div class="relative inline-block">
              <div
                class="badge-icon bg-tertiary-100 absolute -top-2 -right-2 z-10 font-mono text-xs"
              >
                {dayData.exerciseCount}
              </div>
              <div
                class="card variant-filled-primary h-10 aspect-square rounded-md drop-shadow-sm flex justify-center items-center"
              >
                {dayData.weekday.charAt(0)}
              </div>
            </div>
          {:else}
            <div
              class="card variant-soft-primary h-10 aspect-square bg-surface-300 rounded-md drop-shadow-sm flex justify-center items-center font-mono"
            >
              {dayData.weekday.charAt(0)}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{:else}
  <div class="card p-4 variant-soft-primary flex flex-col gap-4">
    <div class="placeholder animate-pulse h-[2.25em] w-40"></div>

    <div class="flex flex-row justify-between w-full">
      {#each dates as _}
        <div class="flex flex-col gap-2 items-center">
          <div
            class="placeholder animate-pulse h-10 aspect-square rounded-md drop-shadow-sm"
></div>
        </div>
      {/each}
    </div>
  </div>
{/if}
