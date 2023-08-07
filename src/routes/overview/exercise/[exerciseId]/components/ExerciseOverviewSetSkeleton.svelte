<script>
  import Headline from "$lib/base/Headline.svelte";
</script>

<div class="flex flex-col w-full gap-4">
  <div class="flex flex-row justify-between items-center">
    <Headline style="small">Sets</Headline>
    <div class="placeholder animate-pulse w-[43px] h-[43px]" />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    <div class="placeholder animate-pulse h-[147px] w-full" />
    <div class="placeholder animate-pulse h-[147px] w-full" />
  </div>
</div>

<div class="placeholder animate-pulse w-full h-[42px]" />
