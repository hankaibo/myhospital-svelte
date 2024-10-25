<script>
	import * as FormPrimitive from 'formsnap';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet<[any]>, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<FormPrimitive.Description class={cn('text-sm text-muted-foreground', className)} {...rest} >
	{#snippet children({ descriptionAttrs })}
		{@render children?.({ descriptionAttrs, })}
	{/snippet}
</FormPrimitive.Description>
