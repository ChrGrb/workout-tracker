<script lang="ts">
  import { AccordionItem } from "@skeletonlabs/skeleton";
  import { InfoIcon } from "svelte-feather-icons";

  export let open = false;
</script>

<AccordionItem
  class="card"
  regionControl="variant-soft-primary"
  regionPanel="pt-4 pb-6"
  hover=""
  {open}
>
  <svelte:fragment slot="lead"><InfoIcon size="18" /></svelte:fragment>
  <svelte:fragment slot="summary"><slot name="headline" /></svelte:fragment>
  <svelte:fragment slot="content">
    <slot name="content" />
    <slot />
  </svelte:fragment>
</AccordionItem>
