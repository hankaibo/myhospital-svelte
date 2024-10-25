<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { writable } from 'svelte/store';

	/** @type {{checked?: any}} */
	let { checked = writable(false) } = $props();
</script>

<Checkbox bind:checked={$checked} />
