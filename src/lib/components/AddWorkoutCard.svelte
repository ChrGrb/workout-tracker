<script lang="ts">
  import clsx from "clsx";
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
</script>

<button
  class={clsx(
    "card variant-soft-primary flex flex-col gap-4 justify-center items-center p-4 aspect-square text-center text-primary-700"
  )}
  on:click={addAction}
>
  <PlusIcon size="36" />
  <p class="text-center font-medium text-lg">Add exercise</p>
</button>
