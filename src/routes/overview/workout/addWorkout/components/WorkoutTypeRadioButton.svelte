<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";

  export let name: string;
  export let id: string;
  export let required = false;
  export let group = "";
</script>

<div>
  <input
    id={name}
    name="workout-type-id"
    value={id}
    type="radio"
    class="hidden peer"
    bind:group
    {required}
  />
  <label
    for={name}
    class="card flex flex-col justify-center p-4 aspect-square text-center variant-ringed-primary peer-checked:variant-filled-primary"
  >
    <Headline style="small">{name}</Headline>
  </label>
</div>
