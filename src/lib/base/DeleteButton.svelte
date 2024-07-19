<script lang="ts">
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";
  import { Trash2Icon } from "svelte-feather-icons";
  import Button from "./Button.svelte";
  import clsx from "clsx";
  import { getModalStore } from "@skeletonlabs/skeleton";

  let isLoading = false;
  export let form: HTMLFormElement;
  export let toDeleteName: string;
  export let classes = "";

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
  icon={$$slots.title ? false : true}
  loadingOnClick={true}
  bind:isLoading
>
  <div class="flex flex-row gap-4 justify-center items-center">
    <slot name="title" />
    <Trash2Icon size="18" />
  </div>
</Button>
