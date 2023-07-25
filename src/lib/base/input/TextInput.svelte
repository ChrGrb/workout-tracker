<script lang="ts">
  export let label: string;
  export let type: string;
  export let name: string | null | undefined;
  export let id: string | null | undefined;
  export let required: boolean = false;
  export let input: string = "";

  function typeAction(node: HTMLInputElement) {
    node.type = type;
  }
</script>

<div class="sm:col-span-4">
  <label for="reps" class="label">{label}</label>
  <div class="mt-2">
    <input
      use:typeAction
      {name}
      {id}
      {required}
      bind:value={input}
      class="input block py-1 px-2"
    />
  </div>
</div>
