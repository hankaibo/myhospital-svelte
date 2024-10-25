<script>
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet<[any]>, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<AlertDialogPrimitive.Cancel class={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)} {...rest} on:click on:keydown >
	{#snippet children({ builder })}
		{@render children?.({ builder, })}
	{/snippet}
</AlertDialogPrimitive.Cancel>
