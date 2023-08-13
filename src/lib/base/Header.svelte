<script>
  import Headline from "./Headline.svelte";
  import HeadlineBackground from "./HeadlineBackground.svelte";
</script>

<div class="relative isolate">
  <HeadlineBackground />
  <div class="z-50 relative">
    <slot name="content">
      <Headline><slot /></Headline>
    </slot>
  </div>
</div>
