<script>
	/**
	 * @typedef {import('./types').Hospital}
	 */
	export let hospital;
	export let domRef;

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	/**
	 * 从医院名称跳转到官网详情页面
	 * @param {string} name
	 */
	function handleDetail(name) {
		const tempForm = document.createElement('form');
		tempForm.id = 'tempForm1';
		tempForm.method = 'post';
		tempForm.action = 'https://fw.ybj.beijing.gov.cn/ddyy/ddyy/list';
		tempForm.target = 'ddyy1form';

		const hideInput = document.createElement('input');
		hideInput.type = 'hidden';
		hideInput.name = 'search_LIKE_yymc';
		hideInput.value = name;

		tempForm.appendChild(hideInput);
		tempForm.addEventListener('submit', () => {
			window.open('https://fw.ybj.beijing.gov.cn/ddyy/ddyy/list', 'ddyy1form');
		});

		document.body.appendChild(tempForm);
		tempForm.submit();
		document.body.removeChild(tempForm);
	}

	function handleClose() {
		dispatch('closeDetail');
	}
</script>

<div class="ol-popup absolute -left-1/2 min-w-96 rounded-lg border border-gray-300 bg-white p-4 shadow" bind:this={domRef}>
	<button class="absolute right-4 top-4" on:click={handleClose}>✖</button>
	<div class="popup-content">
		<h2 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">医院信息</h2>
		<ul class="mb-8 space-y-4 text-gray-500 dark:text-gray-400">
			<li class="gap-3">
				<span class="mr-2 text-gray-900">医院名称</span>
				<button class="mr-2 text-gray-900" on:click={() => handleDetail(hospital?.name)}>{hospital?.name}</button>
			</li>
			<li class="gap-3">
				<span class="mr-2 text-gray-900">医院编码</span>
				{hospital?.code}
			</li>
			<li class="gap-3">
				<span class="mr-2 text-gray-900">医院等级</span>
				{hospital?.lvl}
			</li>
			<li class="gap-3">
				<span class="mr-2 text-gray-900">医院类别</span>
				{hospital?.type}
			</li>
			<li class="gap-3">
				<span class="mr-2 text-gray-900">单位地址</span>
				{hospital?.address}
			</li>
			<li class="gap-3">
				<span class="mr-2 text-gray-900">医院简介</span>
				{hospital?.introduction}
			</li>
		</ul>
	</div>
</div>

<style>
	.ol-popup:after,
	.ol-popup:before {
		top: 100%;
		border: solid transparent;
		content: ' ';
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
	}
	.ol-popup:after {
		border-top-color: white;
		border-width: 10px;
		left: 48px;
		margin-left: -10px;
	}
	.ol-popup:before {
		border-top-color: #cccccc;
		border-width: 11px;
		left: 48px;
		margin-left: -11px;
	}
</style>
