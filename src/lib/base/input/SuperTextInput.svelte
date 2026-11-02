<script lang="ts" generics="T extends Record<string, unknown>">
  import clsx from "clsx";
  import { AlertTriangleIcon } from "svelte-feather-icons";
  import { sineInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import type { HTMLInputAttributes } from "svelte/elements";
  import {
    formFieldProxy,
    type FormPathLeaves,
    type SuperForm,
  } from "sveltekit-superforms";

  type Props = {
    label?: string;
    type: string;
    field: FormPathLeaves<T>;
    superform: SuperForm<T>;
    metric?: string;
    inputClasses?: string;
    showUntouchedErrors?: boolean;
  } & HTMLInputAttributes;

  let {
    label = "",
    type,
    field,
    superform,
    metric = "",
    inputClasses = "",
    showUntouchedErrors = false,
    ...restProps
  }: Props = $props();

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }

  let { value, errors, constraints, tainted } = formFieldProxy(
    superform,
    field,
  );

  let showRequiredIndicator = $derived(
    !!$errors && (!!$tainted || showUntouchedErrors),
  );
</script>

<div class="w-full">
  {#if label.length > 0}
    <label for={restProps.id} class="label">{label}</label>
  {/if}

  <div class="mt-2 relative">
    <input
      use:typeAction
      bind:value={$value}
      aria-invalid={$errors ? "true" : undefined}
      class={clsx("input block py-1 px-2", inputClasses)}
      {...$constraints}
      {...restProps}
    />
    {#if metric}
      <div
        class={clsx(
          "absolute top-0 bottom-0 flex items-center text-surface-500",
          {
            "right-14": showRequiredIndicator,
            "right-3.5": !showRequiredIndicator,
          },
        )}
      >
        {metric}
      </div>
    {/if}

    {#if showRequiredIndicator}
      <div
        transition:fade={{ duration: 100, easing: sineInOut }}
        class="absolute right-0 top-0 bottom-0 bg-error-500 rounded-tr-token rounded-br-token flex flex-row justify-center items-center p-3 pr-3.5 text-white"
      >
        <AlertTriangleIcon size="14" />
      </div>
    {/if}
  </div>
  {#if showRequiredIndicator}
    <span class="text-sm text-error-500">{$errors?.[0]}</span>
  {/if}
</div>
