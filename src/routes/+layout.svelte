<script lang="ts">
  import "../theme.postcss";
  import "@skeletonlabs/skeleton/styles/skeleton.css";
  import { fade } from "svelte/transition";
  import "../app.css";
  import {
    AppShell,
    Modal,
    Toast,
    setInitialClassState,
  } from "@skeletonlabs/skeleton";
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";

  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  export let data;
</script>

<svelte:head>
  <!-- Workaround for a svelte parsing error: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

<Modal />
<Toast />

<AppShell>
  {#key data.url}
    <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
      <slot />
    </div>
  {/key}
</AppShell>
