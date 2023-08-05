<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { modalStore } from "@skeletonlabs/skeleton";
  import Headline from "$lib/base/Headline.svelte";
  import { XIcon } from "svelte-feather-icons";

  // Props
  export let parent: any;
</script>

{#if $modalStore[0]}
  <div
    class="card p-5 w-modal shadow-xl space-y-2 flex flex-col gap-2 relative"
  >
    <div class="absolute top-5 right-5">
      <Button action={() => modalStore.close()} icon={true}
        ><XIcon size="24" /></Button
      >
    </div>
    <div class="pr-5">
      <Headline>{$modalStore[0].title ?? "(title missing)"}</Headline>
    </div>
    <article class="whitespace-pre-line">
      {$modalStore[0].body ?? "(body missing)"}
    </article>
  </div>
{/if}
