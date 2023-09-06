<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
</script>

<div class="flex flex-col gap-4">
  <Headline style="medium">
    <slot name="headline" />
  </Headline>
  <slot name="content" />
</div>
