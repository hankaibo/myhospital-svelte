<script>
	import DataTable from './data-table.svelte';

	
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<svelte:head>
	<title>医院管理</title>
</svelte:head>

<DataTable hospitalList={data.hospitals} total={data.total} />
