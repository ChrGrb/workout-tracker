<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Container from "$lib/base/Container.svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";

  export let isLoading = false;
  export let isButtonDisabled = false;
  export let action = "";
  export let form: HTMLFormElement | null = null;
  export let formClasses = "";
  export let formCallbackFunction: ((result: any) => void) | null = null;
  export let resetOnSubmit = true;
  export let floatingSubmitbutton = true;
</script>

<form
  method="POST"
  class={formClasses}
  {action}
  use:enhance={() => {
    isLoading = true;

    return async ({ result, update }) => {
      await update({ reset: resetOnSubmit });
      isLoading = false;
      if (formCallbackFunction) {
        formCallbackFunction(result);
      }
    };
  }}
  bind:this={form}
>
  <div class="flex flex-col gap-8">
    <slot name="form-content" />

    <slot name="button">
      {#if floatingSubmitbutton}
        <FloatBottomWrapper>
          <Container>
            <div class="w-full">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                highlight={true}
                {isLoading}
                classes="w-full"
              >
                <slot name="button-content">Add</slot>
              </Button>
            </div>
          </Container>
        </FloatBottomWrapper>
      {:else}
        <div class="w-full">
          <Button
            type="submit"
            disabled={isButtonDisabled}
            highlight={true}
            {isLoading}
            classes="w-full"
          >
            <slot name="button-content">Add</slot>
          </Button>
        </div>
      {/if}
    </slot>
  </div>
</form>
