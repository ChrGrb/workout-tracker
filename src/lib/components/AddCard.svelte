<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
  export let isInline = false;
</script>

<Button
  classes={clsx(
    "card variant-filled-primary flex gap-4 p-4 drop-shadow-xl relative",
    {
      "justify-between items-center flex-row mt-4": isInline,
      "aspect-square text-center justify-center items-center flex-col":
        !isInline,
    }
  )}
  action={addAction}
  loadingOnClick={true}
>
  <svelte:component
    this={ProgressRadial}
    slot="spinner"
    width="w-[48px]"
    stroke={100}
    meter="stroke-primary-900"
  />
  <Headline style="small">
    <slot />
  </Headline>
  <PlusIcon size="32" />
</Button>
