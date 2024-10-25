<script>
	import * as Button from '$lib/components/ui/button/index.js';
	/** @type {{children?: import('svelte').Snippet, [key: string]: any}} */
	let { children, ...rest } = $props();
</script>

<Button.Root type="submit" on:click on:keydown {...rest}>
	{@render children?.()}
</Button.Root>
