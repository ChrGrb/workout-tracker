<script lang="ts">
  export let label: string;
  export let type: string | null | undefined;
  export let name: string | null | undefined;
  export let id: string | null | undefined;
</script>

<div class="sm:col-span-4">
  <label for="reps" class="label">{label}</label>
  <div class="mt-2">
    <input {type} {name} {id} class="input block" />
  </div>
</div>
