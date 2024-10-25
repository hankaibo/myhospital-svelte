<script>
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	/** @type {{value?: any, children?: import('svelte').Snippet, [key: string]: any}} */
	let { value = $bindable(undefined), children, ...rest } = $props();
</script>

<DropdownMenuPrimitive.RadioGroup {...rest} bind:value>
	{@render children?.()}
</DropdownMenuPrimitive.RadioGroup>
