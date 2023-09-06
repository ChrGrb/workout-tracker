<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
</script>

<Button
  classes={clsx(
    "card variant-soft-primary flex flex-col gap-4 justify-center items-center p-4 aspect-square text-center drop-shadow-xl relative"
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
  <PlusIcon size="48" />
  <p class="text-center text-md drop-shadow-none absolute bottom-4">
    <slot />
  </p>
</Button>
