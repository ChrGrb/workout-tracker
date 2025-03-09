<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import Button from "$lib/base/Button.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import type { ExerciseSet } from "@prisma/client";
  import {
    useAddExerciseSetSettings,
    useSettings,
    useUserId,
  } from "$lib/stores/stores";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import { fade } from "svelte/transition";
  import addExerciseSetAction from "../actions/addExerciseSetAction";
  import * as Drawer from "$lib/components/ui/drawer";
  import { ScrollArea } from "$lib/components/ui/scroll-area";

  const exerciseSetSettings = useAddExerciseSetSettings();

  const defaultExerciseWeightType = $derived(
    $exerciseSetSettings.find(
      (element) => element.exerciseTypeId === exercise?.typeId
    )?.exerciseInputType
  );

  let repetitions = $state("");
  let weightMain = $state("");
  let weightAdditional = $state("");
  let notes = $state("");
  let exerciseSetType = $state("WORKOUT");
  let weightType = $state(defaultExerciseWeightType ?? "UNIFIED");

  const reset = () => {
    repetitions = "";
    weightMain = "";
    weightAdditional = "";
    notes = "";
    exerciseSetType = "WORKOUT";
  };

  interface Props {
    exercise: ExerciseFull | undefined;
    hasTimer: boolean;
  }

  let { exercise, hasTimer = $bindable() }: Props = $props();

  let exerciseSet = $derived({
    reps: +repetitions,
    weight: +weightMain,
    additionalWeight: weightAdditional !== "" ? +weightAdditional : 0.0,
    notes: notes,
    exerciseSetType: exerciseSetType,
  } as Partial<ExerciseSet>);

  let isInvalid = $derived(
    repetitions.length === 0 ||
      +repetitions < 0 ||
      weightMain.length === 0 ||
      +weightMain < 0 ||
      (weightType !== "UNIFIED" &&
        (weightAdditional.length === 0 || +weightAdditional < 0))
  );

  let settings = useSettings();

  let userId = useUserId();

  $effect(() => {
    updateDefaultExerciseSetType(
      exercise?.typeId ?? "",
      weightType as "UNIFIED" | "BILATERAL"
    );
  });

  const updateDefaultExerciseSetType = (
    exerciseTypeId: string,
    exerciseInputType: "UNIFIED" | "BILATERAL"
  ) => {
    exerciseSetSettings.update((exerciseSetSettings) => {
      if (
        exerciseSetSettings
          .map((exerciseSetSetting) => exerciseSetSetting.exerciseTypeId)
          .includes(exerciseTypeId)
      ) {
        return exerciseSetSettings.map((exerciseSetSetting) => {
          if (exerciseSetSetting.exerciseTypeId === exerciseTypeId) {
            return {
              ...exerciseSetSetting,
              exerciseInputType,
            };
          }

          return exerciseSetSetting;
        });
      }

      return exerciseSetSettings.concat({
        exerciseTypeId,
        exerciseInputType,
      });
    });
  };
</script>

<div>
  <Drawer.Header>
    <Drawer.Title>Add Set</Drawer.Title>
  </Drawer.Header>

  <div class="max-w-md w-full mx-auto flex flex-col p-4 rounded-t-[10px] z-50">
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
              {#if weightType === "BILATERAL"}
                <TextInput
                  name="weight"
                  id="weight"
                  type="number"
                  step={0.01}
                  bind:input={weightAdditional}
                  required={true}
                  metric="kg"
                />
              {/if}
            </div>
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

      <Drawer.Footer class="px-0">
        <Drawer.Close class="w-full">
          <Button
            action={async () => {
              if (exercise) {
                await addExerciseSetAction(
                  $state.snapshot(exercise),
                  $state.snapshot(exerciseSet)
                );
                hasTimer = true;

                if ($settings.useTimer)
                  fetch("https://eoj3xsgtl8d1hzc.m.pipedream.net", {
                    method: "POST",
                    body: JSON.stringify({
                      delay: $settings.timerValue,
                      userId: $userId,
                      sessionId: exercise.sessionId,
                      exerciseId: exercise.id,
                    }),
                  });

                reset();
              }
            }}
            disabled={isInvalid}
            highlight={true}
            classes="w-full"
          >
            Add
          </Button>
        </Drawer.Close>
      </Drawer.Footer>
    </div>
  </div>
</div>
