<script lang="ts">
  export let style: "large" | "medium" | "small" = "large";

  let classes = "";

  switch (style) {
    case "large": {
      classes = "font-bold text-5xl leading-1";
      break;
    }
    case "medium": {
      classes = "font-regular text-3xl leading-1";
      break;
    }
    case "small": {
      classes = "font-light text-2xl leading-1";
      break;
    }
  }
</script>

<h1 class={classes}>
  <slot />
</h1>
