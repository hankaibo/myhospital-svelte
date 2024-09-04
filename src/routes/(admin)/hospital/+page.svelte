<script>
	import DataTable from './data-table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>医院管理</title>
</svelte:head>

<div class="container mx-auto py-10">
	<DataTable hospitalList={data.hospitals} isNextPage={data.hasNextPage} />
</div>
