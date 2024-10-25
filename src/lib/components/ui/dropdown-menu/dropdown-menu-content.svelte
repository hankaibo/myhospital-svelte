<script>
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { cn, flyAndScale } from '$lib/utils.js';
	/** @type {{class?: any, sideOffset?: number, transition?: any, transitionConfig?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		class: className = undefined,
		sideOffset = 4,
		transition = flyAndScale,
		transitionConfig = undefined,
		children,
		...rest
	} = $props();
	
</script>

<DropdownMenuPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn('z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none', className)}
	{...rest}
	on:keydown
>
	{@render children?.()}
</DropdownMenuPrimitive.Content>
