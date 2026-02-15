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
  import * as Collapsible from "$lib/components/ui/collapsible";
  import { ChevronsUpDown } from "lucide-svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import { subscribeReplicacheData } from "$lib/utils/replicache/subscribeReplicacheData";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let exerciseTypeSelection = $state("");

  let exerciseTypeToEditId = $state("");

  let userId = useUserId();
  let exerciseTypes: ExerciseType[] = $state([]);

  let addOpen = $state(false);
  let editMode = $state(false);

  const SortType = {
    createdAt: "Created at",
    name: "Name",
  };

  let sortType = $state(SortType.name);

  onMount(() => {
    subscribeReplicacheData<ExerciseType>(
      $userId ?? "",
      `user/${$userId}/exerciseType`,
      (data) => {
        exerciseTypes = data;
      }
    );
  });

  const forwardNavigation = useForwardNavigation();

  function onEditClicked(exerciseId: string) {
    exerciseTypeToEditId = exerciseId;
    addOpen = true;
    editMode = true;
  }
  let selectedExerciseType = $derived(
    exerciseTypes
      .filter((exerciseType) => exerciseType.id === exerciseTypeSelection)
      .at(0)
  );
  let selectedExerciseTypeToEdit = $derived(
    exerciseTypes
      .filter((exerciseType) => exerciseType.id === exerciseTypeToEditId)
      .at(0)
  );
  let isInvalid = $derived(exerciseTypeSelection.length === 0);

  let sortedExerciseTypes = $derived(
    exerciseTypes.toSorted((a, b) => {
      if (sortType === SortType.createdAt) {
        return (b.versionUpdatedAt ?? 0) - (a.versionUpdatedAt ?? 0);
      } else if (sortType === SortType.name) {
        return a.name.localeCompare(b.name);
      }

      return 0;
    })
  );

  let groupedExerciseTypes = $derived(
    Object.groupBy(sortedExerciseTypes, ({ area }) => area ?? "DEFAULT")
  );
</script>

<Drawer.Root bind:open={addOpen}>
  <Header>
    {#snippet children()}
      Add Exercise
    {/snippet}
    {#snippet action()}
      <ExitButton />
    {/snippet}
  </Header>

  <Container>
    <div class="flex flex-col gap-12">
      <Headline style="medium">Add Exercise</Headline>

      <div class="flex flex-col gap-4 pb-24">
        <Select.Root
          type="single"
          onValueChange={(value: string) => (sortType = value)}
          bind:value={sortType}
        >
          <Select.Trigger class="ml-auto w-[180px] border-none">
            <p class="text-primary-200">Sort by</p>
            {sortType}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={SortType.createdAt} label="Created at">
              {SortType.createdAt}
            </Select.Item>
            <Select.Item value={SortType.name} label="Created at">
              {SortType.name}
            </Select.Item>
          </Select.Content>
        </Select.Root>

        {#each Object.entries(groupedExerciseTypes) as [area, exerciseTypes] (area)}
          <Collapsible.Root open={true}>
            <div class="flex flex-col gap-2">
              <Collapsible.Trigger class="w-full items-center">
                <div class="flex flex-row justify-between w-full items-center">
                  <Headline style="small">{area ?? "DEFAULT"}</Headline>
                  <ChevronsUpDown class="h-4 w-4" />
                </div>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <div class="flex flex-col gap-2">
                  {#each exerciseTypes as exerciseType (exerciseType.id)}
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
                </div>
              </Collapsible.Content>
            </div>
          </Collapsible.Root>
        {/each}

        <Drawer.Trigger class="w-full">
          <AddCard isInline={true} loadingOnClick={false}>Add Type</AddCard>
        </Drawer.Trigger>
      </div>

      <FloatBottomWrapper>
        <Container>
          <Button
            action={async () => {
              let exerciseType = $state.snapshot(selectedExerciseType);

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
                  }),
                  {
                    replaceState: true,
                  }
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

  <Drawer.Content
    class="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96vh] rounded-t-[10px]"
  >
    <AddExerciseTypeDrawer
      exerciseTypeId={selectedExerciseTypeToEdit?.id}
      exerciseTypeName={selectedExerciseTypeToEdit?.name}
      exerciseCategory={selectedExerciseTypeToEdit?.category}
      exerciseTypeArea={selectedExerciseTypeToEdit?.area}
      isOpen={addOpen}
      {editMode}
    />
  </Drawer.Content>
</Drawer.Root>
