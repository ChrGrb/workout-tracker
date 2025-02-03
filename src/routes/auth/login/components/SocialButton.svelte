<script lang="ts">
  import clsx from "clsx";
  import SocialIcon from "./SocialIcon.svelte";
  import { ConfiguredProviders } from "$lib/types/provider";
  import { signIn } from "@auth/sveltekit/client";

  interface Props {
    provider: ConfiguredProviders;
    providerName: string;
  }

  let { provider, providerName }: Props = $props();
</script>

<button
  type="button"
  onclick={() => signIn(provider)}
  class={clsx("btn variant-filled pl-1 items-start justify-start py-1", {
    "bg-[#333] text-white": provider === ConfiguredProviders.github,
    "bg-white text-black": provider === ConfiguredProviders.google,
    "bg-black text-white": provider === ConfiguredProviders.apple,
  })}
>
  <div class="flex flex-row gap-4 justify-start items-center">
    <SocialIcon {provider} />
    <p>Continue with {providerName}</p>
  </div>
</button>
