<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { Search, Bell, Mail, AlignJustify } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import NavAvatar from '../NavAvatar.svelte';
	import { sidebarOpen } from '../../../stores/sidebarStore';
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<header class={cn('fixed left-0 right-0 top-0 z-50 w-full flex border-border/40 bg-background/95 pr-4 md:pr-8 print:hidden', className)}>
	<a class="content-center px-4 text-center text-2xl no-underline md:block md:w-60 md:flex-0" href="/">Vue</a>
	<a class="-order-1 content-center px-4 text-white transition-all md:order-none" href="#" data-toggle="sidebar" aria-label="Hide Sidebar" on:click={() => sidebarOpen.update((n) => !n)}>
		<AlignJustify />
	</a>
	<ul class="flex items-center space-x-4 ml-auto">
		<li class="flex items-center">
			<Input type="search" placeholder="search..." />
			<Search />
		</li>
		<li class="dropdown">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger><Bell /></DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Group>
						<DropdownMenu.Label>You have 4 new notifications.</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<Mail class="mr-2 h-4 w-4" />
							<span>Lisa sent you a mail</span>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Label>You have 4 new notifications.</DropdownMenu.Label>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</li>
		<li class="dropdown">
			<NavAvatar></NavAvatar>
		</li>
	</ul>
</header>
