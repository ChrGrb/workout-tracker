<script lang="ts">
  interface Props {
    label: string;
    name: string | null | undefined;
    id: string | null | undefined;
  }

  let { label, name, id }: Props = $props();
</script>

<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer" {id} {name} />
  <div
    class="w-11 h-6 bg-surface-400 dark:bg-surface-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-surface-900"
></div>
  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
    >{label}</span
  >
</label>
