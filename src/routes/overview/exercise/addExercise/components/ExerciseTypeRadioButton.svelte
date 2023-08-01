<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import { Trash2Icon } from "svelte-feather-icons";
  import { confirmDelete } from "$lib/modals/ConfirmDeleteModalWrapper";

  export let name: string;
  export let id: string;
  export let required = false;
  export let group = "";
  export let userId: string;

  let form: HTMLFormElement;
</script>

<div>
  <input
    id={name}
    name="exercise-type-id"
    value={id}
    type="radio"
    class="hidden peer"
    bind:group
    {required}
  />
  <label
    for={name}
    class="card flex flex-col justify-center p-4 aspect-square text-center variant-soft-primary peer-checked:variant-filled-primary text-primary-700 peer-checked:text-white transition-all relative"
  >
    <Headline style="small">{name}</Headline>

    <form
      method="POST"
      action="?/deleteExerciseType"
      class="absolute top-2 right-2"
      use:enhance
      bind:this={form}
    >
      <input type="text" name="exerciseTypeId" value={id} class="hidden" />
      <input type="text" name="userId" value={userId} class="hidden" />
      <Button
        action={() => confirmDelete(form, "exercise type")}
        classes="variant-soft-error bg-transparent text-inherit transition-all"
        icon={true}
      >
        <div class="flex flex-row gap-4 justify-center items-center">
          <Trash2Icon size="18" />
        </div>
      </Button>
    </form>
  </label>
</div>
