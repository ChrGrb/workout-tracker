<script lang="ts">
  import {
    modeCurrent,
    setModeCurrent,
    setModeUserPrefers,
  } from "@skeletonlabs/skeleton";
  import clsx from "clsx";
  import Headline from "./Headline.svelte";
</script>

<div class="flex flex-row w-full justify-center drop-shadow-lg">
  <button
    class="grow"
    onclick={() => {
      setModeCurrent(true);
      setModeUserPrefers(true);
    }}
  >
    <div
      class={clsx(
        "card rounded-none justify-center p-2 text-center text-sm transition-all relative rounded-tl-token rounded-bl-token",
        {
          "variant-filled-primary text-white": $modeCurrent === true,
          "variant-soft-primary text-primary-500": $modeCurrent !== true,
        }
      )}
    >
      <p>Light</p>
    </div>
  </button>
  <button
    class="grow"
    onclick={() => {
      setModeCurrent(false);
      setModeUserPrefers(false);
    }}
  >
    <div
      class={clsx(
        "card rounded-none justify-center p-2 text-center text-sm transition-all relative rounded-tr-token rounded-br-token",
        {
          "variant-filled-primary text-white": $modeCurrent === false,
          "variant-soft-primary text-primary-500": $modeCurrent !== false,
        }
      )}
    >
      <p>Dark</p>
    </div>
  </button>
</div>
