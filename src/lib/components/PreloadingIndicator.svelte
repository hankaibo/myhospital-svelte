<script>
	import { onMount } from 'svelte';

	let p = 0;
	let visible = false;

	onMount(() => {
		visible = true;
		function next() {
			p += 0.1;
			const remaining = 1 - p;
			if (remaining > 0.15) {
				setTimeout(next, 500 / remaining);
			}
		}
		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div class="absolute left-0 top-0 z-50 h-1 w-full">
		<div class="absolute left-0 top-0 h-full bg-[#5cb85c] transition-all" style="width: {p * 100}%"></div>
	</div>
{/if}

{#if p >= 0.4}
	<div class="pointer-events-none fixed z-40 h-full w-full animate-fade bg-[rgba(255,255,255,0.3)]"></div>
{/if}
