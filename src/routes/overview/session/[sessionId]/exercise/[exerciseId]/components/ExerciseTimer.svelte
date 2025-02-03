<script lang="ts">
  import { run } from "svelte/legacy";

  import Button from "$lib/base/Button.svelte";
  import Headline from "$lib/base/Headline.svelte";
  import clsx from "clsx";
  import { onMount } from "svelte";
  import { XIcon } from "svelte-feather-icons";

  interface Props {
    timer: { exerciseId: string; startTime: number };
    finishAction?: (elapsedTime: number) => void;
    onFinish?: () => void;
    elapsedTime?: number;
  }

  let {
    timer,
    finishAction,
    onFinish = $bindable(),
    elapsedTime = $bindable(0),
  }: Props = $props();

  const updateTime = () => {
    elapsedTime = Date.now() - timer.startTime;
  };

  let timerInterval = setInterval(updateTime, 1000);

  onMount(() => {
    updateTime();
    onFinish = () => {
      clearInterval(timerInterval);
      if (finishAction) finishAction(elapsedTime);
    };
  });

  let minutes = $state("00");
  let seconds = $state("00");

  run(() => {
    if (elapsedTime <= 0) {
      minutes = "00";
      seconds = "00";
    } else {
      let secondsTemp = Math.floor((elapsedTime / 1000) % 60);
      let minutesTemp = Math.floor((elapsedTime / (1000 * 60)) % 60);

      minutes = (minutesTemp < 10 ? "0" : "") + minutesTemp;
      seconds = (secondsTemp < 10 ? "0" : "") + secondsTemp;
    }
  });
</script>

<div
  class={clsx(
    "card flex flex-col gap-8 justify-center py-4 pl-8 px-4 md:p-6 variant-soft-primary relative shadow-sm"
  )}
>
  <div class="absolute top-2 right-2 z-50"></div>
  <div class="flex flex-row gap-4 items-center md:items-end justify-between">
    <div class="flex flex-row font-medium font-mono">
      <Headline style="medium" classes="font-mono"
        >{minutes} : {seconds}</Headline
      >
    </div>
    <Button
      action={() => {
        if (finishAction) finishAction(elapsedTime);
      }}
      icon={true}
      loadingOnClick={true}
    >
      <XIcon size="24" />
    </Button>
  </div>
</div>
