<script>
	import { navigating } from '$app/stores';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Transition from '$lib/components/layout/Transition.svelte';

	export let data;
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<!-- Navbar -->
<Navbar />

<!-- Sidebar -->
<Sidebar />
<main>
	<Transition key={data.pathname} duration={400}>
		<slot />
	</Transition>
</main>
