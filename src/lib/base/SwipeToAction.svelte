<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { Motion, animate, useMotionValue } from "svelte-motion";
  import { ChevronLeftIcon, Trash2Icon } from "svelte-feather-icons";
  import { fade } from "svelte/transition";
  import generateId from "$lib/utils/generateId";
  import type { Action } from "svelte/action";

  interface Props {
    buttonWidth?: number;
    deleteAction: () => void;
    key?: any;
    disabled?: boolean;
    x?: any;
    actionItems?: import("svelte").Snippet;
    children?: import("svelte").Snippet;
  }

  let {
    buttonWidth = 50,
    deleteAction,
    key = generateId(),
    disabled = false,
    x = $bindable(useMotionValue(0)),
    actionItems,
    children,
  }: Props = $props();
  let swipeButtonWidth = buttonWidth * 1.2;

  let chevronGap = $derived(-($x + swipeButtonWidth) * 0.2);

  function clickOutside(element: HTMLElement, callbackFunction: any) {
    function onClick(event: any) {
      if (!element.contains(event.target)) {
        callbackFunction();
      }
    }

    document.body.addEventListener("click", onClick);

    return {
      update(newCallbackFunction: any) {
        callbackFunction = newCallbackFunction;
      },
      destroy() {
        document.body.removeEventListener("click", onClick);
      },
    };
  }

  const children_render = $derived(children);
</script>

{#if !disabled}
  <div
    class="w-full relative"
    style="touch-action: pan-y;"
    id={key}
    use:clickOutside={() => {
      animate(x, 0);
    }}
  >
    <div
      class="card absolute w-1/2 top-[1px] bottom-[1px] right-[1px] variant-filled-error flex justify-end align-middle"
    >
      {#if actionItems}{@render actionItems()}{:else}
        <Button
          action={deleteAction}
          icon={$x >= -swipeButtonWidth}
          classes="!bg-transparent text-inherit align-end"
        >
          {#if $x < -swipeButtonWidth}
            <div
              class="flex flex-row justify-center align-end"
              style={`gap: ${chevronGap}px`}
              in:fade={{ duration: 100 }}
            >
              <ChevronLeftIcon size="18" />
              <ChevronLeftIcon size="18" />
              <ChevronLeftIcon size="18" />
            </div>
          {:else}
            <div
              transition:fade={{ duration: 100 }}
              class="flex items-center mr-2"
              style={`width: ${buttonWidth}`}
            >
              <Trash2Icon size="18" class="mx-auto" />
            </div>
          {/if}
        </Button>
      {/if}
    </div>
    <Motion
      drag={disabled ? false : "x"}
      style={{ x }}
      dragConstraints={{ left: -buttonWidth, right: 0 }}
      dragElastic={0.1}
      onDragEnd={() => {
        if ($x < -swipeButtonWidth * 1.3) deleteAction();
        animate(x, $x < -(buttonWidth * 0.8) ? -buttonWidth : 0);
      }}
    >
      {#snippet children({ motion }: { motion: Action })}
        <div use:motion>
          {@render children_render?.()}
        </div>
      {/snippet}
    </Motion>
  </div>
{:else}
  {@render children?.()}
{/if}
