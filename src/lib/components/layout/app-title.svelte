<script>
	import { page } from '$app/stores';

	export let title = '';
	export let desc = '';
	export let iconTitle = '';

	const url = $page.url.pathname;
</script>

<div>
	<div>
		<h1></h1>
		<p>{desc}</p>
	</div>
	<ul>
		<li>
			<a href={url}>{title}</a>
		</li>
	</ul>
</div>
