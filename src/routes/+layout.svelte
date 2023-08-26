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
  import { useSettings } from "$lib/stores/stores";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  export let data;

  useSettings();

  import { pwaInfo } from "virtual:pwa-info";
  import { onMount } from "svelte";
  import { useRegisterSW } from "virtual:pwa-register/svelte";

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  onMount(async () => {
    if (pwaInfo) {
      useRegisterSW({
        immediate: true,
      });
    }
  });
</script>

<svelte:head>
  <title>Workout Tracker</title>
  <meta name="description" content="The minimal workout tracking app" />
  <meta name="theme-color" content="#000000" />
  {@html webManifestLink}
  <!-- Workaround for a svelte parsing error: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
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
