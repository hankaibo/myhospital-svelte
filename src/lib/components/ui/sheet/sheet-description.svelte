<script>
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<SheetPrimitive.Description class={cn('text-sm text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</SheetPrimitive.Description>
