<script>
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<SheetPrimitive.Portal class={cn(className)} {...rest}>
	{@render children?.()}
</SheetPrimitive.Portal>
