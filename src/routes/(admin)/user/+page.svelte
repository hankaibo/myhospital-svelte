<script>
	import DataTable from './data-table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>用户管理</title>
</svelte:head>

<div class="container mx-auto py-10">
	<DataTable userList={data.users} isNextPage={data.hasNextPage} />
</div>
