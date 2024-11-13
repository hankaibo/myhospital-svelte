<script>
	import { navigating } from '$app/stores';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Sidebar.Provider>
	<AppSidebar />
	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
