<script lang="ts">
  import clsx from "clsx";

  interface Props {
    items: {
      name: string;
      value: string;
    }[];
    name: string;
    required?: boolean;
    group?: string;
    label?: string;
  }

  let {
    items,
    name,
    required = false,
    group = $bindable(""),
    label = "",
  }: Props = $props();

  // Drives the sliding pill. Falls back to the first segment when the bound
  // value doesn't (yet) match any item.
  let selectedIndex = $derived(
    Math.max(
      0,
      items.findIndex((item) => item.value === group),
    ),
  );
</script>

<div class="flex flex-col gap-3">
  {#if label}
    <p class="label">{label}</p>
  {/if}

  <!--
    iOS-style segmented control: a recessed track with a single raised pill that
    slides between segments. The pill is positioned once per segment and moved
    with a transform so the transition is a smooth spring, matching the native
    UISegmentedControl behaviour rather than snapping the background per option.
  -->
  <div
    class="relative flex w-full rounded-[11px] bg-black/[0.06] p-[3px] dark:bg-white/[0.08]"
  >
    <div
      class="pointer-events-none absolute inset-y-[3px] left-[3px] rounded-[9px] bg-background shadow-[0_1px_3px_rgba(0,0,0,0.14),0_1px_1px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] dark:bg-white/[0.16] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] dark:ring-white/10"
      style="width: calc((100% - 6px) / {items.length}); transform: translateX(calc({selectedIndex} * 100%));"
    ></div>

    {#each items as item, i (item.value)}
      <label
        class={clsx(
          "relative z-10 flex flex-1 cursor-pointer items-center justify-center rounded-[9px] px-3 py-1.5 text-sm transition-colors duration-200 select-none",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40",
          selectedIndex === i
            ? "font-semibold text-foreground"
            : "font-medium text-muted-foreground",
        )}
      >
        <input
          {name}
          value={item.value}
          type="radio"
          class="sr-only"
          bind:group
          {required}
        />
        {item.name}
      </label>
    {/each}
  </div>
</div>
