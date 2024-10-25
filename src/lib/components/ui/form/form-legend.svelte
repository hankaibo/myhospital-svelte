<script>
	import * as FormPrimitive from 'formsnap';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet<[any]>, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<FormPrimitive.Legend {...rest} class={cn('text-sm font-medium leading-none data-[fs-error]:text-destructive', className)} >
	{#snippet children({ legendAttrs })}
		{@render children?.({ legendAttrs, })}
	{/snippet}
</FormPrimitive.Legend>
