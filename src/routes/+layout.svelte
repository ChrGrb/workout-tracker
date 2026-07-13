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
    useBackNavigation,
    useBeamsClient,
    useForwardNavigation,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import { pwaInfo } from "virtual:pwa-info";
  import { onMount } from "svelte";
  import { useRegisterSW } from "virtual:pwa-register/svelte";
  import * as PusherPushNotifications from "@pusher/push-notifications-web";
  import { PUBLIC_BEAMS_INSTANCE_ID } from "$env/static/public";
  import { dev, browser } from "$app/environment";
  import { afterNavigate, onNavigate, preloadData } from "$app/navigation";
  import { page } from "$app/stores";
  import { mountVercelToolbar } from "@vercel/toolbar/vite";
  import { initZero } from "$lib/zero/z.svelte";
  import { startOutbox } from "$lib/zero/outbox";
  import OutboxIndicator from "$lib/components/OutboxIndicator.svelte";

  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  initializeStores();

  useSettings();
  let userId = useUserId();
  let beamsClient = useBeamsClient();

  // Initialise Zero (and the offline outbox) once the user id is known. An $effect
  // re-runs when $userId becomes available, so this fires both on a fresh page load
  // and right after login (when the layout itself doesn't re-mount). initZero and
  // startOutbox are both idempotent. Runs alongside Replicache during the migration.
  $effect(() => {
    if (browser && $userId) startOutbox(initZero($userId));
  });

  let webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

  // Create the Beams client once the service worker is ready.
  async function createBeamsClient() {
    const serviceWorkerRegistration =
      await window.navigator.serviceWorker.ready;
    beamsClient.set(
      new PusherPushNotifications.Client({
        instanceId: PUBLIC_BEAMS_INSTANCE_ID,
        serviceWorkerRegistration,
      }),
    );
  }

  // Subscribe the device to the `user-<id>` interest the server publishes to.
  // The server pushes timer notifications via publishToInterests(["user-<id>"]),
  // so the device MUST be subscribed to exactly that interest or delivery fails.
  async function registerUserInterest(
    client: PusherPushNotifications.Client,
    userId: string,
  ) {
    await client.start();
    await client.getDeviceId();
    await client.clearDeviceInterests();
    await client.addDeviceInterest(`user-${userId}`);
    if (dev) await client.addDeviceInterest("debug-test");
    return client.getDeviceInterests();
  }

  // Re-register whenever the user id becomes known. On a fresh login the layout
  // does not remount and $userId is only set afterwards by the page component,
  // so registering once in onMount would subscribe the device to the empty
  // `user-` interest. Guard on a non-empty id and only re-run when it changes.
  let registeredInterestFor: string | undefined = $state(undefined);
  $effect(() => {
    if (!browser || !$userId || !$beamsClient) return;
    if (registeredInterestFor === $userId) return;
    registeredInterestFor = $userId;
    registerUserInterest($beamsClient, $userId).catch(console.error);
  });

  onMount(async () => {
    // mountVercelToolbar();
    if (pwaInfo) {
      useRegisterSW({
        immediate: true,
      });
    }

    createBeamsClient().catch(console.error);
  });

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
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- framework-generated PWA manifest link tag, not user content -->
  {@html webManifestLink}
  <!-- Workaround for a svelte parsing error: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, nonce-guarded theme-init script, not user content -->
  {@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
</svelte:head>

<Modal />
<Toast />
<OutboxIndicator />

{#key $page.url.pathname}
  <div data-vaul-drawer-wrapper class="bg-white">
    {@render children?.()}
  </div>
{/key}
