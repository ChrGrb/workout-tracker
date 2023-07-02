<script lang="ts">
  import Headline from "$lib/base/Headline.svelte";
  import Login from "./Login.svelte";
  import type { Prisma } from "@prisma/client";
  import { goto } from "$app/navigation";

  async function loginAction(email: string) {
    console.log(email);
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email }),
      headers: {
        "content-type": "application/json",
      },
    });
  }
</script>

<div class="flex flex-col p-5 justify-between h-screen">
  <Headline>Workout<br />Tracker</Headline>
  <Login />
</div>
