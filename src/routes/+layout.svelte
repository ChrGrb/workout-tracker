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
  import {
    getReplicacheAfterInit,
    useBeamsClient,
    useScroll,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import { pwaInfo } from "virtual:pwa-info";
  import { onMount } from "svelte";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import Pusher from "pusher-js";
  import * as PusherPushNotifications from "@pusher/push-notifications-web";
  import {
    PUBLIC_REPLICACHE_PUSHER_KEY,
    PUBLIC_REPLICACHE_PUSHER_CLUSTER,
    PUBLIC_BEAMS_INSTANCE_ID,
  } from "$env/static/public";
  import { dev } from "$app/environment";
  import type { PageData } from "./$types";
  import type { ComponentEvents } from "svelte";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  export let data: PageData;

  useSettings();
  let userId = useUserId();
  let scroll = useScroll();
  let beamsClient = useBeamsClient();

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  function scrollHandler(event: ComponentEvents<AppShell>["scroll"]) {
    scroll.set(event.currentTarget.scrollTop);
  }

  function startBeamsClient(userId: string) {
    window.navigator.serviceWorker.ready.then(
      async (serviceWorkerRegistration) => {
        beamsClient.set(
          new PusherPushNotifications.Client({
            instanceId: PUBLIC_BEAMS_INSTANCE_ID,
            serviceWorkerRegistration: serviceWorkerRegistration,
          })
        );

        if (beamsClient)
          $beamsClient!
            .start()
            .then((beamsClient: any) => beamsClient.getDeviceId())
            .then(() => {
              $beamsClient!.clearDeviceInterests();
            })
            .then(() => $beamsClient!.addDeviceInterest(`user-${userId}`))
            .then(() => {
              if (dev) $beamsClient!.addDeviceInterest("debug-test");
            })
            .then(() => $beamsClient!.getDeviceInterests())
            .catch(console.error);
      }
    );
  }

  onMount(async () => {
    if (pwaInfo) {
      useRegisterSW({
        immediate: true,
      });
    }

    if ($userId) {
      listen($userId);
    }

    startBeamsClient($userId ?? "");
  });

  // Listen for changes to the remote data
  function listen(userId: string) {
    const replicache = getReplicacheAfterInit();
    if (!replicache) {
      return;
    }

    // Listen for pokes, and pull whenever we get one.
    Pusher.logToConsole = dev;
    const pusher = new Pusher(PUBLIC_REPLICACHE_PUSHER_KEY, {
      cluster: PUBLIC_REPLICACHE_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe(userId);
    channel.bind("poke", () => {
      replicache.pull();
    });
  }
</script>

<svelte:head>
  <title>Workout Tracker</title>
  <meta name="description" content="The minimal workout tracking app" />
  <meta name="theme-color" content="#FFFFFF" />
  {@html webManifestLink}
  <!-- Workaround for a svelte parsing error: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
</svelte:head>

<Modal />
<Toast />

<AppShell on:scroll={scrollHandler}>
  {#key data.url}
    <div in:fade={{ duration: 100, delay: 100 }} out:fade={{ duration: 100 }}>
      <slot />
    </div>
  {/key}
</AppShell>
