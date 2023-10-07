<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "./Button.svelte";
  import { ChevronLeftIcon, XIcon } from "svelte-feather-icons";

  export let exitPath: string;

  function redirect() {
    goto(exitPath);
  }
</script>

<div class="z-50 flex flex-col justify-center">
  <Button
    action={redirect}
    icon={true}
    loadingOnClick={true}
    classes="aspect-auto w-auto my-auto"
  >
    <ChevronLeftIcon size="32" />
  </Button>
</div>
