<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { Exercise, Session, WorkoutSession } from "@prisma/client";
  import SessionCard from "./SessionCard.svelte";
  import SessionCardSkeleton from "./SessionCardSkeleton.svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  export let previousSessions: (WorkoutSession & { exercises: Exercise[] })[] =
    [];
  export let loading: boolean = false;
</script>

<Accordion
  padding=""
  regionControl="px-4 py-2"
  regionPanel="pt-2 p-4"
  class="card variant-soft-primary"
>
  <AccordionItem>
    <Headline style="small" slot="summary">Previous Sessions</Headline>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2" slot="content">
      {#if loading}
        <SessionCardSkeleton />
        <SessionCardSkeleton />
      {:else if previousSessions}
        {#each previousSessions as session}
          <SessionCard {session} />
        {/each}
      {/if}
    </div>
  </AccordionItem>
</Accordion>
