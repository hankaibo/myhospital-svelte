<script>
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<svelte:head>
	<title>医院管理</title>
</svelte:head>

<DataTable data={data.hospitals} {columns} total={data.total} />
