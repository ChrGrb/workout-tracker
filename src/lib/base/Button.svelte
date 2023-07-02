<script lang="ts">
  export let action: () => void = () => {};
  export let type: "button" | "submit" | "reset" | null | undefined = "button";
  export let icon = false;
</script>

<button
  class={!icon ? "bg-slate-800 text-white text-bold p-4 rounded-md" : ""}
  on:click={action}
  {type}><slot /></button
>
