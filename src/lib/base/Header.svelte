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
      "bg-slate-100/90 dark:bg-primary-700/90 backdrop-blur-sm": $scroll > 20,
    })}
  >
    <Container>
      <div class="flex justify-between">
        <slot name="content">
          <Headline><slot /></Headline>
        </slot>
        <slot name="action" />
      </div>
    </Container>
  </div>
</div>

<div class="relative isolate opacity-0">
  <div class="z-50 relative">
    <Container>
      <slot name="content">
        <div class="flex justify-between">
          <Headline><slot /></Headline>
          <slot name="action" />
        </div>
      </slot>
    </Container>
  </div>
</div>
