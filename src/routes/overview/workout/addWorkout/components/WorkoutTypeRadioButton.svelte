<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";

  export let name: string;
  export let id: number;
  export let isSelected: boolean;
</script>

<div>
  <input
    id={name}
    name="workout-type-id"
    value={id}
    type="radio"
    class="hidden peer"
    required
  />
  <label
    for={name}
    class="flex flex-col justify-center rounded-md p-4 aspect-square text-white text-center peer-checked:bg-slate-700 bg-slate-400"
  >
    <Headline style="small">{name}</Headline>
  </label>
</div>
