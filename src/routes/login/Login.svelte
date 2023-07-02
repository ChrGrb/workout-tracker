<script lang="ts">
  import Button from "$lib/base/Button.svelte";

  let email: string;
</script>

<form class="flex flex-col gap-8" method="POST">
  <div class="flex flex-col gap-3">
    <p>Enter your email to login</p>
    <input
      class="w-full bg-slate-200 rounded-md text-xl p-2"
      type="email"
      name="email"
      id="email"
      bind:value={email}
    />
  </div>
  <Button type="submit">Login</Button>
</form>
