<script>
	import UserForm from './user-form.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<UserForm data={data.form} />
