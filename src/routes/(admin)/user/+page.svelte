<script>
	import DataTable from './data-table.svelte';

	
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<svelte:head>
	<title>用户管理</title>
</svelte:head>

<DataTable userList={data.users} isNextPage={data.hasNextPage} />
