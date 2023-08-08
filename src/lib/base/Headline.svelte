<script lang="ts">
  import clsx from "clsx";

  export let style: "large" | "medium" | "small" = "large";
  export let classes = "";
</script>

{#if style === "large"}
  <h1 class={clsx(classes, "h1")}>
    <slot />
  </h1>
{:else if style === "medium"}
  <h2 class={clsx(classes, "h2")}>
    <slot />
  </h2>
{:else if style === "small"}
  <h3 class={clsx(classes, "h3")}>
    <slot />
  </h3>
{/if}
