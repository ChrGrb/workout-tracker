<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";

  export let name: string;
  export let id: string;
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
    class="card flex flex-col justify-center p-4 aspect-square text-center variant-ringed-primary peer-checked:variant-filled-primary"
  >
    <Headline style="small">{name}</Headline>
  </label>
</div>
