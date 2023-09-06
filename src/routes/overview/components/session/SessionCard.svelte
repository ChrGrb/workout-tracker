<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { Exercise, Session, WorkoutSession } from "@prisma/client";
  import { ChevronRightIcon } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";

  export let session: WorkoutSession & { exercises: Exercise[] };
</script>

<a href={"/overview/session/" + session.id}>
  <div
    class="card variant-soft-primary p-4 flex flex-row items-center justify-between gap-2"
  >
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-2 justify-start mb-2 !ml-0">
        <Headline style="small">{session.name}</Headline>
      </div>
      <time
        use:svelteTime={{
          timestamp: session.createdAt,
          format: "HH:mm · MMMM D",
        }}
        class="font-light text-sm"
      />
    </div>
    <ChevronRightIcon size="24" />
  </div>
</a>
