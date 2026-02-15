<script lang="ts">
  import Headline from "./Headline.svelte";
  import Container from "./Container.svelte";
  import clsx from "clsx";

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
  <div
    class={clsx(
      "z-50 relative bg-white/15 backdrop-blur-md backdrop-filter [mask-image:linear-gradient(to_bottom,black_70%,transparent)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] pb-10 border border-white/30 header-fix",
    )}
  >
    <div
      class="pointer-events-none absolute inset-0
              bg-gradient-to-b
              from-white/40 via-white/10 to-transparent"
    ></div>
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
  </div>
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
