<script lang="ts">
  export let style: "large" | "medium" | "small" = "large";
</script>

{#if style === "large"}
  <h1 class="h1">
    <slot />
  </h1>
{:else if style === "medium"}
  <h2 class="h2">
    <slot />
  </h2>
{:else if style === "small"}
  <h3 class="h3">
    <slot />
  </h3>
{/if}
