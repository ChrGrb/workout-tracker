<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import clsx from "clsx";
  import { onMount } from "svelte";
  import { XIcon } from "svelte-feather-icons";

  export let timer: { exerciseId: string; startTime: number };
  export let finishAction: () => void;

  export let timerLength = 30000;
  let remainingTime = 0;

  const updateTime = () => {
    remainingTime = timer.startTime + timerLength - Date.now();

    if (remainingTime <= 0 && timerInterval) {
      clearInterval(timerInterval);
      finishAction();
    }
  };

  let timerInterval = setInterval(updateTime, 1000);

  onMount(() => updateTime());

  let minutes = "00";
  let seconds = "00";

  $: {
    if (remainingTime <= 0) {
      minutes = "00";
      seconds = "00";
    } else {
      let secondsTemp = Math.floor((remainingTime / 1000) % 60);
      let minutesTemp = Math.floor((remainingTime / (1000 * 60)) % 60);

      minutes = (minutesTemp < 10 ? "0" : "") + minutesTemp;
      seconds = (secondsTemp < 10 ? "0" : "") + secondsTemp;
    }
  }
</script>

<div
  class={clsx(
    "card flex flex-col gap-8 justify-center py-4 px-4 md:p-6 variant-soft-primary bg-gradient-to-tr from-secondary-100 via-surface-50 to-tertiary-100 dark:from-secondary-900 dark:via-surface-900 dark:to-tertiary-900 relative shadow-sm"
  )}
>
  <div class="absolute top-2 right-2 z-50">
    <Button action={finishAction} icon={true} loadingOnClick={true}>
      <XIcon size="24" />
    </Button>
  </div>
  <div class="flex flex-col md:flex-row gap-4 md:items-end justify-between">
    <div class="flex flex-col gap-2">
      <Headline style="small">Timer</Headline>
      <p>Take a break until you start your next set</p>
    </div>
    <div
      class="flex flex-row font-medium font-mono w-full md:w-auto justify-center md:justify-end"
    >
      <Headline style="medium" classes="font-mono"
        >{minutes} : {seconds}</Headline
      >
    </div>
  </div>
</div>
