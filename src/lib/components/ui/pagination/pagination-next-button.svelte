<script>
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, children, ...rest } = $props();
	
</script>

<PaginationPrimitive.NextButton asChild >
	{#snippet children({ builder })}
		<Button variant="ghost" class={cn('gap-1 pr-2.5', className)} builders={[builder]} on:click {...rest}>
			{#if children}{@render children()}{:else}
				<span>下一页</span>
				<ChevronRight class="h-4 w-4" />
			{/if}
		</Button>
	{/snippet}
</PaginationPrimitive.NextButton>
