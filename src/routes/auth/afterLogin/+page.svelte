<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { useUserId } from "$lib/stores/stores";
  import { goto } from "$app/navigation";
  import { getOverviewPath } from "$lib/utils/routing/routes";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import Headline from "$lib/base/Headline.svelte";

  export let data: PageData;

  onMount(() => {
    goto(getOverviewPath);
  });

  useUserId().set(data.userId);
</script>

<div class="w-screen h-screen flex flex-col gap-8 items-center justify-center">
  <ProgressRadial stroke={80} />
  <Headline style="small">Getting ready</Headline>
</div>
