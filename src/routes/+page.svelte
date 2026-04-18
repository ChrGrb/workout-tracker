<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { useUserId } from "$lib/stores/stores";
  import { goto } from "$app/navigation";
  import { getOverviewPath } from "$lib/utils/routing/routes";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import Headline from "$lib/base/Headline.svelte";
  import { resolve } from "$app/paths";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  onMount(() => {
    goto(resolve("/auth/afterLogin", {}), { replaceState: true });
  });

  useUserId().set(data.userId);
</script>

<div class="w-screen h-screen flex flex-col gap-8 items-center justify-center">
  <ProgressRadial stroke={80} />
  <Headline style="small">Getting ready</Headline>
</div>
