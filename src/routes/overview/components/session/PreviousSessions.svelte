<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import SessionCard from "./SessionCard.svelte";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import { fade } from "svelte/transition";
  import { sortByCreatedAt } from "$lib/utils/data/sortByDate";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import * as Pagination from "$lib/components/ui/pagination";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  interface Props {
    previousSessions?: WorkoutSessionFull[];
  }

  let { previousSessions = [] }: Props = $props();

  let previousSessionsSorted = $derived(previousSessions.sort(sortByCreatedAt));

  const itemsPerPage = 4;
  let selectedPage = $state(1);
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

  <Pagination.Root
    count={previousSessions.length}
    perPage={itemsPerPage}
    bind:page={selectedPage}
    class="px-4"
  >
    {#snippet children({ pages, currentPage }: any)}
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.PrevButton>
            <ChevronLeft class="size-4" />
          </Pagination.PrevButton>
        </Pagination.Item>
        {#each pages as page (page.key)}
          {#if page.type === "ellipsis"}
            <Pagination.Item>
              <Pagination.Ellipsis />
            </Pagination.Item>
          {:else}
            <Pagination.Item>
              <Pagination.Link {page} isActive={currentPage == page.value}>
                {page.value}
              </Pagination.Link>
            </Pagination.Item>
          {/if}
        {/each}
        <Pagination.Item>
          <Pagination.NextButton>
            <ChevronRight class="size-4" />
          </Pagination.NextButton>
        </Pagination.Item>
      </Pagination.Content>
    {/snippet}
  </Pagination.Root>
</div>
