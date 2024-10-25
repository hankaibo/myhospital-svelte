<script>
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, count?: number, perPage?: number, page?: number, siblingCount?: number, children?: import('svelte').Snippet<[any]>, [key: string]: any}} */
	let {
		class: className = undefined,
		count = 0,
		perPage = 10,
		page = $bindable(1),
		siblingCount = 1,
		children,
		...rest
	} = $props();
	
	let currentPage = $derived(page);
</script>

<PaginationPrimitive.Root {count} {perPage} {siblingCount} bind:page    asChild {...rest}>
	{#snippet children({ builder, pages, range })}
		<nav {...builder} class={cn('mx-auto flex w-full flex-col items-center', className)}>
			{@render children?.({ pages, range, currentPage, })}
		</nav>
	{/snippet}
</PaginationPrimitive.Root>
