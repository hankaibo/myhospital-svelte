<script>
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	/** @type {{checked?: boolean, controlledChecked: boolean,}} */
	let { checked = false, controlledChecked = true, ...restProps } = $props();
</script>

<Checkbox class="" {checked} {controlledChecked} {...restProps} />
