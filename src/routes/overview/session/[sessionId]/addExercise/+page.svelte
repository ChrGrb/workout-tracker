<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { goto } from "$app/navigation";
  import ExerciseTypeRadioButton from "./components/ExerciseTypeRadioButton.svelte";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import AddCard from "$lib/components/AddCard.svelte";
  import Header from "$lib/base/Header.svelte";
  import Button from "$lib/base/Button.svelte";
  import addExerciseAction from "./actions/addExerciseAction";
  import {
    getReplicache,
    useForwardNavigation,
    useUserId,
  } from "$lib/stores/stores";
  import { getExercisePath } from "$lib/utils/routing/routes";
  import type { ExerciseType } from "@prisma/client";
  import { onMount } from "svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import Headline from "$lib/base/Headline.svelte";
  import * as Drawer from "$lib/components/ui/drawer";
  import AddExerciseTypeDrawer from "./components/AddExerciseTypeDrawer.svelte";
  import * as Select from "$lib/components/ui/select";

  export let data: PageData;

  let exerciseTypeSelection = "";

  $: selectedExerciseType = exerciseTypes
    .filter((exerciseType) => exerciseType.id === exerciseTypeSelection)
    .at(0);

  let exerciseTypeToEditId = "";
  $: selectedExerciseTypeToEdit = exerciseTypes
    .filter((exerciseType) => exerciseType.id === exerciseTypeToEditId)
    .at(0);

  $: isInvalid = exerciseTypeSelection.length === 0;

  let userId = useUserId();
  let exerciseTypes: ExerciseType[] = [];

  let addOpen = false;
  let editMode = false;

  enum SortType {
    createdAt = "Created at",
    name = "Name",
  }

  let sortType: SortType = SortType.name;

  $: sortTypeSelection = sortType
    ? {
        label: sortType.toString(),
        value: sortType,
      }
    : undefined;

  onMount(() => {
    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (
          await tx.scan({
            prefix: `user/${$userId}/exerciseType`,
          })
        ).toArray(),
      {
        onData: (data) => {
          try {
            exerciseTypes = data.map((element) =>
              JSON.parse(element!.toString())
            ) as ExerciseType[];
            exerciseTypes = filterDeleted(exerciseTypes);
            console.log(
              "exerciseTypes",
              exerciseTypes
                .map((e) =>
                  JSON.stringify({
                    name: e.name,
                    id: e.id,
                    isDeleted: e.isDeleted,
                  })
                )
                .join("\n")
            );
          } catch {}
        },
      }
    );
  });

  $: sortedExerciseTypes = exerciseTypes.sort((a, b) => {
    if (sortType === SortType.createdAt) {
      return (b.versionUpdatedAt ?? 0) - (a.versionUpdatedAt ?? 0);
    } else if (sortType === SortType.name) {
      return a.name.localeCompare(b.name);
    }

    return 0;
  });

  const forwardNavigation = useForwardNavigation();

  function onEditClicked(exerciseId: string) {
    exerciseTypeToEditId = exerciseId;
    addOpen = true;
    editMode = true;
  }
</script>

<Drawer.Root bind:open={addOpen}>
  <Header>
    <svelte:fragment>Add Exercise</svelte:fragment>
    <svelte:fragment slot="action">
      <ExitButton />
    </svelte:fragment>
  </Header>

  <Container>
    <div class="flex flex-col gap-12">
      <Headline style="medium">Add Exercise</Headline>

      <div class="flex flex-col gap-4 pb-24">
        <Select.Root
          selected={sortTypeSelection}
          onSelectedChange={(e) => e && (sortType = e.value)}
        >
          <Select.Trigger class="ml-auto w-[180px] border-none">
            <p class="text-primary-200">Sort by</p>
            <Select.Value placeholder="Sort by" class="border-none" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={SortType.createdAt}>Created at</Select.Item>
            <Select.Item value={SortType.name}>Name</Select.Item>
          </Select.Content>
        </Select.Root>

        {#each sortedExerciseTypes as exerciseType (exerciseType.id)}
          <div
            animate:flip={{ duration: 100, easing: sineInOut }}
            id={exerciseType.id}
          >
            <ExerciseTypeRadioButton
              bind:group={exerciseTypeSelection}
              {onEditClicked}
              required={true}
              {exerciseType}
            />
          </div>
        {/each}
        <Drawer.Trigger class="w-full">
          <AddCard isInline={true} loadingOnClick={false}>Add Type</AddCard>
        </Drawer.Trigger>
      </div>

      <FloatBottomWrapper>
        <Container>
          <Button
            action={async () => {
              let exerciseType = selectedExerciseType;

              if (exerciseType) {
                const newExerciseId = await addExerciseAction(
                  exerciseType,
                  $userId ?? "",
                  data.sessionId
                );

                forwardNavigation.set(true);

                goto(
                  getExercisePath({
                    sessionId: data.sessionId,
                    exerciseId: newExerciseId,
                  })
                );
              }
            }}
            loadingOnClick={true}
            disabled={isInvalid}
            classes="w-full"
          >
            Add
          </Button>
        </Container>
      </FloatBottomWrapper>
    </div>
  </Container>

  <AddExerciseTypeDrawer
    exerciseTypeId={selectedExerciseTypeToEdit?.id}
    exerciseTypeName={selectedExerciseTypeToEdit?.name}
    exerciseCategory={selectedExerciseTypeToEdit?.category}
    isOpen={addOpen}
    {editMode}
  />
</Drawer.Root>
