<script lang="ts">
  import clsx from "clsx";

  export let action: () => void = () => {};
  export let type: "button" | "submit" | "reset" | null | undefined = "button";
  export let icon = false;
  export let highlight = false;
  export let classes = "";
</script>

<button
  class={clsx(classes, "variant-filled", {
    "btn-icon": icon,
    btn: !icon,
    "variant-filled-primary": highlight,
  })}
  on:click={action}
  {type}><slot /></button
>
