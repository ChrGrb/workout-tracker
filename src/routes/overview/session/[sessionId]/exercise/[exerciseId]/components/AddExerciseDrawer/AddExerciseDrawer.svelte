<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import TextArea from "$lib/base/input/TextArea.svelte";
  import { useAddExerciseSetSettings } from "$lib/stores/stores";
  import type { ExerciseFull } from "$lib/utils/prismaTypes";
  import { fade } from "svelte/transition";
  import addExerciseSetAction from "../../actions/addExerciseSetAction";
  import * as Drawer from "$lib/components/ui/drawer";
  import { superForm, defaults } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { getExerciseSetSchema, WeightTypeEnum } from "./exerciseSetSchema";
  import SuperTextInput from "$lib/base/input/SuperTextInput.svelte";
  import SuperRadioSelect from "$lib/base/input/SuperRadioSelect.svelte";

  const exerciseSetSettings = useAddExerciseSetSettings();
  const defaultExerciseWeightType = $derived(
    $exerciseSetSettings.find(
      (element) => element.exerciseTypeId === exercise?.typeId,
    )?.exerciseInputType,
  );

  const schema = getExerciseSetSchema(
    defaultExerciseWeightType as WeightTypeEnum,
  );

  interface Props {
    exercise: ExerciseFull | undefined;
    hasTimer: boolean;
  }

  let { exercise, hasTimer = $bindable() }: Props = $props();


  const updateDefaultExerciseSetType = (
    exerciseTypeId: string,
    exerciseInputType: WeightTypeEnum,
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

  const superform = superForm(defaults({}, zod4(schema)), {
    SPA: true,
    validators: zod4(schema),
    validationMethod: "auto",
    customValidity: true,
    onChange(event) {
      if (event.paths.includes("weightType")) validate("additionalWeight");
    },
    async onUpdate({ form }) {
      if (!form.valid || !exercise) return;

      const { reps, weight, additionalWeight, notes, exerciseSetType } =
        form.data;

      await addExerciseSetAction($state.snapshot(exercise), {
        reps: reps ?? undefined,
        weight: weight ?? undefined,
        additionalWeight:
          form.data.weightType === WeightTypeEnum.BILATERAL
            ? (additionalWeight ?? undefined)
            : 0,
        notes,
        exerciseSetType,
      });
      hasTimer = true;

      // superforms resets to the initial data after a successful submit; keep
      // the chosen weight type so the reset doesn't overwrite the preference.
      reset({ newState: { weightType: form.data.weightType } });
    },
  });

  const { form, enhance, allErrors, validateForm, validate, reset } =
    superform;

  $effect(() => {
    updateDefaultExerciseSetType(
      exercise?.typeId ?? "",
      $form.weightType as WeightTypeEnum,
    );
  });

  validateForm({ update: true });
</script>

<div>
  <Drawer.Header>
    <Drawer.Title>Add Set</Drawer.Title>
  </Drawer.Header>

  <div class="max-w-md w-full mx-auto flex flex-col p-4 rounded-t-[10px] z-50">
    <form method="POST" use:enhance>
      <div class="flex flex-col gap-12">
        <div class="flex flex-col gap-4">
          <SuperRadioSelect {superform} field="exerciseSetType" label="Type" />
          <SuperTextInput
            name="reps"
            id="reps"
            type="number"
            label="Repetitions"
            {superform}
            field="reps"
            metric="reps"
          />
          <div class="flex flex-col">
            <p>Weight</p>
            <div class="flex flex-col gap-2">
              <SuperRadioSelect {superform} field="weightType" />

              <div
                class="flex flex-row justify-between gap-4"
                transition:fade={{
                  duration: 200,
                }}
              >
                <SuperTextInput
                  name="weight"
                  id="weight"
                  type="number"
                  step={0.01}
                  {superform}
                  field="weight"
                  metric="kg"
                />
                {#if $form.weightType === "BILATERAL"}
                  <SuperTextInput
                    name="additionalWeight"
                    id="additionalWeight"
                    type="number"
                    step={0.01}
                    {superform}
                    field="additionalWeight"
                    metric="kg"
                    showUntouchedErrors
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
            bind:input={$form.notes}
          />
        </div>

        <Drawer.Footer class="px-0">
          <Drawer.Close class="w-full">
            <Button
              type="submit"
              highlight={true}
              classes="w-full"
              disabled={!!$allErrors.length}>Add</Button
            >
          </Drawer.Close>
        </Drawer.Footer>
      </div>
    </form>
  </div>
</div>
