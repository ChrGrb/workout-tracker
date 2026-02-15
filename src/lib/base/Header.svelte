<script lang="ts">
  import Headline from "./Headline.svelte";
  import Container from "./Container.svelte";
  import clsx from "clsx";
  import LiquidGlass from "./LiquidGlass.svelte";

  let scroll: number = $state<number>(0);
  interface Props {
    contentAlwaysVisible?: boolean;
    headlineStyle?: "large" | "medium" | "small";
    action?: import("svelte").Snippet;
    content?: import("svelte").Snippet;
    children?: import("svelte").Snippet;
    actionEnd?: import("svelte").Snippet;
  }

  let {
    contentAlwaysVisible = false,
    headlineStyle = "small",
    action,
    content,
    children,
    actionEnd,
  }: Props = $props();
</script>

<svelte:window bind:scrollY={scroll} />

<div class="fixed z-50 w-full isolate">
  <LiquidGlass
    className={clsx(
      "z-50 relative header-fix [mask-image:linear-gradient(to_bottom,black_70%,transparent)] pb-10",
    )}
  >
    <Container>
      <div class="flex justify-start items-center align-middle gap-4">
        {@render action?.()}
        <div
          class="items-center"
          style="opacity: {contentAlwaysVisible
            ? 1
            : Math.min(Math.max(scroll - 90, 0) / 90, 1)}"
        >
          {#if content}{@render content()}{:else}
            <Headline classes="line-clamp-1" style={headlineStyle}
              >{@render children?.()}</Headline
            >
          {/if}
        </div>
        <div class="absolute right-4 top-4">
          {@render actionEnd?.()}
        </div>
      </div>
    </Container>
  </LiquidGlass>
</div>

<div class="relative isolate opacity-0">
  <div class="z-50 relative header-fix">
    <Container>
      <div class="flex justify-start gap-8">
        {@render action?.()}
        {#if content}{@render content()}{:else}
          <Headline classes="line-clamp-1">{@render children?.()}</Headline>
        {/if}
        <div class="absolute right-4 top-4">
          {@render actionEnd?.()}
        </div>
      </div>
    </Container>
  </div>
</div>
