<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import type { WorkoutSession } from "@prisma/client";
  import { CheckIcon, EditIcon } from "svelte-feather-icons";

  export let workoutSession: WorkoutSession;

  let isEditMode = false;
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
  <SubmitFormWrapper action="?/updateCurrentSessionName">
    <svelte:fragment slot="form-content">
      <div class="flex flex-row gap-4 items-end">
        <TextInput
          type="text"
          id="sessionName"
          name="sessionName"
          input={workoutSession.name}
        />
        <input
          type="text"
          name="sessionId"
          value={workoutSession.id}
          class="hidden"
        />
        <Button
          type="submit"
          icon={true}
          classes="transition-all drop-shadow-none w-auto pb-1.5"
        >
          <CheckIcon size="18" />
        </Button>
      </div>
    </svelte:fragment>
    <svelte:fragment slot="button" />
  </SubmitFormWrapper>
{/if}
