<script lang="ts">
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
  import { Trash2Icon } from "svelte-feather-icons";
  import Button from "./Button.svelte";
  import clsx from "clsx";
  import { getModalStore } from "@skeletonlabs/skeleton";

  let isLoading = $state(false);
  interface Props {
    form: HTMLFormElement;
    toDeleteName: string;
    classes?: string;
    title?: import('svelte').Snippet;
  }

  let {
    form,
    toDeleteName,
    classes = "",
    title
  }: Props = $props();

  const modalStore = getModalStore();
</script>

<Button
  action={() =>
    confirmDelete(modalStore, form, toDeleteName, () => {
      isLoading = false;
    })}
  classes={clsx(classes, {
    "btn !bg-transparent text-inherit transition-all drop-shadow-none":
      classes.length === 0,
  })}
  icon={title ? false : true}
  loadingOnClick={true}
  bind:isLoading
>
  <div class="flex flex-row gap-4 justify-center items-center">
    {@render title?.()}
    <Trash2Icon size="18" />
  </div>
</Button>
