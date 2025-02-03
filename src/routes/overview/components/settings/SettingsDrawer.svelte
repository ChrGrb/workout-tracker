<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { LogOutIcon } from "svelte-feather-icons";
  import { Avatar } from "@skeletonlabs/skeleton";
  import Headline from "$lib/base/Headline.svelte";
  import LightSwitch from "$lib/base/LightSwitch.svelte";
  import TimerSettings from "./TimerSettings.svelte";
  import SettingsCard from "./components/SettingsCard.svelte";
  import type { UserWithSettings } from "$lib/utils/prismaTypes";
  import { signOut } from "@auth/sveltekit/client";
  import * as Drawer from "$lib/components/ui/drawer";

  
  interface Props {
    // Props
    user: UserWithSettings;
  }

  let { user }: Props = $props();

  let initials = user.name
    ?.split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 2);
</script>

<Drawer.Content
  class="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]"
>
  <Drawer.Header>
    <Drawer.Title>Settings</Drawer.Title>
  </Drawer.Header>
  <div
    class="max-w-md w-full mx-auto flex flex-col overflow-auto p-4 rounded-t-[10px]"
  >
    <div class="p-4 space-y-4 flex flex-col gap-6 relative">
      {#if user}
        <div style="flex flex-col gap-4">
          <Headline style="medium">User</Headline>
          <div
            class="flex flex-col justify-start items-start gap-4 card variant-filled-primary p-6 mt-4"
          >
            <Avatar
              src={user.image ?? ""}
              {initials}
              width="w-24"
              rounded="rounded-full"
            />
            <div class="grow-0 flex flex-col gap-2">
              <div class="flex flex-row gap-2 items-center">
                <Headline style="small">{user.name}</Headline>
              </div>
              <div class="flex flex-row gap-1 items-center">
                <p class="text-primary-300">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <hr />
      {/if}

      <SettingsCard>
        {#snippet headline()}
                Dark Mode
              {/snippet}
        {#snippet content()}
                <LightSwitch />
              {/snippet}
      </SettingsCard>

      {#if user}
        <hr />

        <TimerSettings {user} />
      {/if}

      <hr />

      <div class="flex flex-col justify-between items-start gap-4">
        <Button action={signOut} classes="w-full flex flex-row gap-4">
          <p>Sign Out</p>
          <LogOutIcon size="24" />
        </Button>
      </div>
    </div>
  </div>
</Drawer.Content>
