<script lang="ts">
  import clsx from "clsx";

  interface Props {
    style?: "large" | "medium" | "small";
    classes?: string;
    children?: import('svelte').Snippet;
  }

  let { style = "large", classes = "", children }: Props = $props();
</script>

{#if style === "large"}
  <h1 class={clsx(classes, "h1")}>
    {@render children?.()}
  </h1>
{:else if style === "medium"}
  <h2 class={clsx(classes, "h2")}>
    {@render children?.()}
  </h2>
{:else if style === "small"}
  <h3 class={clsx(classes, "h3")}>
    {@render children?.()}
  </h3>
{/if}
