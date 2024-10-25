<script>
	import { Separator as SeparatorPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any, orientation?: string, decorative?: any, [key: string]: any}} */
	let { class: className = undefined, orientation = 'horizontal', decorative = undefined, ...rest } = $props();
	
</script>

<SeparatorPrimitive.Root class={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'min-h-full w-[1px]', className)} {orientation} {decorative} {...rest} />
