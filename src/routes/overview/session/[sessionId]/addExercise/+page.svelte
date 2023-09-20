<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { goto } from "$app/navigation";
  import ExerciseTypeRadioButton from "./components/ExerciseTypeRadioButton.svelte";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import { fade } from "svelte/transition";
  import AddCard from "$lib/components/AddCard.svelte";
  import Header from "$lib/base/Header.svelte";
  import Button from "$lib/base/Button.svelte";
  import addExerciseAction from "./actions/addExerciseAction";
  import { getReplicache, useUserId } from "$lib/stores/stores";
  import { getAddExerciseTypePath, getOverviewPath } from "$lib/utils/routes";
  import type { ExerciseType } from "@prisma/client";
  import { onMount } from "svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";

  export let data: PageData;

  let exerciseTypeSelection = "";
  $: isInvalid = exerciseTypeSelection.length === 0;

  let userId = useUserId();
  let exerciseTypes: ExerciseType[] = [];

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
            exerciseTypes = filterDeleted(exerciseTypes).sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } catch {}
        },
      }
    );
  });
</script>

<Header>
  <svelte:fragment>Add Exercise</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton exitPath="/overview" />
  </svelte:fragment>
</Header>

<Container>
  <div class="flex flex-col gap-12">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pb-24">
      {#each exerciseTypes as exerciseType (exerciseType.id)}
        <div animate:flip={{ duration: 100, easing: sineInOut }}>
          <ExerciseTypeRadioButton
            bind:group={exerciseTypeSelection}
            required={true}
            {exerciseType}
          />
        </div>
      {/each}
      <AddCard
        addAction={() =>
          goto(getAddExerciseTypePath({ sessionId: data.sessionId }))}
      >
        Add Type
      </AddCard>
    </div>

    <FloatBottomWrapper>
      <Container>
        <Button
          action={async () => {
            let exerciseType = exerciseTypes
              .filter(
                (exerciseType) => exerciseType.id === exerciseTypeSelection
              )
              .at(0);

            if (exerciseType) {
              addExerciseAction(exerciseType, $userId ?? "", data.sessionId);

              goto(getOverviewPath);
            }
          }}
          disabled={isInvalid}
          classes="w-full"
        >
          Add
        </Button>
      </Container>
    </FloatBottomWrapper>
  </div>
</Container>
