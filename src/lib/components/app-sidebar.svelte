<script>
	import { resetMode, setMode } from 'mode-watcher';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		Users,
		House,
		Hospital,
		ChevronUp,
		LifeBuoy,
		Sun,
		MoonStar,
		Monitor,
		Settings,
		LogOut
	} from 'lucide-svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Avatar from '$lib/components/ui/avatar';

	// Menu items.
	const items = [
		{
			title: '首页',
			url: '#',
			icon: House
		},
		{
			title: '用户管理',
			url: 'user',
			icon: Users
		},
		{
			title: '医院管理',
			url: 'hospital',
			icon: Hospital
		}
	];

	const user = $page.data?.user;
	const src = user?.photo || `/defavatar.png`;

	async function handleLogout() {
		const response = await fetch(`/logout?/logout`, {
			method: 'POST',
			body: Object.create({}),
			headers: {
				'x-sveltekit-action': 'true'
			}
		});
		if (response.ok) {
			goto(`/login`);
		} else {
			// 退出失败，你可以在这里处理错误
		}
	}

	function foo() {
		console.log(123);
		setMode('light');
	}
</script>

<Sidebar.Root side="left" variant="sidebar" collapsible="icon">
	<Sidebar.Header>Hello world</Sidebar.Header>

	<Sidebar.Separator />

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>菜单</Sidebar.GroupLabel>
			<Sidebar.GroupContent class="w-[--bits-dropdown-menu-anchor-width]">
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>反馈</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							<LifeBuoy class="mr-2 h-4 w-4" />
							<span>支持</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>个性化</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem on:click={() => foo()}>
						<Sidebar.MenuButton>
							<Sun class="mr-2 h-4 w-4" />
							<span>浅色</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton on:click={() => setMode('dark')}>
							<MoonStar class="mr-2 h-4 w-4" />
							<span>深色</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton on:click={() => resetMode()}>
							<Monitor class="mr-2 h-4 w-4" />
							<span>自动</span>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Separator />

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar.Root>
									<Avatar.Image {src} alt="用户头像" />
								</Avatar.Root>
								<ChevronUp class="ml-auto" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
						<DropdownMenu.Item>
							<Settings class="mr-2 h-4 w-4" />
							<span>个人中心</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<LogOut class="mr-2 h-4 w-4" />
							<button on:click={handleLogout}>退出</button>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
