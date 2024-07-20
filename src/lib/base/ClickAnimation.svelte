<script lang="ts">
  import clsx from "clsx";

  let clicked = false;

  let clickAnimation = () => {
    clicked = true;
    setTimeout(() => {
      clicked = false;
    }, 300);
  };
</script>

<div
  on:click|stopPropagation={clickAnimation}
  class={clsx("transition-transform duration-150", { "scale-75": clicked })}
>
  <slot />
</div>
