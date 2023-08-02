<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { page } from "$app/stores";
  import Headline from "$lib/base/Headline.svelte";
  import Button from "$lib/base/Button.svelte";
  import Container from "$lib/base/Container.svelte";
  import SocialButton from "./components/SocialButton.svelte";
  import { ConfiguredProviders } from "$lib/types/provider";
  import type { PageData } from "./$types";
  import { toastStore, type ToastSettings } from "@skeletonlabs/skeleton";

  export let data: PageData;

  if (data.error) {
    const errorToast: ToastSettings = {
      message: `An error occured during login. Please try again.`,
      background: "variant-filled-error",
    };
    toastStore.trigger(errorToast);
  }
</script>

<Container>
  <div class="flex flex-col p-5 justify-between gap-20">
    <Headline>Workout<br />Tracker</Headline>
    {#if $page.data.session}
      {#if $page.data.session.user?.image}
        <span
          style="background-image: url('{$page.data.session.user.image}')"
          class="avatar"
        />
      {/if}
      <span class="signedInText">
        <small>Signed in as</small><br />
        <strong>{$page.data.session.user?.name ?? "User"}</strong>
      </span>
      <Button action={() => signOut()}>Sign out</Button>
    {:else}
      <Headline style="small">Please sign in</Headline>
      <div class="flex flex-col gap-5">
        <SocialButton
          provider={ConfiguredProviders.github}
          providerName="GitHub"
        />
        <SocialButton
          provider={ConfiguredProviders.google}
          providerName="Google"
        />
        <SocialButton
          provider={ConfiguredProviders.apple}
          providerName="Apple"
        />
      </div>
    {/if}
  </div>
</Container>
