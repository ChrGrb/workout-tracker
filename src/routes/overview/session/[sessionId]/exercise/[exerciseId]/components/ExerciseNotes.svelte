<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import * as Drawer from "$lib/components/ui/drawer";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import { buttonVariants } from "$lib/components/ui/button";
  import { Info, Pencil, Plus } from "lucide-svelte";
  import { z } from "zod";
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import updateExerciseNotesAction from "../actions/updateExerciseNotesAction";
  import clsx from "clsx";

  interface Props {
    exercise: ExerciseFull;
    // Whether the type is linked to the user. Unlinked (deleted) types still
    // show on old exercises, but the server rejects edits to them.
    canEditTypeNotes: boolean;
  }

  let { exercise, canEditTypeNotes }: Props = $props();

  let open = $state(false);

  const typeNotesText = $derived(exercise.type.description?.trim() ?? "");

  const schema = z.object({ typeNotes: z.string().default("") });

  const superform = superForm(defaults(zod4(schema)), {
    SPA: true,
    validators: zod4(schema),
    resetForm: false,
    onUpdate({ form }) {
      if (!form.valid) return;
      updateExerciseNotesAction(exercise, { typeNotes: form.data.typeNotes });
    },
  });

  const { form, enhance, reset } = superform;

  // Pre-fill with the current note each time the drawer opens.
  $effect(() => {
    if (open) {
      reset({ newState: { typeNotes: exercise.type.description ?? "" } });
    }
  });
</script>

<Drawer.Root bind:open>
  {#if typeNotesText}
    <div class="card p-4 w-full flex flex-col gap-2">
      <div class="flex flex-row items-center justify-between gap-2">
        <div class="flex flex-row items-center gap-1">
          <Info size="18" />
          <p class="font-semibold">Notes</p>
        </div>
        {#if canEditTypeNotes}
          <Drawer.Trigger
            class={clsx(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-5 w-5",
            )}
            aria-label="Edit note"
          >
            <Pencil />
          </Drawer.Trigger>
        {/if}
      </div>
      <p class="break-all whitespace-pre-line">{typeNotesText}</p>
    </div>
  {:else if canEditTypeNotes}
    <Drawer.Trigger
      class={buttonVariants({ variant: "secondary", size: "sm" })}
    >
      <Plus />
      Add note
    </Drawer.Trigger>
  {/if}

  <Drawer.Portal>
    <Drawer.Overlay class="fixed inset-0 bg-black/40" />
    <Drawer.Content
      class="bg-white flex flex-col fixed bottom-0 left-0 right-0 rounded-t-[10px] max-h-[100dvh] overscroll-contain"
    >
      <Drawer.Header>
        <Drawer.Title>Notes</Drawer.Title>
      </Drawer.Header>

      <form
        method="POST"
        use:enhance
        class="max-w-md w-full mx-auto flex flex-col gap-4 p-4"
      >
        <TextArea
          name="typeNotes"
          id="typeNotes"
          rows={3}
          label={`Every ${exercise.type.name}`}
          placeholder="e.g. machine height 4"
          bind:input={$form.typeNotes}
        />

        <Drawer.Footer class="px-0">
          <Drawer.Close class="w-full">
            <Button type="submit" highlight={true} classes="w-full">
              Save
            </Button>
          </Drawer.Close>
        </Drawer.Footer>
      </form>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
