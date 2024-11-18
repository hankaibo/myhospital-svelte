<script>
	import * as Switch from '$lib/components/ui/switch/index.js';

	/** @type {{checked?: boolean, controlledChecked: boolean,}} */
	let { checked = false, controlledChecked = true, ...restProps } = $props();
</script>

<Switch.Root {checked} {controlledChecked} {...restProps}>
	<Switch.Thumb />
</Switch.Root>
