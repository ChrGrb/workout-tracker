<script lang="ts">
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import { useSettings } from "$lib/stores/stores";
  import SettingsCard from "./components/SettingsCard.svelte";
  import type { UserWithSettings } from "$lib/utils/prismaTypes";
  import Button from "$lib/base/Button.svelte";
  import updateUserSettingsAction from "./actions/updateUserSettingsAction";

  interface Props {
    user: UserWithSettings;
  }

  let { user }: Props = $props();

  let duration = $state((user.settings.timerValue / 1000).toString());
  let enabled = $state(user.settings.useTimer.toString());

  let durationComp = $state(duration);
  let enabledComp = $state(enabled);

  let settings = useSettings();

  let isButtonDisabled = $derived(
    duration == durationComp && enabled == enabledComp
  );
</script>

<SettingsCard>
  {#snippet headline()}
    Cooldown Timer
  {/snippet}
  {#snippet content()}
    <div class="flex flex-col gap-4">
      <RadioSelect
        items={[
          { name: "Enable", value: "true" },
          { name: "Disable", value: "false" },
        ]}
        name="timerEnabled"
        bind:group={enabled}
      />
      <TextInput
        label="Duration"
        name="timerDuration"
        id="timerDuration"
        type="number"
        required={true}
        metric="s"
        bind:input={duration}
      />
    </div>

    <Button
      disabled={isButtonDisabled}
      action={() => {
        updateUserSettingsAction(user.settings, {
          timerValue: +duration * 1000,
          useTimer: enabled === "true",
        });

        durationComp = duration;
        enabledComp = enabled;

        settings.update((settings) => {
          settings.useTimer = enabled == "true";
          settings.timerValue = +duration * 1000;

          return settings;
        });
      }}
    >
      <p>Update</p>
    </Button>
  {/snippet}
</SettingsCard>
