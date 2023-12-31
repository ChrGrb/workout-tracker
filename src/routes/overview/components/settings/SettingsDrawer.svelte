<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import { signOut } from "@auth/sveltekit/client";
  import { LogOutIcon, XIcon } from "svelte-feather-icons";
  import { Avatar, SlideToggle, modalStore } from "@skeletonlabs/skeleton";
  import Headline from "$lib/base/Headline.svelte";
  import LightSwitch from "$lib/base/LightSwitch.svelte";
  import TimerSettings from "./TimerSettings.svelte";
  import NotificationSettings from "./NotificationSettings.svelte";
  import SettingsCard from "./components/SettingsCard.svelte";
  import type { UserWithSettings } from "$lib/utils/prismaTypes";

  // Props
  export let user: UserWithSettings;

  let initials = user.name
    ?.split(" ")
    .map((word) => word.at(0))
    .join("")
    .slice(0, 2);
</script>

{#if $modalStore[0]}
  <div
    class="card p-4 w-modal shadow-xl space-y-4 flex flex-col gap-6 relative"
  >
    <div class="absolute top-7 right-5">
      <Button classes="z-50" action={() => modalStore.close()} icon={true}>
        <XIcon size="24" />
      </Button>
    </div>
    <Headline>Settings</Headline>
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

    <SettingsCard>
      <svelte:fragment slot="headline">Dark Mode</svelte:fragment>
      <svelte:fragment slot="content"><LightSwitch /></svelte:fragment>
    </SettingsCard>

    <hr />

    <TimerSettings {user} />

    <hr />

    <NotificationSettings />

    <div class="flex flex-col justify-between items-start gap-4">
      <Button action={signOut} classes="w-full flex flex-row gap-4">
        <p>Sign Out</p>
        <LogOutIcon size="24" />
      </Button>
    </div>
  </div>
{/if}
