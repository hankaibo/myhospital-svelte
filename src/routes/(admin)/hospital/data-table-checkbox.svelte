<script>
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { writable } from 'svelte/store';

	export let checked = writable(false);
</script>

<Checkbox bind:checked={$checked} />
