<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { ChevronRight } from 'lucide-svelte';
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

<div class="fixed inset-0 z-[9] md:hidden" data-toggle="sidebar"></div>
<aside class="fixed -left-60 bottom-0 top-0 z-10 overflow-auto bg-[#222d32] pt-20 shadow transition-all md:left-0 {$sidebarOpen ? 'w-60' : 'w-12 overflow-hidden'}">
	<!-- svelte-ignore a11y-invalid-attribute -->
	<ul class="mb-0 pb-10">
		{#each dataMenu as item (item.label)}
			{#if item.submenu}
				<div class={isActive(item) ? 'treeview is-expanded' : 'treeview'}>
					<a class="relative flex items-center border-l-2 px-3 py-4 text-white transition-all" href="#" data-toggle="treeview">
						<i class="app-menu__icon {item.icon}"></i>
						<span class="flex-1">{item.label}</span>
						<ChevronRight />
					</a>
					<ul class="max-h-0 overflow-hidden bg-[#2a383e] transition-all">
						{#each item.submenu as subitem (subitem.label)}
							<li>
								<a
									class="relative flex items-center border-l-2 px-3 py-4 text-white transition-all {isActive(subitem) ? 'border-l-[#00695c] bg-[#0d1214] text-white' : ''}"
									href={subitem.link}
									target={subitem.target}
									rel={subitem.rel}
								>
									<i class="icon {subitem.icon}"></i>
									{subitem.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<a class="relative flex items-center border-l-2 px-3 py-4 text-white transition-all {isActive(item) ? 'border-l-[#00695c] bg-[#0d1214] text-white' : ''}" href={item.link}>
					<i class="app-menu__icon {item.icon}"></i>
					<span class="flex-1">{item.label}</span>
				</a>
			{/if}
		{/each}
	</ul>
</aside>
