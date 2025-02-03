<script lang="ts">
  import { ProgressRadial } from "@skeletonlabs/skeleton";
  import clsx from "clsx";

  interface Props {
    action?: () => void;
    type?: "button" | "submit" | "reset" | null | undefined;
    icon?: boolean;
    highlight?: boolean;
    classes?: string;
    disabled?: boolean;
    isLoading?: boolean;
    loadingOnClick?: boolean;
    spinner?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    action = () => {},
    type = "button",
    icon = false,
    highlight = false,
    classes = "",
    disabled = false,
    isLoading = $bindable(false),
    loadingOnClick = false,
    spinner,
    children
  }: Props = $props();
</script>

<button
  class={clsx(
    classes,
    "variant-filled-primary drop-shadow-none transition-transform active:scale-100 ",
    {
      "btn-icon !bg-transparent text-inherit": icon,
      btn: !icon,
      "border active:border hover:border-primary-500": !icon && !highlight,
      "variant-filled-primary": highlight,
    }
  )}
  onclick={() => {
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
    {#if spinner}{@render spinner()}{:else}
      <ProgressRadial
        width="w-6"
        stroke={100}
        meter={clsx({
          "stroke-white": !icon,
          "stroke-primary-500": icon,
        })}
      />
    {/if}
  {:else}
    {@render children?.()}
  {/if}
</button>
