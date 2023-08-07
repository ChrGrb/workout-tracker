<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
  export let isLoading = false;
</script>

<button
  class={clsx(
    "card variant-soft-primary flex flex-col gap-4 justify-center items-center p-4 aspect-square text-center text-primary-700 drop-shadow-md"
  )}
  on:click={() => {
    isLoading = true;
    addAction();
  }}
>
  {#if isLoading}
    <ProgressRadial width="w-[36px]" stroke={100} meter="stroke-primary-700" />
  {:else}
    <PlusIcon size="36" />
  {/if}
  <p class="text-center font-medium text-lg">Add exercise</p>
</button>
