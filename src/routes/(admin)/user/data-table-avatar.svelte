<script>
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	/** @type {{src: string}} */
	let { src } = $props();
</script>

<Avatar.Root class="">
	<Avatar.Image class="" {src} alt="用户头像缩略图" />
	<Avatar.Fallback class="">CN</Avatar.Fallback>
</Avatar.Root>
