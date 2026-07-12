<script lang="ts">
  // Test stub for ExerciseTypeRadioButton — renders the type name and a radio
  // bound to `group` so selection (and the Add button enabling) can be tested,
  // without the real component's Skeleton modal-store dependency.
  interface Props {
    group?: string;
    exerciseType: { id: string; name: string };
  }
  // The real component also takes `required` / `onEditClicked`; the stub ignores
  // them (Svelte silently drops undeclared props).
  let { group = $bindable(""), exerciseType }: Props = $props();
</script>

<label>
  <input type="radio" name="etype" value={exerciseType.id} bind:group />
  {exerciseType.name}
</label>
