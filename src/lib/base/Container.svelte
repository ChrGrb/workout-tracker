<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div class="p-5 relative md:max-w-5xl md:mx-auto overflow-visible h-full">
  {@render children?.()}
</div>
