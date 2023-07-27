<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";

  export let sessionId: string;
  export let buttonDisabled: boolean = false;
  export let formAction: string;
  export let classes = "";
  export let form = document.createElement("form");
  export let buttonAction: (() => void) | null = null;
  export let buttonClasses = "";
  export let buttonIcon = false;
</script>

<form
  method="POST"
  action={formAction}
  class={classes}
  use:enhance
  bind:this={form}
>
  <input type="text" name="sessionId" value={sessionId} class="hidden" />
  <Button
    type={buttonAction === null ? "submit" : "button"}
    classes={buttonClasses}
    disabled={buttonDisabled}
    action={buttonAction !== null ? buttonAction : () => {}}
    icon={buttonIcon}
  >
    <div class="flex flex-row gap-4 justify-center items-center">
      <slot />
    </div>
  </Button>
</form>
