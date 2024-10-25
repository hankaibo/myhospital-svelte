<script module></script>

<script>
	import * as FormPrimitive from 'formsnap';
	import { cn } from '$lib/utils.js';
	/** @type {{form: any, name: any, class?: any, children?: import('svelte').Snippet<[any]>}} */
	let {
		form,
		name,
		class: className = undefined,
		children
	} = $props();
	
</script>

<FormPrimitive.Field {form} {name}    >
	{#snippet children({ constraints, errors, tainted, value })}
		<div class={cn('space-y-2', className)}>
			{@render children?.({ constraints, errors, tainted, value, })}
		</div>
	{/snippet}
</FormPrimitive.Field>
