<script>
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<span class={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</span>
