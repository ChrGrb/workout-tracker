<script lang="ts">
  import Github from "$lib/icons/github.svg?component";
  import Google from "$lib/icons/google.svg?component";
  import { ConfiguredProviders } from "$lib/types/provider";

  export let provider: ConfiguredProviders;
</script>

{#if provider === ConfiguredProviders.github}
  <Github />
{:else if provider === ConfiguredProviders.google}
  <Google />
{/if}
