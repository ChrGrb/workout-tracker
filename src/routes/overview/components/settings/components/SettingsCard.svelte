<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
</script>

<div class="card variant-filled-surface p-4 flex flex-col gap-4">
  <Headline style="medium">
    <slot name="headline" />
  </Headline>
  <slot name="content" />
</div>
