<script lang="ts">
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
</script>

<button
  class="flex flex-col gap-4 justify-center items-center bg-slate-300 rounded-md p-4 aspect-square text-white text-center"
  on:click={addAction}
>
  <PlusIcon size="36" />
  <p class="text-center font-medium text-lg">Add workout</p>
</button>
