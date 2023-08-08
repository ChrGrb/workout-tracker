<script>
  import Headline from "./Headline.svelte";
  import HeadlineBackground from "./HeadlineBackground.svelte";
</script>

<div class="relative">
  <HeadlineBackground />
  <Headline
    classes="invert dark:invert-0 mix-blend-difference dark:mix-blend-normal z-50 font-['Courier']"
    ><slot /></Headline
  >
</div>
