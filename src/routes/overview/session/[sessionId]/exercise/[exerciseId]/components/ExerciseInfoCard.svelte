<script lang="ts">
  import { AccordionItem } from "@skeletonlabs/skeleton";
  import { InfoIcon } from "svelte-feather-icons";

  interface Props {
    open?: boolean;
    headline?: import('svelte').Snippet;
    content?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    open = false,
    headline,
    content,
    children
  }: Props = $props();

  const content_render = $derived(content);
</script>

<AccordionItem
  class="card"
  regionControl="variant-soft-primary"
  regionPanel="pt-4 pb-6"
  hover=""
  {open}
>
  {#snippet lead()}
    <InfoIcon size="18" />
  {/snippet}
  {#snippet summary()}
    {@render headline?.()}
  {/snippet}
  {#snippet content()}
  
      {@render content_render?.()}
      {@render children?.()}
    
  {/snippet}
</AccordionItem>
