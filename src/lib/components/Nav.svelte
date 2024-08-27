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

		{#if $page.data.user?.role?.name === 'Admin'}
			<Menubar.Menu>
				<Menubar.Item href="{base}/user"><Button variant="link">用户管理</Button></Menubar.Item>
			</Menubar.Menu>
		{/if}

		<Menubar.Menu>
			<Menubar.Item href="{base}/about"><Button variant="link">关于</Button></Menubar.Item>
		</Menubar.Menu>
	</Menubar.Root>

	<NavAvatar></NavAvatar>
</nav>
