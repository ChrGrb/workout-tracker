<script lang="ts">
  import { goto } from "$app/navigation";
  import Headline from "$lib/base/Headline.svelte";
  import SwipeToAction from "$lib/base/SwipeToAction.svelte";
  import { confirmDeleteWithAction } from "$lib/modals/ConfirmDeleteModalWrapper";
  import { getOverviewPath } from "$lib/utils/routing/routes";
  import { ChevronRightIcon } from "svelte-feather-icons";
  import { svelteTime } from "svelte-time";
  import deleteSessionAction from "../../actions/deleteSessionAction";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import Button from "$lib/base/Button.svelte";
  import { useMotionValue } from "svelte-motion";

  export let session: WorkoutSessionFull;

  let x = useMotionValue(0);
</script>

<SwipeToAction
  deleteAction={() => {
    confirmDeleteWithAction(
      () => {
        if (session) {
          deleteSessionAction(session);
          goto(getOverviewPath);
        }
      },
      "session",
      () => {}
    );
  }}
  bind:x
>
  <Button
    action={() => {
      if ($x === 0 || $x === undefined) goto("/overview/session/" + session.id);
    }}
    classes="card variant-soft-primary bg-white p-4 flex flex-row items-center justify-between gap-2 w-full"
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
  </Button>
</SwipeToAction>
