<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import SessionCard from "./SessionCard.svelte";
  import { Paginator, type PaginationSettings } from "@skeletonlabs/skeleton";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import { fade } from "svelte/transition";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import * as Pagination from "$lib/components/ui/pagination";

  export let previousSessions: WorkoutSessionFull[] = [];

  $: previousSessionsSorted = previousSessions.sort(sortByCreatedAt);

  const itemsPerPage = 4;
  let selectedPage = 1;

  $: paginatedSource = previousSessionsSorted.slice(
    selectedPage * itemsPerPage,
    (selectedPage + 1) * itemsPerPage
  );

  let paginationSettings = {
    page: 0,
    limit: 4,
    size: previousSessions.length,
    amounts: [4],
  } satisfies PaginationSettings;

  $: paginationSettings.size = previousSessions.length;
</script>

<div class="flex flex-col gap-4">
  <Headline style="small">Previous Sessions</Headline>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    {#each previousSessionsSorted.slice(selectedPage * itemsPerPage, (selectedPage + 1) * itemsPerPage) as session (session.id)}
      <div
        in:fade={{ duration: 100, delay: 100 }}
        out:fade={{ duration: 100 }}
        animate:flip={{ delay: 100, duration: 250, easing: sineInOut }}
      >
        <SessionCard {session} />
      </div>
    {/each}
  </div>

  <!-- <Paginator
    bind:settings={paginationSettings}
    select="hidden"
    justify="justify-center"
    controlVariant="variant-filled-primary"
    controlSeparator="justify-between w-full h-12"
    buttonClasses="fill-current !px-3 !py-1.5 !border-none w-full"
    showFirstLastButtons={false}
    showPreviousNextButtons={true}
  /> -->

  <Pagination.Root
    count={previousSessions.length}
    perPage={itemsPerPage}
    let:pages
    let:currentPage
    bind:page={selectedPage}
  >
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item isVisible={currentPage == page.value}>
            <Pagination.Link {page} isActive={currentPage == page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  </Pagination.Root>
</div>
