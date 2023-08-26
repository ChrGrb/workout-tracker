<script lang="ts">
  import { invalidate } from "$app/navigation";
  import Headline from "$lib/base/Headline.svelte";
  import RadioSelect from "$lib/base/input/RadioSelect.svelte";
  import TextInput from "$lib/base/input/TextInput.svelte";
  import SubmitFormWrapper from "$lib/components/forms/SubmitFormWrapper.svelte";
  import { useSettings } from "$lib/stores/stores";
  import type { User, Settings } from "@prisma/client";
  import SettingsCard from "./components/SettingsCard.svelte";

  export let user: User & { settings: Settings };

  let duration = (user.settings.timerValue / 1000).toString();
  let enabled = user.settings.useTimer.toString();

  let durationComp = duration;
  let enabledComp = enabled;

  let settings = useSettings();

  $: isButtonDisabled = duration == durationComp && enabled == enabledComp;
</script>

<SettingsCard>
  <svelte:fragment slot="headline">Cooldown Timer</svelte:fragment>
  <svelte:fragment slot="content">
    <SubmitFormWrapper
      action="?/updateTimerSettings"
      {isButtonDisabled}
      resetOnSubmit={false}
      formCallbackFunction={() => {
        durationComp = duration;
        enabledComp = enabled;

        settings.update((settings) => {
          settings.useTimer = enabled == "true";
          settings.timerValue = +duration;

          return settings;
        });
      }}
      floatingSubmitbutton={false}
    >
      <div class="flex flex-col gap-4" slot="form-content">
        <RadioSelect
          items={[
            { name: "Enable", value: "true" },
            { name: "Disable", value: "false" },
          ]}
          name="timerEnabled"
          id="timerEnabled"
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
        <input type="text" name="userId" value={user.id} class="hidden" />
      </div>
      <p slot="button-content">Update</p>
    </SubmitFormWrapper>
  </svelte:fragment>
</SettingsCard>
