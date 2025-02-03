<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  interface Props {
    headline?: import('svelte').Snippet;
    content?: import('svelte').Snippet;
  }

  let { headline, content }: Props = $props();
</script>

<div class="flex flex-col gap-4">
  <Headline style="medium">
    {@render headline?.()}
  </Headline>
  {@render content?.()}
</div>
