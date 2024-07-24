<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import { goto } from "$app/navigation";
  import { flip } from "svelte/animate";
  import { sineInOut } from "svelte/easing";
  import AddCard from "$lib/components/AddCard.svelte";
  import Header from "$lib/base/Header.svelte";
  import Button from "$lib/base/Button.svelte";
  import {
    getReplicache,
    useBackNavigation,
    useForwardNavigation,
    useUserId,
  } from "$lib/stores/stores";
  import {
    getAddExerciseTypePath,
    getOverviewPath,
  } from "$lib/utils/routing/routes";
  import type { ExerciseType } from "@prisma/client";
  import { onMount } from "svelte";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import { filterDeleted } from "$lib/utils/data/filterDeleted";
  import ExerciseTypeCheckbox from "./components/ExerciseTypeCheckbox.svelte";
  import createWorkoutSessionTemplateAction from "../../actions/createWorkoutSessionTemplate";
  import Headline from "$lib/base/Headline.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";

  let userId = useUserId();
  let exerciseTypes: (ExerciseType & { isChecked: boolean })[] = [];
  let exerciseTemplateName = "";

  $: checkedTypes = exerciseTypes.filter(
    (exerciseType) => exerciseType.isChecked
  );

  $: isInvalid = checkedTypes.length <= 0 || exerciseTemplateName.length <= 0;

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
            exerciseTypes = data.map(
              (element) =>
                JSON.parse(element!.toString()) as ExerciseType & {
                  isChecked: false;
                }
            ) as (ExerciseType & { isChecked: boolean })[];
            exerciseTypes = filterDeleted(exerciseTypes).sort((a, b) =>
              a.name.localeCompare(b.name)
            );
          } catch {}
        },
      }
    );
  });

  const forwardNavigation = useForwardNavigation();
  const backNavigation = useBackNavigation();
</script>

<Header>
  <svelte:fragment>Add Template</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton exitPath="/overview" />
  </svelte:fragment>
</Header>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <Headline style="small">Name</Headline>
      <TextInput
        name="exerciseTemplateName"
        id="exerciseTemplateName"
        type="text"
        required={true}
        bind:input={exerciseTemplateName}
      />
    </div>
    <div class="flex flex-col gap-4">
      <Headline style="small">Exercises</Headline>
      <div class="flex flex-col gap-4 pb-24">
        {#each exerciseTypes as exerciseType (exerciseType.id)}
          <div animate:flip={{ duration: 100, easing: sineInOut }}>
            <ExerciseTypeCheckbox
              bind:checked={exerciseType.isChecked}
              {exerciseType}
            />
          </div>
        {/each}
        <AddCard
          isInline={true}
          addAction={() => {
            forwardNavigation.set(true);
            goto(getAddExerciseTypePath);
          }}
        >
          Add Type
        </AddCard>
      </div>
    </div>

    <FloatBottomWrapper>
      <Container>
        <Button
          action={async () => {
            createWorkoutSessionTemplateAction(
              $userId ?? "",
              checkedTypes,
              exerciseTemplateName
            );

            backNavigation.set(true);
            goto(getOverviewPath);
          }}
          disabled={isInvalid}
          classes="w-full"
        >
          Confirm
        </Button>
      </Container>
    </FloatBottomWrapper>
  </div>
</Container>
