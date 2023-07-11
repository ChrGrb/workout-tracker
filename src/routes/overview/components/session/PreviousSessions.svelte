<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { Session } from "@prisma/client";
  import SessionCard from "./SessionCard.svelte";
  import SessionCardSkeleton from "./SessionCardSkeleton.svelte";

  export let previousSessions: Session[] = [];
  export let loading: boolean = false;
</script>

<div class="flex flex-col gap-8">
  <Headline style="medium">Previous Sessions</Headline>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    {#if loading}
      <SessionCardSkeleton />
      <SessionCardSkeleton />
    {:else if previousSessions}
      {#each previousSessions as session}
        <SessionCard {session} />
      {/each}
    {/if}
  </div>
</div>
