<script lang="ts">
  import { goto } from "$app/navigation";
  import { useBackNavigation } from "$lib/stores/stores";
  import Button from "./Button.svelte";
  import { ChevronLeftIcon } from "svelte-feather-icons";

  export let exitPath: string;

  const backNavigation = useBackNavigation();

  function redirect() {
    backNavigation.set(true);
    goto(exitPath);
  }
</script>

<div class="z-50 flex flex-col justify-center">
  <Button action={redirect} icon={true} classes="aspect-auto w-auto my-auto">
    <ChevronLeftIcon size="32" />
  </Button>
</div>
