<script>
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { items } = $props();
</script>

<Sidebar.Group class="">
	<Sidebar.GroupLabel class="">菜单</Sidebar.GroupLabel>
	<Sidebar.GroupContent class="w-[--bits-dropdown-menu-anchor-width]">
		<Sidebar.Menu class="">
			{#each items as item (item.title)}
				<Sidebar.MenuItem class="">
					<Sidebar.MenuButton class="">
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
