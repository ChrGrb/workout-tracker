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
  import { getReplicache, useUserId } from "$lib/stores/stores";
  import {
    getAddExerciseTypePath,
    getExercisePath,
    getOverviewPath,
  } from "$lib/utils/routing/routes";
  import type { ExerciseType } from "@prisma/client";
  import { onMount } from "svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import { addCallbackToUrl } from "$lib/utils/routing/callbacks";
  import { page } from "$app/stores";

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
              JSON.parse(element!.toString()),
            ) as ExerciseType[];
            exerciseTypes = filterDeleted(exerciseTypes).sort((a, b) =>
              a.name.localeCompare(b.name),
            );
          } catch {}
        },
      },
    );
  });
</script>

<Header>
  <svelte:fragment>Add Exercise</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton exitPath={data.callback} />
  </svelte:fragment>
</Header>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 pb-24">
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
        isInline={true}
        addAction={() =>
          goto(addCallbackToUrl(getAddExerciseTypePath, $page.url.pathname))}
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
                (exerciseType) => exerciseType.id === exerciseTypeSelection,
              )
              .at(0);

            if (exerciseType) {
              const newExerciseId = await addExerciseAction(
                exerciseType,
                $userId ?? "",
                data.sessionId,
              );

              goto(
                getExercisePath({
                  sessionId: data.sessionId,
                  exerciseId: newExerciseId,
                }),
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
