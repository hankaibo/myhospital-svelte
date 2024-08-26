<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import LogOut from 'lucide-svelte/icons/log-out';

	let className = undefined;
	const user = $page.data?.user;
	const src = user?.photo || `${base}/defavatar.png`;
</script>

<div class={cn('h-12 w-12', className)} {...$$restProps}>
	<Popover.Root>
		<Popover.Trigger>
			<Avatar.Root>
				<Avatar.Image {src} alt="用户头像" />
				<Avatar.Fallback>未登录</Avatar.Fallback>
			</Avatar.Root>
		</Popover.Trigger>
		<Popover.Content>
			{#if user}
				<form method="post" action="{base}/logout?/logout">
					<div class="flex cursor-pointer flex-col items-center">
						<Button variant="outline" size="icon" type="submit">
							<LogOut class="mr-2 h-4 w-4" />
						</Button>
					</div>
				</form>
			{:else}
				<Button variant="link" href="{base}/login" class="w-full">登录</Button>
			{/if}
		</Popover.Content>
	</Popover.Root>
</div>
