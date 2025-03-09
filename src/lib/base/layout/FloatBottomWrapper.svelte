<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div class="fixed bottom-0 inset-x-0 pb-4 pt-2">
  {@render children?.()}
</div>
