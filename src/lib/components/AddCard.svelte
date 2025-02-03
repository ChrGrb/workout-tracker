<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import { PlusIcon } from "svelte-feather-icons";

  interface Props {
    addAction?: any;
    isInline?: boolean;
    loadingOnClick?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    addAction = () => {},
    isInline = false,
    loadingOnClick = true,
    children
  }: Props = $props();
</script>

<Button
  classes={clsx(
    "card variant-filled-primary w-full flex gap-4 p-4 drop-shadow-xl relative",
    {
      "justify-between items-center flex-row mt-4": isInline,
      "aspect-square text-center justify-center items-center flex-col":
        !isInline,
    }
  )}
  action={addAction}
  {loadingOnClick}
>
  {#snippet spinner()}
    <ProgressRadial
      
      width="w-[48px]"
      stroke={100}
      meter="stroke-primary-900"
    />
  {/snippet}
  <Headline style="small">
    {@render children?.()}
  </Headline>
  <PlusIcon size="32" />
</Button>
