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
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { useBackNavigation, useForwardNavigation } from "$lib/stores/stores";
  import { Badge } from "$lib/components/ui/badge";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import MuscleChart from "./MuscleChart.svelte";
  import type { ExerciseTypeArea } from "@prisma/client";
  import { getAreaScoresFromExercises } from "$lib/utils/data/getAreaScoresFromExercises";

  interface Props {
    session: WorkoutSessionFull;
  }

  let { session }: Props = $props();

  let x = $state(useMotionValue(0));

  const modalStore = getModalStore();
  const forwardNavigation = useForwardNavigation();
  const backNavigation = useBackNavigation();

  const sessionAreas = $derived(
    getAreaScoresFromExercises(filterDeleted(session.exercises)),
  );
</script>

<SwipeToAction
  deleteAction={() => {
    confirmDeleteWithAction(
      modalStore,
      () => {
        if (session) {
          deleteSessionAction($state.snapshot(session));

          backNavigation.set(true);
          goto(getOverviewPath);
        }
      },
      "session",
      () => {},
    );
  }}
  bind:x
>
  <Button
    action={() => {
      if ($x === 0 || $x === undefined) {
        forwardNavigation.set(true);
        goto("/overview/session/" + session.id);
      }
    }}
    classes="card variant-soft-primary bg-white p-4 flex flex-row items-stretch justify-between gap-2 w-full"
  >
    <div class="flex flex-col gap-2 justify-between">
      <div class="flex flex-col gap-2 items-start justify-start mb-2 !ml-0">
        <Headline style="small">{session.name}</Headline>

        <div class="flex flex-row gap-2 justify-start flex-wrap">
          {#each Object.keys(sessionAreas) as area}
            <Badge>{area}</Badge>
          {/each}
        </div>
      </div>

      <time
        use:svelteTime={{
          timestamp: session.createdAt,
          format: "HH:mm · MMMM D",
        }}
        class="font-light text-sm text-start"
      ></time>
    </div>

    <ChevronRightIcon size="24" />
  </Button>
</SwipeToAction>
