<script lang="ts">
  import { goto } from "$app/navigation";
  import { useBackNavigation } from "$lib/stores/stores";
  import LiquidGlass from "./LiquidGlass.svelte";
  import { ChevronLeftIcon } from "svelte-feather-icons";

  interface Props {
    exitPath?: string | undefined;
  }

  let { exitPath = undefined }: Props = $props();

  const backNavigation = useBackNavigation();

  function redirect() {
    backNavigation.set(true);
    if (exitPath) {
      goto(exitPath, { replaceState: true });
    } else {
      history.back();
    }
  }
</script>

<button type="button" onclick={redirect} aria-label="Go back" class="rounded-full">
  <LiquidGlass
    specular
    className="h-10 w-10 rounded-full flex items-center justify-center !bg-black/15 text-white transition-transform active:scale-95"
  >
    <ChevronLeftIcon size="24" />
  </LiquidGlass>
</button>
