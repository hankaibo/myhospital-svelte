<script>
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<MenubarPrimitive.Root class={cn('flex h-10 items-center space-x-1 bg-background p-1', className)} {...rest}>
	{@render children?.()}
</MenubarPrimitive.Root>
