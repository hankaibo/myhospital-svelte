<script>
	import DataTable from './data-table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>医院管理</title>
</svelte:head>

<DataTable hospitalList={data.hospitals} total={data.total} />
