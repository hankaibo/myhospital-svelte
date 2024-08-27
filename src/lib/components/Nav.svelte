<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import * as Menubar from '$lib/components/ui/menubar';
	import { Button } from '$lib/components/ui/button';
	import NavAvatar from './NavAvatar.svelte';

	$: activeUrl = $page.url.pathname;
</script>

<nav class="flex flex-wrap items-center justify-between border-b border-gray-200 bg-white p-4">
	<div class="flex items-center">
		<slot name="brand" />
	</div>

	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Item href="{base}/" active={activeUrl === '/'}><Button variant="link">首页</Button></Menubar.Item>
		</Menubar.Menu>

		<Menubar.Menu>
			<Menubar.Item href="{base}/user"><Button variant="link">用户管理</Button></Menubar.Item>
		</Menubar.Menu>

		<Menubar.Menu>
			<Menubar.Item href="{base}/hospital"><Button variant="link">医院管理</Button></Menubar.Item>
		</Menubar.Menu>
	</Menubar.Root>

	<NavAvatar></NavAvatar>
</nav>
