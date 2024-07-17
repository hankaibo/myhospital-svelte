<script>
	import DataTable from './data-table.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<DataTable userList={data.users} isNextPage={data.hasNextPage} />
