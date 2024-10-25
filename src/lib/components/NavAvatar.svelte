<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button/index.js';
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Settings from 'lucide-svelte/icons/settings';
	import User from 'lucide-svelte/icons/user';
	import Sun from 'lucide-svelte/icons/sun';
	import MoonStar from 'lucide-svelte/icons/moon-star';
	import Monitor from 'lucide-svelte/icons/monitor';

	import { resetMode, setMode } from 'mode-watcher';

	const user = $page.data?.user;
	const src = user?.photo || `${base}/defavatar.png`;

	async function handleLogout() {
		const response = await fetch(`${base}/logout?/logout`, {
			method: 'POST',
			body: Object.create({}),
			headers: {
				'x-sveltekit-action': 'true'
			}
		});
		if (response.ok) {
			goto(`${base}/login`);
		} else {
			// 退出失败，你可以在这里处理错误
		}
	}
</script>

<DropdownMenu.Root>
	{#if user}
		<DropdownMenu.Trigger>
			<Avatar.Root>
				<Avatar.Image {src} alt="用户头像" />
				<Avatar.Fallback>未登录</Avatar.Fallback>
			</Avatar.Root>
		</DropdownMenu.Trigger>
	{:else}
		<Button variant="link" href="{base}/login">登录</Button>
	{/if}
	<DropdownMenu.Content class="w-56">
		{#if user}
			<DropdownMenu.Label>我的账户</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				{#if user.role.name === 'Admin'}
					<DropdownMenu.Item class="cursor-pointer" href="{base}/user">
						<User class="mr-2 h-4 w-4" />
						<span>控制台</span>
					</DropdownMenu.Item>
				{/if}
				<DropdownMenu.Item class="cursor-pointer" href="{base}/settings">
					<Settings class="mr-2 h-4 w-4" />
					<span>个人中心</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer">
				<LifeBuoy class="mr-2 h-4 w-4" />
				<span>支持</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item on:click={() => setMode('light')}>
				<Sun class="mr-2 h-4 w-4" />
				<span>浅色</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => setMode('dark')}>
				<MoonStar class="mr-2 h-4 w-4" />
				<span>深色</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => resetMode()}>
				<Monitor class="mr-2 h-4 w-4" />
				<span>自动</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item class="cursor-pointer">
				<LogOut class="mr-2 h-4 w-4" />
				<button onclick={handleLogout}>退出</button>
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
