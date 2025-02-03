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
    label = ""
  }: Props = $props();
</script>

<div class="flex flex-col gap-3">
  <p class="label">{label}</p>

  <div
    class="flex flex-row w-full gap-1 justify-center p-1 variant-soft-primary rounded-token"
  >
    {#each items as item, index (item.value)}
      <div class="grow">
        <input
          id={item.name}
          {name}
          value={item.value}
          type="radio"
          class="hidden peer"
          bind:group
          {required}
        />
        <label
          for={item.name}
          class={clsx(
            "justify-center p-2 text-center text-black/50 text-sm drop-shadow-none border-none rounded-token bg-transparent peer-checked:bg-black text-primary-700 peer-checked:text-white transition-all relative"
          )}
        >
          <p>{item.name}</p>
        </label>
      </div>
    {/each}
  </div>
</div>
