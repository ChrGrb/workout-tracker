<script>
  import Headline from "./Headline.svelte";
  import Container from "./Container.svelte";
  import clsx from "clsx";
  import { useScroll } from "$lib/stores/stores";

  let scroll = useScroll();
</script>

<div class="fixed z-50 w-full isolate">
  <div
    class={clsx("z-50 relative transition-all duration-500", {
      "bg-white dark:bg-primary-700/90 backdrop-blur-xl": $scroll > 20,
    })}
  >
    <Container>
      <div class="flex justify-start items-center align-middle gap-4">
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
