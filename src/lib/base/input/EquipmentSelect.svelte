<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Drawer from "$lib/components/ui/drawer";
  import { getZ } from "$lib/zero/z.svelte";
  import { queries } from "$lib/zero/queries";
  import EquipmentManager from "$lib/base/input/EquipmentManager.svelte";
  import { Plus } from "lucide-svelte";

  interface Props {
    value?: string | null;
    label?: string;
    name?: string;
  }

  let {
    value = $bindable(null),
    label = "Equipment",
    name = "equipment",
  }: Props = $props();

  // Sentinel for the "no equipment" choice (bits-ui Select needs a string value).
  const NONE = "__none__";

  type EquipmentRow = { id: string; name: string };

  let equipment = $state<EquipmentRow[]>([]);
  const equipmentQuery = getZ().createQuery(queries.equipment());
  $effect(() => {
    equipment = (equipmentQuery.data ?? []) as EquipmentRow[];
  });

  let open = $state(false);
  // The manager is a NESTED drawer (not a modal): a modal renders outside the
  // parent drawer, which vaul makes inert, so its controls can't be clicked.
  let managerOpen = $state(false);

  function openManager() {
    open = false;
    managerOpen = true;
  }

  let selectedLabel = $derived(
    value ? (equipment.find((e) => e.id === value)?.name ?? label) : "None",
  );
</script>

<div class="flex flex-col gap-3">
  <p class="label">{label}</p>

  <Select.Root
    type="single"
    {name}
    bind:open
    bind:value={
      () => value ?? NONE, (v) => (value = v === NONE ? null : (v ?? null))
    }
  >
    <Select.Trigger class="w-full">{selectedLabel}</Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Item value={NONE} label="None">None</Select.Item>
        {#each equipment as item (item.id)}
          <Select.Item value={item.id} label={item.name}>{item.name}</Select.Item
          >
        {/each}
      </Select.Group>
      <Select.Separator />
      <button
        type="button"
        onclick={openManager}
        class="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-black/10"
      >
        <Plus class="h-4 w-4" /> Add equipment
      </button>
    </Select.Content>
  </Select.Root>
</div>

<Drawer.NestedRoot bind:open={managerOpen}>
  <Drawer.Content
    class="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96vh] rounded-t-[10px]"
  >
    <EquipmentManager
      onAdded={(id) => {
        value = id;
        managerOpen = false;
      }}
      onClose={() => (managerOpen = false)}
    />
  </Drawer.Content>
</Drawer.NestedRoot>
