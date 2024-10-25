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

<FormPrimitive.Fieldset {form} {name}     class={cn('space-y-2', className)}>
	{#snippet children({ constraints, errors, tainted, value })}
		{@render children?.({ constraints, errors, tainted, value, })}
	{/snippet}
</FormPrimitive.Fieldset>
