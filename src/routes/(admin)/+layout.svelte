<script>
	import { navigating } from '$app/stores';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Transition from '$lib/components/layout/Transition.svelte';
	import { sidebarOpen } from '../../stores/sidebarStore';

	/** @type {{data: any, children?: import('svelte').Snippet}} */
	let { data, children } = $props();
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Navbar />

<Sidebar />
<main class="mt-[60px] min-h-[calc(100vh-60px)] {$sidebarOpen ? 'ml-60' : 'ml-12'}">
	<Transition key={data.pathname} duration={400}>
		{@render children?.()}
	</Transition>
</main>
