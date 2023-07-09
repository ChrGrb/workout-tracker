<script lang="ts">
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
</script>

<button
  class="card variant-ghost-primary flex flex-col gap-4 justify-center items-center p-4 aspect-square text-center"
  on:click={addAction}
  type="reset"
>
  <PlusIcon size="36" />
  <p class="text-center font-medium text-lg">Add workout type</p>
</button>
