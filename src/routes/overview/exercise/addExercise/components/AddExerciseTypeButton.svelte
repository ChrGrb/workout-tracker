<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { PlusIcon } from "svelte-feather-icons";

  export let addAction = () => {};
</script>

<Button
  classes="card variant-ringed-primary flex flex-col gap-4 justify-center items-center p-4 aspect-square text-center text-primary-700"
  action={addAction}
  type="reset"
  loadingOnClick={true}
>
  <PlusIcon size="36" />
  <p class="text-center font-medium text-lg">Add type</p>
</Button>
