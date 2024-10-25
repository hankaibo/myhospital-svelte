<script>
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, inset?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, inset = undefined, children, ...rest } = $props();
	
</script>

<MenubarPrimitive.SubTrigger
	class={cn(
		'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground data-[disabled]:opacity-50',
		inset && 'pl-8',
		className
	)}
	on:click
	{...rest}
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	{@render children?.()}
	<ChevronRight class="ml-auto h-4 w-4" />
</MenubarPrimitive.SubTrigger>
