<script lang="ts">
  import { stopPropagation } from 'svelte/legacy';

  import clsx from "clsx";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let clicked = $state(false);

  let clickAnimation = () => {
    clicked = true;
    setTimeout(() => {
      clicked = false;
    }, 300);
  };
</script>

<div
  onclick={stopPropagation(clickAnimation)}
  class={clsx("transition-transform duration-150", { "scale-75": clicked })}
>
  {@render children?.()}
</div>
