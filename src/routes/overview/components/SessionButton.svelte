<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";

  export let sessionId: string;
  export let buttonDisabled: boolean = false;
  export let formAction: string;
  export let classes = "";
  export let form = document.createElement("form");
  export let buttonAction: (() => void) | undefined = undefined;
  export let buttonClasses = "";
  export let buttonIcon = false;
  export let highlight = false;

  export let isLoading = false;
</script>

<SubmitFormWrapper
  action={formAction}
  formClasses={classes}
  bind:form
  bind:isLoading
>
  <input
    type="text"
    name="sessionId"
    value={sessionId}
    class="hidden"
    slot="form-content"
  />
  <Button
    type={buttonAction === undefined ? "submit" : "button"}
    {highlight}
    classes={buttonClasses}
    disabled={buttonDisabled}
    action={buttonAction}
    icon={buttonIcon}
    {isLoading}
    slot="button"
  >
    <div class="flex flex-row gap-4 justify-center items-center">
      <slot />
    </div>
  </Button>
</SubmitFormWrapper>
