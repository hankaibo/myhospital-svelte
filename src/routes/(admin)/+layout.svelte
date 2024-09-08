<script>
	import { navigating } from '$app/stores';
	import Nav from '$lib/components/Nav.svelte';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Nav>
	<svelte:fragment slot="brand">
		<img src="https://www.gov.cn/images/gtrs_logo_lt.png" class="mr-3 h-6 sm:h-9" alt="Svelte Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">医保</span>
	</svelte:fragment>
</Nav>

<main class="container mx-auto py-10">
	<slot />
</main>
