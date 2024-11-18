<script>
	import HospitalForm from './hospital-form.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<HospitalForm data={data.form} />
