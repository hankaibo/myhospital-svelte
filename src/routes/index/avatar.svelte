<script>
	import { cn } from '$lib/utils.js';
	import NavAvatar from '$lib/components/NavAvatar.svelte';
	/** @type {{[key: string]: any}} */
	let { ...rest } = $props();

	let className = undefined;
</script>

<div class={cn('h-12 w-12', className)} {...rest}>
	<NavAvatar></NavAvatar>
</div>
