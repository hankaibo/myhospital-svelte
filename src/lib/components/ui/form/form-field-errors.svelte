<script>
	import * as FormPrimitive from 'formsnap';
	import { cn } from '$lib/utils.js';
	
	/** @type {{class?: any, errorClasses?: any, children?: import('svelte').Snippet<[any]>, [key: string]: any}} */
	let { class: className = undefined, errorClasses = undefined, children, ...rest } = $props();
</script>

<FormPrimitive.FieldErrors class={cn('text-sm font-medium text-destructive', className)} {...rest}   >
	{#snippet children({ errors, fieldErrorsAttrs, errorAttrs })}
		{#if children}{@render children({ errors, fieldErrorsAttrs, errorAttrs, })}{:else}
			{#each errors as error}
				<div {...errorAttrs} class={cn(errorClasses)}>{error}</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
