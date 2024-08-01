<script>
	import { navigating } from '$app/stores';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import '../app.css';
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<main>
	<slot />
</main>
