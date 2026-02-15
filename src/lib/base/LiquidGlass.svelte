<script lang="ts">
  import clsx from "clsx";

  interface Props {
    children?: import("svelte").Snippet;
    className?: string;
  }

  let { children, className }: Props = $props();
</script>

<div
  class={clsx(
    "bg-white/15 backdrop-blur-md backdrop-filter  shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/30 overflow-hidden",
    className,
  )}
>
  <div
    class="pointer-events-none absolute inset-0
              bg-gradient-to-b
              from-white/40 via-white/10 to-transparent"
  ></div>
  {@render children?.()}
</div>
