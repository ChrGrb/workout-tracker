<script lang="ts">
  import { PlusSquareIcon, ShareIcon } from "svelte-feather-icons";
  import SettingsCard from "./components/SettingsCard.svelte";
  import Button from "$lib/base/Button.svelte";
  import { useBeamsClient, useUserId } from "$lib/stores/stores";
  import { dev } from "$app/environment";

  let beamsClient = useBeamsClient();
  let userId = useUserId();
</script>

<SettingsCard>
  {#snippet headline()}
    Notifications
  {/snippet}

  {#snippet content()}
  
      <ol class="list">
        <li class="pb-3">
          <span class="badge-icon p-4 variant-filled-primary font-mono"> 1 </span>
          <span class="flex-auto items-center">
            Open the
            <ShareIcon size="18" class="inline-flex self-center mx-1 mb-1" />
            share menu
          </span>
        </li>
        <li class="pb-3">
          <span class="badge-icon p-4 variant-filled-primary font-mono">2</span>
          <span class="flex-auto items-baseline leading-[1]">
            Click on
            <PlusSquareIcon size="18" class="inline-flex self-center mx-1 mb-1" />
            <b>Add to home screen</b>
          </span>
        </li>
        <li>
          <span class="badge-icon p-4 variant-filled-primary font-mono">3</span>
          <span class="flex-auto items-baseline leading-[1]">
            Click on <b>Add</b>
          </span>
        </li>
      </ol>

      <Button
        action={async () => {
          if ($beamsClient)
            $beamsClient
              .start()
              .then(() => {
                if ($beamsClient) return $beamsClient.getDeviceId();
              })
              .then(() => {
                if ($beamsClient) $beamsClient.clearDeviceInterests();
              })
              .then(() => {
                if ($beamsClient)
                  $beamsClient.addDeviceInterest(`user-${$userId}`);
              })
              .then(() => {
                if (dev)
                  if ($beamsClient) $beamsClient.addDeviceInterest("debug-test");
              })
              .then(() => {
                if ($beamsClient) return $beamsClient.getDeviceInterests();
              })
              .catch(console.error);
        }}
      >
        Enable Notifications
      </Button>
    
  {/snippet}
</SettingsCard>
