<script lang="ts">
  import Container from "$lib/base/Container.svelte";
  import Button from "$lib/base/Button.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import type { ExerciseSet } from "@prisma/client";
  import { useSettings, useUserId } from "$lib/stores/stores";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import { fade } from "svelte/transition";
  import addExerciseSetAction from "../actions/addExerciseSetAction";
  import * as Drawer from "$lib/components/ui/drawer";

  export let exercise: ExerciseFull | undefined;

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

  let settings = useSettings();

  let userId = useUserId();
</script>

<Drawer.Content
  class="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[96%] rounded-t-[10px]"
>
  <Drawer.Header>
    <Drawer.Title>Add Set</Drawer.Title>
  </Drawer.Header>

  <div
    class="max-w-md w-full mx-auto flex flex-col overflow-auto p-4 rounded-t-[10px]"
  >
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

      <Container>
        <div class="w-full">
          <Drawer.Close class="w-full">
            <Button
              action={() => {
                if (exercise) {
                  addExerciseSetAction(exercise, exerciseSet);

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
                }
              }}
              disabled={isInvalid}
              highlight={true}
              classes="w-full"
            >
              Add
            </Button>
          </Drawer.Close>
        </div>
      </Container>
    </div>
  </div>
</Drawer.Content>
