<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { page } from "$app/stores";
  import Headline from "$lib/base/Headline.svelte";
  import Button from "$lib/base/Button.svelte";
  import Container from "$lib/base/Container.svelte";
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
      <Headline style="small">You are not signed in</Headline>
      <br />
      <Button action={() => signIn("github")}>Sign In with GitHub</Button>
    {/if}
  </div>
</Container>
