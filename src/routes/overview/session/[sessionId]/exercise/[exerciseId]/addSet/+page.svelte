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
  import { getExercisePath } from "$lib/utils/routes";
  import { getReplicache, useSettings, useUserId } from "$lib/stores/stores";
  import type {
    ExerciseFull,
    WorkoutSessionFull,
  } from "$lib/utils/prismaTypes";
  import { onMount } from "svelte";

  export let data: PageData;
  let repetitions = "";
  let weight = "";
  let notes = "";
  let exerciseSetType = "WORKOUT";

  $: exerciseSet = {
    reps: +repetitions,
    weight: +weight,
    notes: notes,
    exerciseSetType: exerciseSetType,
  } as Partial<ExerciseSet>;

  $: isInvalid =
    repetitions.length === 0 ||
    +repetitions < 0 ||
    weight.length === 0 ||
    +weight < 0;

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
      <TextInput
        name="weight"
        id="weight"
        type="number"
        label="Weight"
        step={0.01}
        bind:input={weight}
        required={true}
        metric="kg"
      />
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
                console.log($settings.useTimer);
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

                console.log("Fetch done");
                const exercisePath =
                  getExercisePath({
                    sessionId: data.sessionId,
                    exerciseId: data.exerciseId,
                  }) + ($settings.useTimer ? "?hasTimer=true" : "");

                console.log(exercisePath);

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
