<script>
	import * as Avatar from '$lib/components/ui/avatar/index.js';

	export let src;
</script>

<Avatar.Root>
	<Avatar.Image src={$src} alt="用户头像缩略图" />
	<Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>
