<script lang="ts">
  // Renders only its children — stands in for wrapper components (e.g.
  // SwipeToAction) whose behavior is irrelevant to a presentational test.
  let { children } = $props();
</script>

{@render children?.()}
