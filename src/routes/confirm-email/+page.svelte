<script>
	import { onMount } from 'svelte';
	import * as api from '$lib/api.js';

	/** @type {string} */
	let hash;

	let confirmationMessage = '';

	async function confirmEmail() {
		try {
			const response = await api.post('/auth/email/confirm', { hash });
			if (response.success) {
				confirmationMessage = '邮箱已确认！';
			} else {
				confirmationMessage = '确认失败，请检查链接或联系支持。';
			}
		} catch (error) {
			confirmationMessage = '网络请求出错，请稍后再试。';
		}
	}

	onMount(() => {
		const urlHash = window.location.hash.replace('#', '');
		hash = urlHash || '';
		confirmEmail();
	});
</script>

<div>
	{#if confirmationMessage}
		<p>{confirmationMessage}</p>
	{:else}
		<p>正在加载...</p>
	{/if}
</div>
