<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import type { WorkoutSession } from "@prisma/client";
  import { CheckIcon, EditIcon } from "svelte-feather-icons";

  interface Props {
    workoutSession: WorkoutSession;
    updateSessionNameAction: () => void;
  }

  let { workoutSession = $bindable(), updateSessionNameAction }: Props = $props();

  let isEditMode = $state(false);
  let isLoading = false;
</script>

{#if !isEditMode}
  <div class="flex flex-row gap-4 items-center h-10">
    <Headline style="medium">{workoutSession.name}</Headline>
    <Button
      action={() => (isEditMode = true)}
      type="button"
      icon={true}
      classes="transition-all drop-shadow-none w-auto"
    >
      <EditIcon size="18" />
    </Button>
  </div>
{:else}
  <div class="flex flex-row gap-4 items-center">
    <TextInput
      type="text"
      id="sessionName"
      name="sessionName"
      inputClasses="h4"
      bind:input={workoutSession.name}
    />
    <Button
      icon={true}
      {isLoading}
      action={() => {
        updateSessionNameAction();
        isEditMode = false;
      }}
      classes="transition-all drop-shadow-none w-auto"
    >
      <CheckIcon size="24" />
    </Button>
  </div>
{/if}
