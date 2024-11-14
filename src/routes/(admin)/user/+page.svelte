<script>
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<svelte:head>
	<title>用户管理</title>
</svelte:head>

<DataTable data={data.users} {columns} isNextPage={data.hasNextPage} />
