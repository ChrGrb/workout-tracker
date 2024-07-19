import {
  type ModalComponent,
  type ModalSettings,
  type ModalStore,
} from "@skeletonlabs/skeleton";
import ConfirmDeleteModal from "./ConfirmDeleteModal.svelte";

const modalComponent: ModalComponent = {
  ref: ConfirmDeleteModal,
  props: {},
};

export function confirmDelete(
  modalStore: ModalStore,
  form: HTMLFormElement,
  toDeleteName: string,
  cancelAction: () => void
): void {
  const modal: ModalSettings = {
    type: "component",
    title: "Confirm delete",
    body: "Are you sure you want to delete the " + toDeleteName + "?",
    component: modalComponent,
    response: (response: boolean) => {
      if (response) {
        form.requestSubmit();
      } else {
        cancelAction();
      }
    },
  };
  modalStore.trigger(modal);
}

export function confirmDeleteWithAction(
  modalStore: ModalStore,
  action: () => void,
  toDeleteName: string,
  cancelAction: () => void
): void {
  const modal: ModalSettings = {
    type: "component",
    title: "Confirm delete",
    body: "Are you sure you want to delete the " + toDeleteName + "?",
    component: modalComponent,
    response: (response: boolean) => {
      if (response) {
        action();
      } else {
        cancelAction();
      }
    },
  };
  modalStore.trigger(modal);
}
