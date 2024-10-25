<script>
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import { cn, flyAndScale } from '$lib/utils.js';
	/** @type {{class?: any, transition?: any, transitionConfig?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		class: className = undefined,
		transition = flyAndScale,
		transitionConfig = undefined,
		children,
		...rest
	} = $props();
	
</script>

<PopoverPrimitive.Content {transition} {transitionConfig} class={cn('z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none', className)} {...rest}>
	{@render children?.()}
</PopoverPrimitive.Content>
