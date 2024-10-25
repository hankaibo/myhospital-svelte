<script>
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn, flyAndScale } from '$lib/utils.js';
	/** @type {{class?: any, sideOffset?: number, alignOffset?: any, align?: string, side?: string, transition?: any, transitionConfig?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		class: className = undefined,
		sideOffset = 8,
		alignOffset = -4,
		align = 'start',
		side = 'bottom',
		transition = flyAndScale,
		transitionConfig = undefined,
		children,
		...rest
	} = $props();
	
</script>

<MenubarPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	{align}
	{alignOffset}
	{side}
	class={cn('z-50 min-w-[12rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none', className)}
	{...rest}
	on:keydown
>
	{@render children?.()}
</MenubarPrimitive.Content>
