<script lang="ts">
  import { cn } from "$lib/utils.js";
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { liquidGlassFilter } from "$lib/base/liquidGlass";

  let {
    ref = $bindable(null),
    sideOffset = 4,
    portalProps,
    class: className,
    ...restProps
  }: DropdownMenuPrimitive.ContentProps & {
    portalProps?: DropdownMenuPrimitive.PortalProps;
  } = $props();

  // Apply the liquid-glass refraction to the portalled content element itself
  // (it can't be wrapped in <LiquidGlass> without breaking positioning). The
  // action injects its SVG filter into <body>, so the portal is no obstacle.
  $effect(() => {
    const node = ref;
    if (!node) return;
    const handle = liquidGlassFilter(node, { bezel: 20, scale: 8, blur: 6 });
    return () => handle.destroy();
  });
</script>

<DropdownMenuPrimitive.Portal {...portalProps}>
  <DropdownMenuPrimitive.Content
    bind:ref
    {sideOffset}
    class={cn(
      "text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] rounded-2xl p-1.5 outline-none bg-white/30 backdrop-blur-md backdrop-filter shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] border border-white/30 overflow-hidden",
      className,
    )}
    {...restProps}
  />
</DropdownMenuPrimitive.Portal>
