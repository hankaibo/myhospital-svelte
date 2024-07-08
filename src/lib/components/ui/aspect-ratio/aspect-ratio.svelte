<script>
	import { AspectRatio as AspectRatioPrimitive } from 'bits-ui';
	export let ratio = 16 / 9;
</script>

<AspectRatioPrimitive.Root {ratio} {...$$restProps}>
	<slot />
</AspectRatioPrimitive.Root>
