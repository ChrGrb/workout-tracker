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
  import { useForwardNavigation, useUserId } from "$lib/stores/stores";
  import { getExercisePath } from "$lib/utils/routing/routes";
  import type { ExerciseTypeWithEquipment } from "$lib/utils/prismaTypes";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import LiquidGlass from "$lib/base/LiquidGlass.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import * as Drawer from "$lib/components/ui/drawer";
  import AddExerciseTypeDrawer from "./components/AddExerciseTypeDrawer.svelte";
  import * as Collapsible from "$lib/components/ui/collapsible";
  import { ChevronsUpDown, Search, Filter } from "lucide-svelte";
  import { slide } from "svelte/transition";
  import { getZ } from "$lib/zero/z.svelte";
  import { queries } from "$lib/zero/queries";
  import clsx from "clsx";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let exerciseTypeSelection = $state("");

  let exerciseTypeToEditId = $state("");

  let userId = useUserId();
  let exerciseTypes: ExerciseTypeWithEquipment[] = $state([]);

  let addOpen = $state(false);
  let editMode = $state(false);

  const OTHER = "OTHER";
  const muscleGroups = [
    { value: "CHEST", label: "Chest" },
    { value: "SHOULDERS", label: "Shoulders" },
    { value: "ARMS", label: "Arms" },
    { value: "CORE", label: "Core" },
    { value: "BACK", label: "Back" },
    { value: "LEGS", label: "Legs" },
    { value: OTHER, label: "Other" },
  ];

  let selectedGroups = $state<string[]>([]);

  function toggleGroup(value: string) {
    selectedGroups = selectedGroups.includes(value)
      ? selectedGroups.filter((group) => group !== value)
      : [...selectedGroups, value];
  }

  // Equipment filter. NONE matches exercise types with no equipment assigned.
  const NONE = "NONE";
  let equipment = $state<{ id: string; name: string }[]>([]);
  let selectedEquipment = $state<string[]>([]);

  function toggleEquipment(value: string) {
    selectedEquipment = selectedEquipment.includes(value)
      ? selectedEquipment.filter((e) => e !== value)
      : [...selectedEquipment, value];
  }

  let equipmentOptions = $derived([
    { value: NONE, label: "None" },
    ...equipment.map((e) => ({ value: e.id, label: e.name })),
  ]);

  let searchOpen = $state(false);
  let searchTerm = $state("");

  function toggleSearch() {
    searchOpen = !searchOpen;
    if (!searchOpen) searchTerm = "";
  }

  let filterOpen = $state(false);

  function toggleFilter() {
    filterOpen = !filterOpen;
  }

  const exerciseTypesQuery = getZ().createQuery(queries.exerciseTypes());
  $effect(() => {
    exerciseTypes =
      exerciseTypesQuery.data as unknown as ExerciseTypeWithEquipment[];
  });

  const equipmentQuery = getZ().createQuery(queries.equipment());
  $effect(() => {
    equipment = (equipmentQuery.data ?? []) as { id: string; name: string }[];
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
      .at(0),
  );
  let selectedExerciseTypeToEdit = $derived(
    exerciseTypes
      .filter((exerciseType) => exerciseType.id === exerciseTypeToEditId)
      .at(0),
  );
  let isInvalid = $derived(exerciseTypeSelection.length === 0);

  let search = $derived(searchTerm.trim().toLowerCase());

  let groupedExerciseTypes = $derived(
    muscleGroups
      .filter(
        (group) =>
          selectedGroups.length === 0 || selectedGroups.includes(group.value),
      )
      .map((group) => ({
        ...group,
        items: exerciseTypes
          .filter((exerciseType) => (exerciseType.area ?? OTHER) === group.value)
          .filter(
            (exerciseType) =>
              search.length === 0 ||
              exerciseType.name.toLowerCase().includes(search),
          )
          .filter(
            (exerciseType) =>
              selectedEquipment.length === 0 ||
              selectedEquipment.includes(exerciseType.equipmentId ?? NONE),
          )
          .toSorted((a, b) => a.name.localeCompare(b.name)),
      }))
      .filter((group) => group.items.length > 0),
  );
</script>

<Drawer.Root bind:open={addOpen} handleOnly disablePreventScroll noBodyStyles>
  <Header>
    Add Exercise

    {#snippet action()}
      <ExitButton />
    {/snippet}
  </Header>

  <Container>
    <div class="flex flex-col gap-12">
      <div class="flex flex-row justify-between items-center gap-4">
        <Headline style="medium">Add Exercise</Headline>
        <div class="flex flex-row items-center gap-2">
          <button
            type="button"
            aria-label="Filter by muscle group"
            aria-pressed={filterOpen}
            onclick={toggleFilter}
            class={clsx(
              "flex items-center justify-center rounded-full p-2 transition-all",
              filterOpen ? "bg-black text-white" : "text-primary-700",
            )}
          >
            <Filter class="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Search exercises"
            aria-pressed={searchOpen}
            onclick={toggleSearch}
            class={clsx(
              "flex items-center justify-center rounded-full p-2 transition-all",
              searchOpen ? "bg-black text-white" : "text-primary-700",
            )}
          >
            <Search class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4 pb-24">
        {#if searchOpen}
          <div transition:slide={{ duration: 200, easing: sineInOut }}>
            <!-- svelte-ignore a11y_autofocus -->
            <input
              type="text"
              autofocus
              bind:value={searchTerm}
              placeholder="Search exercises"
              class="input block w-full py-2 px-3"
            />
          </div>
        {/if}

        {#if filterOpen}
          <div
            transition:slide={{ duration: 200, easing: sineInOut }}
            class="flex flex-col gap-4"
          >
            <div class="flex flex-col gap-2">
              <p class="text-sm font-semibold text-primary-700">Muscle group</p>
              <div class="flex flex-row flex-wrap gap-2">
                {#each muscleGroups as group (group.value)}
                  <button
                    type="button"
                    onclick={() => toggleGroup(group.value)}
                    class={clsx(
                      "rounded-full border px-3 py-1 text-sm transition-all",
                      selectedGroups.includes(group.value)
                        ? "bg-black text-white border-black"
                        : "variant-soft-primary border-transparent text-primary-700",
                    )}
                  >
                    {group.label}
                  </button>
                {/each}
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <p class="text-sm font-semibold text-primary-700">Equipment</p>
              <div class="flex flex-row flex-wrap gap-2">
                {#each equipmentOptions as option (option.value)}
                  <button
                    type="button"
                    onclick={() => toggleEquipment(option.value)}
                    class={clsx(
                      "rounded-full border px-3 py-1 text-sm transition-all",
                      selectedEquipment.includes(option.value)
                        ? "bg-black text-white border-black"
                        : "variant-soft-primary border-transparent text-primary-700",
                    )}
                  >
                    {option.label}
                  </button>
                {/each}
              </div>
            </div>
          </div>
        {/if}

        {#each groupedExerciseTypes as group (group.value)}
          <Collapsible.Root open={true}>
            <div class="flex flex-col gap-2">
              <Collapsible.Trigger class="w-full items-center">
                <div class="flex flex-row justify-between w-full items-center">
                  <Headline style="small">{group.label}</Headline>
                  <ChevronsUpDown class="h-4 w-4" />
                </div>
              </Collapsible.Trigger>
              <Collapsible.Content>
                <div class="flex flex-col gap-2">
                  {#each group.items as exerciseType (exerciseType.id)}
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
          <!-- No opacity on this wrapper: an ancestor with opacity < 1 disables
               the LiquidGlass backdrop-filter, so the disabled state dims only
               the label (below) and keeps the glass intact. -->
          <div class="relative w-full">
            <LiquidGlass
              className="absolute inset-0 rounded-full !bg-black/15"
            />
            <Button
              action={async () => {
                let exerciseType = $state.snapshot(selectedExerciseType);

                if (exerciseType) {
                  const newExerciseId = await addExerciseAction(
                    exerciseType,
                    $userId ?? "",
                    data.sessionId,
                  );

                  forwardNavigation.set(true);

                  goto(
                    getExercisePath({
                      sessionId: data.sessionId,
                      exerciseId: newExerciseId,
                    }),
                    {
                      replaceState: true,
                    },
                  );
                }
              }}
              loadingOnClick={true}
              disabled={isInvalid}
              classes={clsx(
                "w-full !bg-transparent !border-0 relative z-10 text-white font-semibold transition-opacity",
                isInvalid && "opacity-40",
              )}
            >
              Add
            </Button>
          </div>
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
      exerciseTypeEquipmentId={selectedExerciseTypeToEdit?.equipmentId}
      isOpen={addOpen}
      {editMode}
    />
  </Drawer.Content>
</Drawer.Root>
