<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import { getZ } from "$lib/zero/z.svelte";
  import { queries } from "$lib/zero/queries";
  import { useUserId } from "$lib/stores/stores";
  import createEquipmentAction from "../../../routes/overview/session/[sessionId]/addExercise/actions/createEquipmentAction";
  import updateEquipmentAction from "../../../routes/overview/session/[sessionId]/addExercise/actions/updateEquipmentAction";
  import deleteEquipmentAction from "../../../routes/overview/session/[sessionId]/addExercise/actions/deleteEquipmentAction";
  import { Edit2Icon, Trash2Icon, CheckIcon, XIcon } from "svelte-feather-icons";

  interface Props {
    onAdded?: (id: string) => void;
    onClose?: () => void;
  }

  let { onAdded, onClose }: Props = $props();

  const userId = useUserId();

  type EquipmentRow = { id: string; name: string };

  let equipment = $state<EquipmentRow[]>([]);
  const equipmentQuery = getZ().createQuery(queries.equipment());
  $effect(() => {
    equipment = (equipmentQuery.data ?? []) as EquipmentRow[];
  });

  let newName = $state("");
  let editingId = $state<string | null>(null);
  let editingName = $state("");
  let confirmingId = $state<string | null>(null);

  function add() {
    const name = newName.trim();
    if (!name || !$userId) return;
    const id = createEquipmentAction($userId, name);
    newName = "";
    onAdded?.(id);
  }

  function startEdit(item: EquipmentRow) {
    editingId = item.id;
    editingName = item.name;
    confirmingId = null;
  }

  function saveEdit() {
    const name = editingName.trim();
    if (name && editingId) updateEquipmentAction(editingId, name);
    editingId = null;
  }

  function remove(id: string) {
    if ($userId) deleteEquipmentAction($userId, id);
    confirmingId = null;
  }
</script>

<div class="max-w-md w-full mx-auto flex flex-col gap-4 p-4">
  <Headline style="small">Equipment</Headline>

  <div class="flex flex-row items-end gap-2">
    <div class="grow">
      <TextInput
        type="text"
        name="new-equipment"
        id="new-equipment"
        label="Name"
        bind:input={newName}
      />
    </div>
    <Button action={add} disabled={newName.trim().length === 0}>Add</Button>
  </div>

  <div class="flex flex-col gap-2 max-h-64 overflow-y-auto">
    {#each equipment as item (item.id)}
      <div class="flex flex-row items-center gap-2">
        {#if editingId === item.id}
          <div class="grow">
            <TextInput
              type="text"
              name="edit-equipment"
              id={"edit-" + item.id}
              bind:input={editingName}
            />
          </div>
          <Button action={saveEdit} icon={true}><CheckIcon size="20" /></Button>
          <Button action={() => (editingId = null)} icon={true}>
            <XIcon size="20" />
          </Button>
        {:else if confirmingId === item.id}
          <span class="grow text-sm">Delete "{item.name}"?</span>
          <Button action={() => remove(item.id)}>Delete</Button>
          <Button action={() => (confirmingId = null)} icon={true}>
            <XIcon size="20" />
          </Button>
        {:else}
          <span class="grow">{item.name}</span>
          <Button action={() => startEdit(item)} icon={true}>
            <Edit2Icon size="18" />
          </Button>
          <Button action={() => (confirmingId = item.id)} icon={true}>
            <Trash2Icon size="18" />
          </Button>
        {/if}
      </div>
    {/each}
    {#if equipment.length === 0}
      <p class="text-sm opacity-60">No equipment yet.</p>
    {/if}
  </div>

  <div class="flex justify-end">
    <Button action={() => onClose?.()}>Close</Button>
  </div>
</div>
