<script lang="ts">
  export let label: string;
  export let name: string | null | undefined;
  export let id: string | null | undefined;
</script>

<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer" {id} {name} />
  <div
    class="w-11 h-6 bg-surface-400 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-surface-900"
  />
  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
    >Warmup</span
  >
</label>

<!-- <div class="relative flex gap-x-3">
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
</div> -->
