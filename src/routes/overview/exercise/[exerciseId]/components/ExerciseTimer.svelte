<script lang="ts">
  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import clsx from "clsx";
  import { XIcon } from "svelte-feather-icons";

  export let timer: { exerciseId: string; startTime: number };
  export let finishAction: () => void;

  export let timerLength = 30000;
  let remainingTime = 0;

  let timerInterval = setInterval(() => {
    remainingTime = timer.startTime + timerLength - Date.now();

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      finishAction();
    }
  }, 10);

  let minutes = "00";
  let seconds = "00";
  let milliseconds = "000";

  $: {
    if (remainingTime <= 0) {
      minutes = "00";
      seconds = "00";
      milliseconds = "000";
    } else {
      let millisecondsTemp = Math.floor(remainingTime % 1000);
      let secondsTemp = Math.floor((remainingTime / 1000) % 60);
      let minutesTemp = Math.floor((remainingTime / (1000 * 60)) % 60);

      minutes = (minutesTemp < 10 ? "0" : "") + minutesTemp;
      seconds = (secondsTemp < 10 ? "0" : "") + secondsTemp;
      milliseconds =
        (millisecondsTemp < 100 ? (millisecondsTemp < 10 ? "00" : "0") : "") +
        millisecondsTemp;
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
      <XIcon size="24" class="text-on-primary-token" />
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
        >{minutes} : {seconds} : {milliseconds}</Headline
      >
    </div>
  </div>
</div>
