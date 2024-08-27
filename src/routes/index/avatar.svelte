<script>
	import { cn } from '$lib/utils.js';
	import NavAvatar from '$lib/components/NavAvatar.svelte';

	let className = undefined;
</script>

<div class={cn('h-12 w-12', className)} {...$$restProps}>
	<NavAvatar></NavAvatar>
</div>
