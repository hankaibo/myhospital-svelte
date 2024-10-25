<script>
	import { AspectRatio as AspectRatioPrimitive } from 'bits-ui';
	/** @type {{ratio?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { ratio = 16 / 9, children, ...rest } = $props();
</script>

<AspectRatioPrimitive.Root {ratio} {...rest}>
	{@render children?.()}
</AspectRatioPrimitive.Root>
