<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";

  export let action: () => void = () => {};
  export let type: "button" | "submit" | "reset" | null | undefined = "button";
  export let icon = false;
  export let highlight = false;
  export let classes = "";
  export let disabled = false;
  export let isLoading = false;
  export let loadingOnClick = false;

  let clicked = false;

  let clickAnimation = () => {
    clicked = true;
    setTimeout(() => {
      clicked = false;
    }, 100);
  };
</script>

<button
  class={clsx(
    classes,
    "variant-filled-primary drop-shadow-none transition-transform active:scale-100 ",
    {
      "scale-75": clicked,
      "btn-icon !bg-transparent text-inherit": icon,
      "btn border": !icon,
      "variant-filled-primary": highlight,
    }
  )}
  on:click={() => {
    clickAnimation();
    if (loadingOnClick === true) {
      isLoading = true;
    }
    if (type !== "submit") {
      action();
    }
  }}
  disabled={disabled || isLoading}
  {type}
>
  {#if isLoading}
    <slot name="spinner">
      <ProgressRadial
        width="w-6"
        stroke={100}
        meter={clsx({
          "stroke-white": !icon,
          "stroke-primary-500": icon,
        })}
      />
    </slot>
  {:else}
    <slot />
  {/if}
</button>
