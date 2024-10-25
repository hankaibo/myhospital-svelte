<script>
	import { page } from '$app/stores';

	/** @type {{title?: string, desc?: string, iconTitle?: string}} */
	let { title = '', desc = '', iconTitle = '' } = $props();

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
