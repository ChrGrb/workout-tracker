<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import type { Session } from "@prisma/client";
  import { ChevronRightIcon } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";

  export let session: Session;
</script>

<a href={"/overview/session/" + session.id}>
  <div
    class="card variant-filled p-4 flex flex-row items-center justify-between gap-2"
  >
    <div class="flex flex-col gap-2">
      <Headline style="small">Session</Headline>
      <time
        use:svelteTime={{
          timestamp: session.createdAt,
          format: "hh:mm · MMMM D",
        }}
        class="font-light text-sm"
      />
    </div>
    <ChevronRightIcon size="24" />
  </div>
</a>
