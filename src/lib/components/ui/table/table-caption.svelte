<script>
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<caption class={cn('mt-4 text-sm text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</caption>
