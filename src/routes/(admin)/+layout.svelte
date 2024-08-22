<script>
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';
	import { base } from '$app/paths';
	import Nav from '$lib/components/Nav.svelte';
	import PreloadingIndicator from '$lib/components/PreloadingIndicator.svelte';

	async function handleLogout() {
		const response = await fetch('/logout?/logout', {
			method: 'POST',
			body: Object.create({}),
			headers: {
				'x-sveltekit-action': 'true'
			}
		});
		if (response.ok) {
			goto(`${base}/login`);
		} else {
			// 退出失败，你可以在这里处理错误
		}
	}
</script>

{#if $navigating}
	<PreloadingIndicator />
{/if}

<Nav>
	<svelte:fragment slot="brand">
		<img src="https://www.gov.cn/images/gtrs_logo_lt.png" class="mr-3 h-6 sm:h-9" alt="Svelte Logo" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">医保</span>
	</svelte:fragment>
	<svelte:fragment slot="logout">
		<button on:click={handleLogout}>退出</button>
	</svelte:fragment>
</Nav>

<main>
	<slot />
</main>
