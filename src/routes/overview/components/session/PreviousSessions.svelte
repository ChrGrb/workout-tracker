<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import SessionCard from "./SessionCard.svelte";
  import { Paginator, type PaginationSettings } from "@skeletonlabs/skeleton";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import { fade } from "svelte/transition";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";

  export let previousSessions: WorkoutSessionFull[] = [];

  $: previousSessionsSorted = previousSessions.sort(sortByCreatedAt);

  $: paginatedSource = previousSessionsSorted.slice(
    paginationSettings.offset * paginationSettings.limit,
    paginationSettings.offset * paginationSettings.limit +
      paginationSettings.limit
  );

  let paginationSettings = {
    offset: 0,
    limit: 4,
    size: previousSessions.length,
    amounts: [4],
  } satisfies PaginationSettings;

  $: paginationSettings.size = previousSessions.length;
</script>

<div class="flex flex-col gap-4">
  <Headline style="small">Previous Sessions</Headline>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    {#each paginatedSource as session (session.id)}
      <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
        <SessionCard {session} />
      </div>
    {/each}
  </div>

  <Paginator
    bind:settings={paginationSettings}
    select="hidden"
    controlVariant="variant-filled-primary"
    showFirstLastButtons={false}
    showPreviousNextButtons={true}
  />
</div>
