<script>
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, level?: string, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, level = 'h3', children, ...rest } = $props();
	
</script>

<AlertDialogPrimitive.Title class={cn('text-lg font-semibold', className)} {level} {...rest}>
	{@render children?.()}
</AlertDialogPrimitive.Title>
