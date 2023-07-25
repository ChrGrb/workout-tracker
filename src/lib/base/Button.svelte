<script lang="ts">
  import clsx from "clsx";

  export let action: () => void = () => {};
  export let type: "button" | "submit" | "reset" | null | undefined = "button";
  export let icon = false;
  export let highlight = false;
  export let classes = "";
  export let disabled = false;
</script>

<button
  class={clsx(classes, "variant-filled-primary", {
    "btn-icon bg-transparent text-inherit": icon,
    btn: !icon,
    "variant-filled-secondary": highlight,
  })}
  on:click={action}
  {disabled}
  {type}
>
  <slot />
</button>
