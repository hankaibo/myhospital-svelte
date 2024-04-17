<script>
	import { page } from '$app/stores';
	import { Checkbox, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Pagination } from 'flowbite-svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	$: name = '';
	$: activeUrl = $page.url.searchParams.get('page');

	/**
	 * @type {any[]}
	 */
	let pages = [
		{ name: 1, href: '/components/pagination?page=1' },
		{ name: 2, href: '/components/pagination?page=2' },
		{ name: 3, href: '/components/pagination?page=3' },
		{ name: 4, href: '/components/pagination?page=4' },
		{ name: 5, href: '/components/pagination?page=5' }
	];

	$: {
		pages.forEach((page) => {
			let splitUrl = page.href.split('?');
			let queryString = splitUrl.slice(1).join('?');
			const hrefParams = new URLSearchParams(queryString);
			let hrefValue = hrefParams.get('page');
			if (hrefValue === activeUrl) {
				page.active = true;
			} else {
				page.active = false;
			}
		});
		pages = pages;
	}

	const previous = () => {
		alert('Previous btn clicked. Make a call to your server to fetch data.');
	};
	const next = () => {
		alert('Next btn clicked. Make a call to your server to fetch data.');
	};

	/**
	 * 删除用户
	 * @param {number} id
	 */
	// async function handleDelete(id) {
	// 	const res = await fetch(`/api/users/${id}`, {
	// 		method: 'delete',
	// 		headers: {
	// 			Authorization: `Bearer ${localStorage.getItem('token')}`
	// 		}
	// 	});
	// 	if (res.ok) {
	// 		getList();
	// 	}
	// }
</script>

<TableSearch striped={true} shadow placeholder="Search by maker name" hoverable={true} bind:inputValue={name}>
	<TableHead>
		<TableHeadCell class="!p-4">
			<Checkbox />
		</TableHeadCell>
		<TableHeadCell>ID</TableHeadCell>
		<TableHeadCell>Email</TableHeadCell>
		<TableHeadCell>Type</TableHeadCell>
		<TableHeadCell>Status</TableHeadCell>
		<TableHeadCell>
			<span class="sr-only">Edit</span>
		</TableHeadCell>
	</TableHead>
	<TableBody tableBodyClass="divide-y">
		{#each data.users as item}
			<TableBodyRow>
				<TableBodyCell class="!p-4">
					<Checkbox />
				</TableBodyCell>
				<TableBodyCell>{item.id}</TableBodyCell>
				<TableBodyCell>{item.email}</TableBodyCell>
				<TableBodyCell>{item.provider}</TableBodyCell>
				<TableBodyCell>{item.status.name}</TableBodyCell>
				<TableBodyCell>
					<a href="/tables" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Edit</a>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</TableSearch>

<Pagination {pages} on:previous={previous} on:next={next} />
