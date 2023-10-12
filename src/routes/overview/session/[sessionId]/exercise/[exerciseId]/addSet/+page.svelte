<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import type { PageData } from "./$types";
  import Button from "$lib/base/Button.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import ExitButton from "$lib/base/ExitButton.svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import Header from "$lib/base/Header.svelte";
  import type { ExerciseSet } from "@prisma/client";
  import FloatBottomWrapper from "$lib/base/layout/FloatBottomWrapper.svelte";
  import addExerciseSetAction from "./actions/addExerciseSetAction";
  import { goto } from "$app/navigation";
  import { getExercisePath } from "$lib/utils/routing/routes";
  import { getReplicache, useSettings, useUserId } from "$lib/stores/stores";
  import type {
    ExerciseFull,
    WorkoutSessionFull,
  } from "$lib/utils/prismaTypes";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let data: PageData;
  let repetitions = "";
  let weightMain = "";
  let weightAdditional = "";
  let notes = "";
  let exerciseSetType = "WORKOUT";

  let weightType = "UNIFIED";

  $: exerciseSet = {
    reps: +repetitions,
    weight: +weightMain,
    additionalWeight: weightAdditional !== "" ? +weightAdditional : 0.0,
    notes: notes,
    exerciseSetType: exerciseSetType,
  } as Partial<ExerciseSet>;

  $: isInvalid =
    repetitions.length === 0 ||
    +repetitions < 0 ||
    weightMain.length === 0 ||
    +weightMain < 0 ||
    (weightType !== "UNIFIED" &&
      (weightAdditional.length === 0 || +weightAdditional < 0));

  let exercise: ExerciseFull | undefined;

  let settings = useSettings();

  let userId = useUserId();

  onMount(() => {
    getReplicache($userId ?? "").subscribe(
      async (tx) =>
        (
          await tx.scan({
            prefix: `user/${$userId ?? ""}/session/${data.sessionId}`,
          })
        ).toArray(),
      {
        onData: (value) => {
          try {
            exercise = (
              JSON.parse(value?.toString()) as WorkoutSessionFull
            ).exercises
              .filter((exercise) => exercise.id === data.exerciseId)
              .at(0);
          } catch {}
        },
      }
    );
  });
</script>

<Header>
  <svelte:fragment>Add Set</svelte:fragment>
  <svelte:fragment slot="action">
    <ExitButton
      exitPath={getExercisePath({
        sessionId: data.sessionId,
        exerciseId: data.exerciseId,
      })}
    />
  </svelte:fragment>
</Header>

<Container>
  <div class="flex flex-col gap-12">
    <div class="flex flex-col gap-4">
      <RadioSelect
        items={[
          { name: "Warmup", value: "WARMUP" },
          { name: "Workout", value: "WORKOUT" },
          { name: "Cooldown", value: "COOLDOWN" },
        ]}
        name="exerciseSetType"
        label="Type"
        bind:group={exerciseSetType}
      />
      <TextInput
        name="reps"
        id="reps"
        type="number"
        label="Repetitions"
        bind:input={repetitions}
        required={true}
        metric="reps"
      />
      <div class="flex flex-col">
        <p>Weight</p>
        <div class="flex flex-col gap-2">
          <RadioSelect
            items={[
              { name: "Unified", value: "UNIFIED" },
              { name: "Bilateral", value: "BILATERAL" },
            ]}
            name="weightType"
            bind:group={weightType}
          />
          {#if weightType === "UNIFIED"}
            <div
              transition:fade={{
                delay: weightType === "UNIFIED" ? 0 : 210,
                duration: 200,
              }}
            >
              <TextInput
                name="weight"
                id="weight"
                type="number"
                step={0.01}
                bind:input={weightMain}
                required={true}
                metric="kg"
              />
            </div>
          {:else if weightType === "BILATERAL"}
            <div
              class="flex flex-row justify-between gap-4"
              transition:fade={{
                duration: 200,
              }}
            >
              <TextInput
                name="weight"
                id="weight"
                type="number"
                step={0.01}
                bind:input={weightMain}
                required={true}
                metric="kg"
              />
              <TextInput
                name="weight"
                id="weight"
                type="number"
                step={0.01}
                bind:input={weightAdditional}
                required={true}
                metric="kg"
              />
            </div>
          {/if}
        </div>
      </div>
      <TextArea
        name="notes"
        id="notes"
        rows={3}
        label="Notes"
        placeholder="Enter your notes here"
        bind:input={notes}
      />
    </div>

    <FloatBottomWrapper>
      <Container>
        <div class="w-full">
          <Button
            action={() => {
              if (exercise) {
                addExerciseSetAction(exercise, exerciseSet);
                console.log(exerciseSet);
                if ($settings.useTimer)
                  fetch("https://eoj3xsgtl8d1hzc.m.pipedream.net", {
                    method: "POST",
                    body: JSON.stringify({
                      delay: $settings.timerValue,
                      userId: $userId,
                      sessionId: data.sessionId,
                      exerciseId: data.exerciseId,
                    }),
                  });

                const exercisePath =
                  getExercisePath({
                    sessionId: data.sessionId,
                    exerciseId: data.exerciseId,
                  }) + ($settings.useTimer ? "?hasTimer=true" : "");

                goto(exercisePath);
              }
            }}
            disabled={isInvalid}
            highlight={true}
            classes="w-full"
          >
            Add
          </Button>
        </div>
      </Container>
    </FloatBottomWrapper>
  </div>
</Container>
