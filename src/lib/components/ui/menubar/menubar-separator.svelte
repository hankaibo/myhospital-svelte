<script>
	import { Menubar as MenubarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, [key: string]: any}} */
	let { class: className = undefined, ...rest } = $props();
	
</script>

<MenubarPrimitive.Separator class={cn('-mx-1 my-1 h-px bg-muted', className)} {...rest} />
