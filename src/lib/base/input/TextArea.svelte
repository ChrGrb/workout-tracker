<script lang="ts">
  export let label: string;
  export let name: string | null | undefined;
  export let id: string | null | undefined;
  export let required = false;
  export let input = "";
  export let rows = 2;
  export let placeholder = "";
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
    />
  </div>
</div>
