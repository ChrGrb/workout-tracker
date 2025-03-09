<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";

  interface Props {
    items: {
      value: string;
      label: string;
    }[];
    name: string;
    required?: boolean;
    value?: string | null;
    label?: string;
  }

  let {
    items,
    name,
    required = false,
    value = $bindable(null),
    label = "",
  }: Props = $props();
</script>

<div class="flex flex-col gap-3">
  <p class="label">{label}</p>

  <Select.Root
    type="single"
    {name}
    bind:value={() => value ?? undefined, (v) => (value = v ?? null)}
    {required}
  >
    <Select.Trigger class="w-full">
      {value
        ? (items.find((item) => item.value === value)?.label ?? label)
        : label}
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {#each items as item}
          <Select.Item value={item.value} label={item.label}
            >{item.label}</Select.Item
          >
        {/each}
      </Select.Group>
    </Select.Content>
  </Select.Root>
  Copy
</div>
