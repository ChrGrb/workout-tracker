<script lang="ts">
  interface Props {
    label: string;
    name: string | null | undefined;
    id: string | null | undefined;
    required?: boolean;
    input?: string;
    rows?: number;
    placeholder?: string;
  }

  let {
    label,
    name,
    id,
    required = false,
    input = $bindable(""),
    rows = 2,
    placeholder = ""
  }: Props = $props();
</script>

<div class="sm:col-span-4">
  <label for="reps" class="label">{label}</label>
  <div class="mt-2">
    <textarea
      {rows}
      {name}
      {id}
      {required}
      {placeholder}
      bind:value={input}
      class="input block py-1 px-2"
></textarea>
  </div>
</div>
