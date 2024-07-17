<script>
	import { page } from '$app/stores';
	import * as Menubar from '$lib/components/ui/menubar';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Settings from 'lucide-svelte/icons/settings';
	import User from 'lucide-svelte/icons/user';

	$: activeUrl = $page.url.pathname;
</script>

<nav class="flex flex-wrap items-center justify-between border-b border-gray-200 bg-white p-4">
	<div class="flex items-center">
		<slot name="brand" />
	</div>

	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Item href="/" active={activeUrl === '/'}><Button variant="link">首页</Button></Menubar.Item>
		</Menubar.Menu>

		{#if $page.data.user?.role?.name === 'Admin'}
			<Menubar.Menu>
				<Menubar.Item href="/user"><Button variant="link">用户管理</Button></Menubar.Item>
			</Menubar.Menu>
		{/if}

		<Menubar.Menu>
			<Menubar.Item href="/about"><Button variant="link">关于</Button></Menubar.Item>
		</Menubar.Menu>
	</Menubar.Root>

	<DropdownMenu.Root>
		{#if $page.data.user}
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Image src={$page.data.user.photo} alt="用户头像" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
		{:else}
			<Button variant="link" href="/login">登录</Button>
		{/if}
		<DropdownMenu.Content class="w-56">
			{#if $page.data.user}
				<DropdownMenu.Label>我的账户</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<User class="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenu.Item>
					<DropdownMenu.Item href="/settings">
						<Settings class="mr-2 h-4 w-4" />
						<span>设置</span>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LifeBuoy class="mr-2 h-4 w-4" />
					<span>支持</span>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOut class="mr-2 h-4 w-4" />
					<slot name="logout" />
				</DropdownMenu.Item>
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</nav>
