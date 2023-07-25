
import {
  type ModalComponent,
  type ModalSettings,
  modalStore,
} from "@skeletonlabs/skeleton";
import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";

const modalComponent: ModalComponent = {
  ref: ConfirmDeleteModal,
  props: {},
};

export function confirmDelete(form: HTMLFormElement, toDeleteName: string): void {
  const modal: ModalSettings = {
    type: "component",
    title: "Confirm delete",
    body: "Are you sure you want to delete the " + toDeleteName + "?",
    component: modalComponent,
    response: (response: boolean) => {
      if (response) {
        form.requestSubmit();
      }
    },
  };
  modalStore.trigger(modal);
}
