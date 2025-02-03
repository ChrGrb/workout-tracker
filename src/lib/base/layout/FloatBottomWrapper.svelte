<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div
  class="fixed bottom-0 inset-x-0 pb-4 pt-2 bg-gradient-to-t from-surface-300 dark:from-surface-900 to-transparent"
>
  {@render children?.()}
</div>
