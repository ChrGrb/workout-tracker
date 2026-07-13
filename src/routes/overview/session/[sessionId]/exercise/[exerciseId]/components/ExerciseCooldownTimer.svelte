<script lang="ts">
  import { run } from "svelte/legacy";

  import Headline from "$lib/base/Headline.svelte";
  import { onMount } from "svelte";
  import { X } from "lucide-svelte";
  import LiquidGlass from "$lib/base/LiquidGlass.svelte";

  interface Props {
    timer?: { exerciseId: string; startTime: number };
    finishAction: () => void;
    timerLength?: number;
  }

  let { timer, finishAction, timerLength = 30000 }: Props = $props();
  let remainingTime = $state(0);

  const updateTime = () => {
    if (!timer) return;

    remainingTime = timer.startTime + timerLength - Date.now();

    if (remainingTime <= 0 && timerInterval) {
      clearInterval(timerInterval);
      finishAction();
    }
  };

  let timerInterval = setInterval(updateTime, 1000);

  onMount(() => updateTime());

  let minutes = $state("00");
  let seconds = $state("00");

  run(() => {
    if (remainingTime <= 0) {
      minutes = "00";
      seconds = "00";
    } else {
      let secondsTemp = Math.floor((remainingTime / 1000) % 60);
      let minutesTemp = Math.floor((remainingTime / (1000 * 60)) % 60);

      minutes = (minutesTemp < 10 ? "0" : "") + minutesTemp;
      seconds = (secondsTemp < 10 ? "0" : "") + secondsTemp;
    }
  });
</script>

<LiquidGlass
  className="relative flex items-center justify-between gap-3 rounded-full py-2 pl-6 pr-2 !bg-black/15 text-white"
>
  <div class="font-mono font-medium tabular-nums">
    <Headline style="medium" classes="font-mono">{minutes}:{seconds}</Headline>
  </div>
  <!-- Apple-style close button: a small light-gray fill with a dark-gray glyph. -->
  <button
    type="button"
    onclick={finishAction}
    aria-label="Cancel timer"
    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e5e5ea]/90 text-[#48484a] transition-transform active:scale-90 hover:bg-[#e5e5ea]"
  >
    <X size="16" strokeWidth={2.5} />
  </button>
</LiquidGlass>
