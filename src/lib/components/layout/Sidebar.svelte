<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { ChevronRight, Users, House, Hospital } from 'lucide-svelte';
	import { sidebarOpen } from '../../../stores/sidebarStore';

	/**
	 * @typedef {Record<string, any>} IconMap
	 */

	/** @type {IconMap} */
	const iconMap = {
		home: House,
		user: Users,
		hospital: Hospital
	};

	// Fungsi untuk memeriksa apakah suatu elemen menu aktif
	$: isActive = (/** @type {any} */ item) => {
		const currentPath = $page.url.pathname;
		return item.link === currentPath || (item.submenu && item.submenu.some((/** @type {{ link: string; }} */ subitem) => subitem.link === currentPath));
	};

	const dataMenu = [
		{
			label: '首页',
			icon: 'home',
			link: `${base}`
		},
		{
			label: '用户管理',
			icon: 'user',
			link: `${base}/user`
		},
		{
			label: '医院管理',
			icon: 'hospital',
			link: `${base}/hospital`
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
		}
	];
</script>

<div class="fixed inset-0 z-[9] md:hidden" data-toggle="sidebar"></div>
<aside class="fixed -left-60 bottom-0 top-16 z-10 overflow-auto shadow transition-all md:left-0 {$sidebarOpen ? 'w-60' : 'w-12 overflow-hidden'}">
	<!-- svelte-ignore a11y-invalid-attribute -->
	<ul class="mb-0 pb-10">
		{#each dataMenu as item (item.label)}
			{#if item.submenu}
				<div class={isActive(item) ? 'treeview is-expanded' : 'treeview'}>
					<a class="relative flex items-center border-l-2 px-3 py-4 transition-all" href="#" data-toggle="treeview">
						<svelte:component this={iconMap[item.icon]} class="h-4 w-4" />
						<span class={$sidebarOpen ? 'flex-1' : 'hidden'}>{item.label}</span>
						<ChevronRight />
					</a>
					<ul class="max-h-0 overflow-hidden bg-[#2a383e] transition-all">
						{#each item.submenu as subitem (subitem.label)}
							<li>
								<a
									class="relative flex items-center border-l-2 px-3 py-4 transition-all {isActive(subitem) ? 'border-l-2 border-black' : ''}"
									href={subitem.link}
									target={subitem.target}
									rel={subitem.rel}
								>
									<svelte:component this={iconMap[subitem.icon]} class="h-4 w-4" />
									<span class={$sidebarOpen ? 'flex-1' : 'hidden'}>{subitem.label}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<a class="relative flex items-center gap-2 border-l-2 px-3 py-4 transition-all {isActive(item) ? 'border-l-2 border-black' : ''}" href={item.link}>
					<svelte:component this={iconMap[item.icon]} class="h-4 w-4" />
					<span class={$sidebarOpen ? 'flex-1' : 'hidden'}>{item.label}</span>
				</a>
			{/if}
		{/each}
	</ul>
</aside>
