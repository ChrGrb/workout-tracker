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
</script>

<button
  class={clsx(classes, "variant-filled-primary", {
    "btn-icon !bg-transparent text-inherit": icon,
    "btn drop-shadow-lg": !icon,
    "variant-filled-primary drop-shadow-xl": highlight,
  })}
  on:click={() => {
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
    <ProgressRadial
      width="w-6"
      stroke={100}
      meter={clsx({
        "stroke-white": !icon,
        "stroke-primary-500": icon,
      })}
    />
  {:else}
    <slot />
  {/if}
</button>
