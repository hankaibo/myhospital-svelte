<script>
	import { Input } from '$lib/components/ui/input/index.js';
	import { Search, Bell, Mail, AlignJustify } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import NavAvatar from '../NavAvatar.svelte';
	import { sidebarOpen } from '../../../stores/sidebarStore';
	import { cn } from '$lib/utils.js';
	/** @type {{class?: any}} */
	let { class: className = undefined } = $props();
	
</script>

<header
	class={cn('sticky left-0 right-0 top-0 z-50 flex w-full border-b border-border/40 bg-background/95 pr-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:pr-8 print:hidden', className)}
>
	<a class="shrink-0 grow basis-auto content-center px-4 text-center text-2xl md:block md:w-60 md:grow-0" href="/">Vue</a>
	<a class="-order-1 content-center px-4 transition-all md:order-none" href="#" data-toggle="sidebar" aria-label="Hide Sidebar" onclick={() => sidebarOpen.update((n) => !n)}>
		<AlignJustify />
	</a>
	<ul class="mb-0 flex justify-end space-x-4 pl-0 md:shrink-0 md:grow md:basis-auto">
		<li class="relative hidden self-center py-2.5 sm:flex">
			<Input type="search" placeholder="search..." class="pr-7.5 rounded-sm py-1 pl-2.5 transition-all " />
			<Search class="absolute bottom-2.5 right-0 top-2.5 border-0 bg-none text-[#000c]" />
		</li>
		<li class="content-center">
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
		<li class="content-center">
			<NavAvatar></NavAvatar>
		</li>
	</ul>
</header>
