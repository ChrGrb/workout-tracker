<script lang="ts">
  import Github from "$lib/icons/github.svg?component";
  import Google from "$lib/icons/google.svg?component";
  import Apple from "$lib/icons/apple.svg?component";
  import { ConfiguredProviders } from "$lib/types/provider";

  interface Props {
    provider: ConfiguredProviders;
  }

  let { provider }: Props = $props();
</script>

{#if provider === ConfiguredProviders.github}
  <Github />
{:else if provider === ConfiguredProviders.google}
  <Google />
{:else if provider === ConfiguredProviders.apple}
  <Apple class="p-1" />
{/if}
