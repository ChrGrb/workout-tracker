<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "./Button.svelte";
  import { XIcon } from "svelte-feather-icons";

  export let exitPath: string;

  function redirect() {
    goto(exitPath);
  }
</script>

<div class="absolute top-5 right-5 z-50">
  <Button action={redirect} icon={true} loadingOnClick={true}>
    <XIcon size="24" />
  </Button>
</div>
