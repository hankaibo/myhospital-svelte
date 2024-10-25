<script>
	import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';
	/** @type {{children?: import('svelte').Snippet, [key: string]: any}} */
	let { children, ...rest } = $props();
</script>

<AlertDialogPrimitive.Portal {...rest}>
	{@render children?.()}
</AlertDialogPrimitive.Portal>
