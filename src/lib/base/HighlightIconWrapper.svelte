<script>
  /**
   * @typedef {Object} Props
   * @property {import('svelte').Snippet} [children]
   */

  /** @type {Props} */
  let { children } = $props();
</script>

<div
  class="bg-gradient-to-tr from-secondary-300 to-tertiary-300 text-on-secondary-token p-2 rounded-md"
>
  {@render children?.()}
</div>
