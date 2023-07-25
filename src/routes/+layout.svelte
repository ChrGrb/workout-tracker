<script lang="ts">
  import "../theme.postcss";
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  import { fade } from "svelte/transition";
  import "../app.css";

  export let data;
</script>

{#key data.url}
  <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
    <slot />
  </div>
{/key}
