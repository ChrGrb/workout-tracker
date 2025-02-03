<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";


  interface Props {
    sessionId: string;
    buttonDisabled?: boolean;
    formAction: string;
    classes?: string;
    form?: any;
    buttonAction?: (() => void) | undefined;
    buttonClasses?: string;
    buttonIcon?: boolean;
    highlight?: boolean;
    isLoading?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    sessionId,
    buttonDisabled = false,
    formAction,
    classes = "",
    form = $bindable(document.createElement("form")),
    buttonAction = undefined,
    buttonClasses = "",
    buttonIcon = false,
    highlight = false,
    isLoading = $bindable(false),
    children
  }: Props = $props();
</script>

<SubmitFormWrapper
  action={formAction}
  formClasses={classes}
  bind:form
  bind:isLoading
>
  <!-- @migration-task: migrate this slot by hand, `form-content` is an invalid identifier -->
  <input
    type="text"
    name="sessionId"
    value={sessionId}
    class="hidden"
    slot="form-content"
  />
  {#snippet button()}
    <Button
      type={buttonAction === undefined ? "submit" : "button"}
      {highlight}
      classes={buttonClasses}
      disabled={buttonDisabled}
      action={buttonAction}
      icon={buttonIcon}
      {isLoading}
      
    >
      <div class="flex flex-row gap-4 justify-center items-center">
        {@render children?.()}
      </div>
    </Button>
  {/snippet}
</SubmitFormWrapper>
