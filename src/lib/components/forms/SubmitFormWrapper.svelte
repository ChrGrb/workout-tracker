<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";

  export let isLoading = false;
  export let isButtonDisabled = false;
  export let action = "";
  export let form: HTMLFormElement | null = null;
  export let formClasses = "";
</script>

<form
  method="POST"
  class={formClasses}
  {action}
  use:enhance={() => {
    isLoading = true;
  }}
  bind:this={form}
>
  <div class="flex flex-col gap-8">
    <slot name="form-content" />

    <slot name="button">
      <Button
        type="submit"
        disabled={isButtonDisabled}
        highlight={true}
        {isLoading}
      >
        <slot name="button-content">Add</slot>
      </Button>
    </slot>
  </div>
</form>
