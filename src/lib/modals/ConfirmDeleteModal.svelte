<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { signOut } from "@auth/sveltekit/client";
  import {
    AtSignIcon,
    LogOutIcon,
    SettingsIcon,
    Trash2Icon,
    UserIcon,
    XIcon,
  } from "svelte-feather-icons";
  import { Avatar, LightSwitch, modalStore } from "@skeletonlabs/skeleton";
  import Headline from "$lib/base/Headline.svelte";
  import type { User } from "@prisma/client";
  import { setResponse } from "@sveltejs/kit/node";

  // Props
  export let parent: any;
</script>

{#if $modalStore[0]}
  <div
    class="card p-6 w-modal shadow-xl space-y-4 flex flex-col gap-2 relative"
  >
    <Headline>{$modalStore[0].title ?? "(title missing)"}</Headline>
    <article>{$modalStore[0].body ?? "(body missing)"}</article>
    <div class="flex flex-row gap-4">
      <Button
        action={() => {
          $modalStore[0].response?.(false);
          modalStore.close();
        }}
        classes="w-full flex flex-row gap-4 variant-filled-surface"
      >
        <p>Cancel</p>
      </Button>
      <Button
        action={() => {
          $modalStore[0].response?.(true);
          modalStore.close();
        }}
        classes="w-full flex flex-row gap-4 variant-filled-error"
      >
        <p>Confirm</p>
      </Button>
    </div>
  </div>
{/if}
