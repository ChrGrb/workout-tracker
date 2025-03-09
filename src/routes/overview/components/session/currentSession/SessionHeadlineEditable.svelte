<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import type { WorkoutSessionFull } from "$lib/utils/prismaTypes";
  import { CheckIcon, EditIcon } from "svelte-feather-icons";

  interface Props {
    workoutSession: WorkoutSessionFull;
    updateSessionNameAction: () => void;
  }

  let { workoutSession = $bindable(), updateSessionNameAction }: Props =
    $props();

  let isEditMode = $state(false);
  let isLoading = false;

  const sessionAreas = $derived(
    [
      ...new Set(
        workoutSession.exercises.map((exercise) => exercise.type.area)
      ),
    ].filter(Boolean)
  );
</script>

{#if !isEditMode}
  <div class="flex flex-col gap-2">
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

    <div class="flex flex-row gap-2 items-start">
      {#each sessionAreas as area}
        <Badge variant="secondary">{area}</Badge>
      {/each}
    </div>
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
