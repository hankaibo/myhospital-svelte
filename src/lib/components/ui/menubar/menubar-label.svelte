<script>
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, inset?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { class: className = undefined, inset = undefined, children, ...rest } = $props();
</script>

<MenubarPrimitive.Label
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
	{...rest}
>
	{@render children?.()}
</MenubarPrimitive.Label>
