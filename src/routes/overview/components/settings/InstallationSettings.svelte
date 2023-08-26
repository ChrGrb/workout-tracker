<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import { PlusSquareIcon, ShareIcon } from "svelte-feather-icons";
  import SettingsCard from "./components/SettingsCard.svelte";
</script>

<SettingsCard>
  <svelte:fragment slot="headline">Installation</svelte:fragment>

  <svelte:fragment slot="content">
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
  </svelte:fragment>
</SettingsCard>
