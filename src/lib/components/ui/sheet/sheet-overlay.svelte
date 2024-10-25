<script>
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, transition?: any, transitionConfig?: any, [key: string]: any}} */
	let { class: className = undefined, transition = fade, transitionConfig = {
		duration: 150
	}, ...rest } = $props();
	
</script>

<SheetPrimitive.Overlay {transition} {transitionConfig} class={cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ', className)} {...rest} />
