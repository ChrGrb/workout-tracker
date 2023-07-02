<script lang="ts">
  export let label: string;
  export let name: string | null | undefined;
  export let id: string | null | undefined;
</script>

<div class="relative flex gap-x-3">
  <div class="flex h-6 items-center">
    <input
      {id}
      {name}
      type="checkbox"
      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
    />
  </div>
  <div class="text-sm leading-6">
    <label for={name} class="font-medium text-gray-900">{label}</label>
  </div>
</div>
