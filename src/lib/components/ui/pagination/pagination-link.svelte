<script>
	import { Pagination as PaginationPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	/** @type {{class?: any, page: any, size?: string, isActive?: boolean, children?: import('svelte').Snippet, [key: string]: any}} */
	let {
		class: className = undefined,
		page = $bindable(),
		size = 'icon',
		isActive = false,
		children,
		...rest
	} = $props();
	
</script>

<PaginationPrimitive.Page
	bind:page
	class={cn(
		buttonVariants({
			variant: isActive ? 'outline' : 'ghost',
			size
		}),
		className
	)}
	{...rest}
	on:click
>
	{#if children}{@render children()}{:else}{page.value}{/if}
</PaginationPrimitive.Page>
