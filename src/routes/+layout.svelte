<script lang="ts">
  import "../app.css";
  import {
    Modal,
    Toast,
    initializeStores,
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
    useBackNavigation,
    useBeamsClient,
    useForwardNavigation,
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
  import { afterNavigate, onNavigate, preloadData } from "$app/navigation";
  import { page } from "$app/stores";

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  useSettings();
  let userId = useUserId();
  let scroll = useScroll();
  let beamsClient = useBeamsClient();

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

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

  const backNavigation = useBackNavigation();
  const forwardNavigation = useForwardNavigation();

  afterNavigate(({ from }) => {
    preloadData(from?.url?.pathname ?? "");
  });

  onNavigate((navigation) => {
    if ($backNavigation) {
      backNavigation.set(false);
      document.documentElement.dataset.back = "true";
    } else {
      document.documentElement.removeAttribute("data-back");
    }

    if (navigation.to?.url.searchParams.get("callback") || $forwardNavigation) {
      forwardNavigation.set(false);
      document.documentElement.dataset.forward = "true";
    } else {
      document.documentElement.removeAttribute("data-forward");
    }

    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
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

<!-- <AppShell on:scroll={scrollHandler}> -->
{#key $page.url.pathname}
  <div data-vaul-drawer-wrapper class="bg-white">
    <slot />
  </div>
{/key}
<!-- </AppShell> -->
