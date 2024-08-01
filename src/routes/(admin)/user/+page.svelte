<script>
	import DataTable from './data-table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>用户管理</title>
</svelte:head>

<DataTable userList={data.users} isNextPage={data.hasNextPage} />
