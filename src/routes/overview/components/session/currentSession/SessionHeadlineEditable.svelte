<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import type { WorkoutSession } from "@prisma/client";
  import { CheckIcon, EditIcon } from "svelte-feather-icons";

  export let workoutSession: WorkoutSession;
  export let updateSessionNameAction: () => void;

  let isEditMode = false;
  let isLoading = false;
</script>

{#if !isEditMode}
  <div class="flex flex-row gap-4 items-end h-10">
    <Headline style="medium">{workoutSession.name}</Headline>
    <Button
      action={() => (isEditMode = true)}
      type="button"
      icon={true}
      classes="transition-all drop-shadow-none w-auto pb-1.5"
    >
      <EditIcon size="18" />
    </Button>
  </div>
{:else}
  <div class="flex flex-row gap-4 items-end">
    <TextInput
      type="text"
      id="sessionName"
      name="sessionName"
      bind:input={workoutSession.name}
    />
    <Button
      icon={true}
      {isLoading}
      action={() => {
        updateSessionNameAction();
        isEditMode = false;
      }}
      classes="transition-all drop-shadow-none w-auto pb-1.5"
    >
      <CheckIcon size="18" />
    </Button>
  </div>
{/if}
