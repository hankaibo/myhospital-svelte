<script>
	import { ModeWatcher } from 'mode-watcher';
	import { navigating } from '$app/state';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import '../app.css';

	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

{#if navigating}
	<PreloadingIndicator />
{/if}

<ModeWatcher />
{@render children?.()}
