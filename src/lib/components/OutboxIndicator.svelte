<script lang="ts">
  import { pendingWrites } from "$lib/zero/outbox";
  import { getZOrUndefined } from "$lib/zero/z.svelte";

  const connectionState = $derived(
    getZOrUndefined()?.connectionState.name ?? "connecting",
  );
  const pending = $derived($pendingWrites.length);
  const offline = $derived(connectionState !== "connected");
</script>

{#if offline || pending > 0}
  <div
    class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-surface-800 px-4 py-2 text-sm text-white shadow-lg"
    role="status"
  >
    {#if offline}
      Offline{pending > 0 ? ` — ${pending} change${pending === 1 ? "" : "s"} queued` : ""}
    {:else}
      Syncing {pending} change{pending === 1 ? "" : "s"}…
    {/if}
  </div>
{/if}
