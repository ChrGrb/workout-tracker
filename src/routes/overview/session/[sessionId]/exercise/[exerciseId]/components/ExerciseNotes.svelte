<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import * as Drawer from "$lib/components/ui/drawer";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import { Edit } from "lucide-svelte";
  import { InfoIcon } from "svelte-feather-icons";
  import updateExerciseNotesAction from "../actions/updateExerciseNotesAction";

  interface Props {
    exercise: ExerciseFull;
    // Whether the type is linked to the user. Unlinked (deleted) types still
    // show on old exercises, but the server rejects edits to them.
    canEditTypeNotes: boolean;
  }

  let { exercise, canEditTypeNotes }: Props = $props();

  let open = $state(false);
  let notes = $state("");
  let typeNotes = $state("");

  const exerciseNotes = $derived(exercise.notes?.trim() ?? "");
  const exerciseTypeNotes = $derived(exercise.type.description?.trim() ?? "");

  // Pre-fill the inputs with the current notes each time the drawer opens.
  $effect(() => {
    if (open) {
      notes = exercise.notes ?? "";
      typeNotes = exercise.type.description ?? "";
    }
  });
</script>

{#snippet note(label: string, text: string)}
  <div class="flex flex-col gap-2">
    <div class="flex flex-row justify-start items-center gap-2">
      <InfoIcon size="18" />
      <p class="font-semibold">{label}</p>
    </div>
    <p class="break-all whitespace-pre-line">{text}</p>
  </div>
{/snippet}

<Drawer.Root bind:open>
  <div class="flex flex-col gap-4 w-full">
    {#if exerciseTypeNotes}
      {@render note(`Every ${exercise.type.name}`, exerciseTypeNotes)}
    {/if}
    {#if exerciseNotes}
      {@render note("This workout", exerciseNotes)}
    {/if}

    <Drawer.Trigger class="self-start flex flex-row items-center gap-2 text-sm">
      <Edit size="16" />
      {exerciseNotes || exerciseTypeNotes ? "Edit notes" : "Add note"}
    </Drawer.Trigger>
  </div>

  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 bg-black/40" />
    <Drawer.Content
      class="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[10px] max-h-[100dvh] overscroll-contain"
    >
      <Drawer.Header>
        <Drawer.Title>Notes</Drawer.Title>
      </Drawer.Header>

      <div class="max-w-md w-full mx-auto flex flex-col gap-4 p-4">
        <TextArea
          name="exerciseNotes"
          id="exerciseNotes"
          rows={3}
          label="This workout"
          placeholder="e.g. good form today"
          bind:input={notes}
        />
        {#if canEditTypeNotes}
          <TextArea
            name="typeNotes"
            id="typeNotes"
            rows={3}
            label={`Every ${exercise.type.name}`}
            placeholder="e.g. machine height 4"
            bind:input={typeNotes}
          />
        {/if}

        <Drawer.Footer class="px-0">
          <Drawer.Close class="w-full">
            <Button
              action={() =>
                updateExerciseNotesAction(exercise, {
                  notes,
                  typeNotes: canEditTypeNotes ? typeNotes : undefined,
                })}
              highlight={true}
              classes="w-full"
            >
              Save
            </Button>
          </Drawer.Close>
        </Drawer.Footer>
      </div>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
