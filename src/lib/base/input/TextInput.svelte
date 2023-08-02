<script lang="ts">
  import clsx from "clsx";
  import { AlertTriangleIcon } from "svelte-feather-icons";
  import { sineInOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  export let label: string;
  export let type: string;
  export let name: string | null | undefined;
  export let id: string | null | undefined;
  export let required: boolean = false;
  export let input: string = "";
  export let step = 1;
  export let metric = "";
  export let inputClasses = "";

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }

  $: showRequiredIndicator = required && !(input !== "");
</script>

<div class="sm:col-span-4">
  <label for="reps" class="label">{label}</label>
  <div class="mt-2 relative">
    <input
      use:typeAction
      {name}
      {id}
      {required}
      bind:value={input}
      {step}
      class={"input block py-1 px-2 " + inputClasses}
    />
    {#if metric}
      <div
        class={clsx(
          "absolute top-0 bottom-0 flex items-center text-surface-500",
          {
            "right-14": showRequiredIndicator,
            "right-3.5": !showRequiredIndicator,
          }
        )}
      >
        {metric}
      </div>
    {/if}
    {#if showRequiredIndicator}
      <div
        transition:fade={{ duration: 100, easing: sineInOut }}
        class="absolute right-0 top-0 bottom-0 bg-primary-500 rounded-tr-token rounded-br-token flex flex-row justify-center items-center p-3 pr-3.5 text-white"
      >
        <AlertTriangleIcon size="14" />
      </div>
    {/if}
  </div>
</div>
