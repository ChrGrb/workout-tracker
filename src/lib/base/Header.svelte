<script>
  import Headline from "./Headline.svelte";
  import HeadlineBackground from "./HeadlineBackground.svelte";
</script>

<div class="relative isolate">
  <HeadlineBackground />
  <Headline classes="z-50 relative"><slot /></Headline>
</div>
