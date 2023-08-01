<script lang="ts">
  import clsx from "clsx";

  export let items: {
    name: string;
    value: string;
  }[];

  export let name: string;
  export let id: string;
  export let required = false;
  export let group = "";
  export let label = "";
</script>

<div class="flex flex-col gap-3">
  <p class="label">{label}</p>

  <div class="flex flex-row w-full justify-center">
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
            "card rounded-none justify-center p-2 text-center text-sm variant-soft-primary peer-checked:variant-filled-primary text-primary-700 peer-checked:text-white transition-all relative",
            {
              "rounded-tl-token rounded-bl-token": index === 0,
              "rounded-tr-token rounded-br-token": index === items.length - 1,
            }
          )}
        >
          <p>{item.name}</p>
        </label>
      </div>
    {/each}
  </div>
</div>
