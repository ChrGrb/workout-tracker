<script lang="ts">
  import clsx from "clsx";
  import { AlertTriangleIcon } from "svelte-feather-icons";
  import { sineInOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  interface Props {
    label?: string;
    type: string;
    name: string | null | undefined;
    id: string | null | undefined;
    required?: boolean;
    input?: string;
    step?: number;
    metric?: string;
    inputClasses?: string;
  }

  let {
    label = "",
    type,
    name,
    id,
    required = false,
    input = $bindable(""),
    step = 1,
    metric = "",
    inputClasses = ""
  }: Props = $props();

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }

  let showRequiredIndicator = $derived(required && !(input !== ""));
</script>

<div class="w-full">
  {#if label.length > 0}
    <label for="reps" class="label">{label}</label>
  {/if}
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
