<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { sidebarOpen } from '../../../stores/sidebarStore';

	// Fungsi untuk memeriksa apakah suatu elemen menu aktif
	$: isActive = (/** @type {any} */ item) => {
		const currentPath = $page.url.pathname;
		return item.link === currentPath || (item.submenu && item.submenu.some((/** @type {{ link: string; }} */ subitem) => subitem.link === currentPath));
	};

	const dataMenu = [
		{
			label: 'Dashboard',
			icon: 'bi bi-speedometer',
			link: '/dashboard'
		},
		{
			label: 'UI Elements',
			icon: 'bi bi-laptop',
			submenu: [
				{
					label: 'Bootstrap Elements',
					icon: 'bi bi-circle-fill',
					link: '/bootstrap-components'
				},
				{
					label: 'Font Icons',
					icon: 'bi bi-circle-fill',
					link: 'https://icons.getbootstrap.com/',
					target: '_blank',
					rel: 'noopener'
				},
				{
					label: 'Cards',
					icon: 'bi bi-circle-fill',
					link: '/cards'
				},
				{
					label: 'Widgets',
					icon: 'bi bi-circle-fill',
					link: '/widgets'
				}
			]
		},
		{
			label: 'Docs',
			icon: 'bi bi-code-square',
			link: '/docs'
		}
	];

	onMount(async () => {
		// Activate sidebar treeview toggle
		const treeviewToggleElements = document.querySelectorAll("[data-toggle='treeview']");
		treeviewToggleElements.forEach(function (element) {
			element.addEventListener('click', function (event) {
				event.preventDefault();
				const parentElement = element.parentElement;

				// @ts-ignore
				if (!parentElement.classList.contains('is-expanded')) {
					// @ts-ignore
					var allTreeViewElements = treeviewMenu.querySelectorAll("[data-toggle='treeview']");
					allTreeViewElements.forEach(function (treeviewElement) {
						// @ts-ignore
						treeviewElement.parentElement.classList.remove('is-expanded');
					});
				}

				// @ts-ignore
				parentElement.classList.toggle('is-expanded');
			});
		});
	});
</script>

<div class="app-sidebar__overlay" data-toggle="sidebar"></div>
<aside class="fixed bottom-0 left-0 top-0 z-10 w-60 border-border/40 bg-background/95 pt-20 shadow transition-all" class:'w-4'={$sidebarOpen ? 'translate-x-0' : '-translate-x-full'}>
	<!-- svelte-ignore a11y-invalid-attribute -->
	<ul class="app-menu">
		{#each dataMenu as item (item.label)}
			{#if item.submenu}
				<div class={isActive(item) ? 'treeview is-expanded' : 'treeview'}>
					<a class="app-menu__item" href="#" data-toggle="treeview">
						<i class="app-menu__icon {item.icon}"></i>
						<span class="app-menu__label">{item.label}</span>
						<i class="treeview-indicator bi bi-chevron-right"></i>
					</a>
					<ul class="treeview-menu">
						{#each item.submenu as subitem (subitem.label)}
							<li>
								<a class={isActive(subitem) ? 'treeview-item active' : 'treeview-item'} href={subitem.link} target={subitem.target} rel={subitem.rel}>
									<i class="icon {subitem.icon}"></i>
									{subitem.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<a class={isActive(item) ? 'app-menu__item active' : 'app-menu__item'} href={item.link}>
					<i class="app-menu__icon {item.icon}"></i>
					<span class="app-menu__label">{item.label}</span>
				</a>
			{/if}
		{/each}
	</ul>
</aside>
