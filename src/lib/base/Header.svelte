<script lang="ts">
  import Headline from "./Headline.svelte";
  import Container from "./Container.svelte";
  import clsx from "clsx";

  let scroll: number;
  export let contentAlwaysVisible = false;
  export let headlineStyle: "large" | "medium" | "small" = "small";
</script>

<svelte:window bind:scrollY={scroll} />

<div class="fixed z-50 w-full isolate">
  <div
    class={clsx("z-50 relative bg-white")}
    style="box-shadow: 0px 5px 5px rgba(0, 0, 0, {Math.min(scroll / 90, 0.3)})"
  >
    <Container>
      <div class="flex justify-start items-center align-middle gap-4">
        <slot name="action" />
        <div
          class="items-center"
          style="opacity: {contentAlwaysVisible
            ? 1
            : Math.min(Math.max(scroll - 90, 0) / 90, 1)}"
        >
          <slot name="content">
            <Headline classes="line-clamp-1" style={headlineStyle}
              ><slot /></Headline
            >
          </slot>
        </div>
        <div class="absolute right-4 top-4">
          <slot name="actionEnd" />
        </div>
      </div>
    </Container>
  </div>
</div>

<div class="relative isolate opacity-0">
  <div class="z-50 relative">
    <Container>
      <div class="flex justify-start gap-8">
        <slot name="action" />
        <slot name="content">
          <Headline classes="line-clamp-1"><slot /></Headline>
        </slot>
        <div class="absolute right-4 top-4">
          <slot name="actionEnd" />
        </div>
      </div>
    </Container>
  </div>
</div>
