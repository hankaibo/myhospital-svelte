<script>
	import { tick } from 'svelte';
	import { mode } from 'mode-watcher';
	import '@amap/amap-jsapi-types';
	import { Pencil, Trash2, Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { goto } from '$app/navigation';

	/** @type {{id: number}} */
	let { id } = $props();

	let dialogOpen = $state(false);
	/**	@type {AMap.Map} */
	let map;
	/** @type {AMap.Marker} */
	let marker;
	/** @type {number | undefined} */
	let lng = $state();
	/** @type {number | undefined} */
	let lat = $state();

	async function handleInitMap() {
		console.log('111 :>> ', id);
		dialogOpen = true;

		// 类似 nextTick 中初始化地图
		// 等待 DOM 更新完成
		await tick();

		try {
			const AMap = await loadAMap();
			initializeMap(AMap);
			setupEventHandlers(AMap);
		} catch (error) {
			console.error(error);
		}
	}

	async function loadAMap() {
		return await window.AMapLoader.load({
			key: import.meta.env.VITE_KEY,
			version: '2.0',
			plugins: ['AMap.Scale']
		});
	}
	/**
	 * @param {AMap} AMap - 参数对象
	 */
	async function initializeMap(AMap) {
		map = new AMap.Map('map', {
			viewMode: '2D',
			zoom: 13,
			center: [116.397428, 39.90923]
		});
		if ($mode === 'dark') {
			// 设置地图的显示样式
			map.setMapStyle('amap://styles/dark');
		}
	}
	/**
	 * @param {AMap} AMap - 参数对象
	 */
	function setupEventHandlers(AMap) {
		// 监听地图点击事件
		map.on('click', function (e) {
			const lng = e.lnglat.getLng();
			const lat = e.lnglat.getLat();

			// 如果 marker 不存在，则创建 marker
			if (!marker) {
				marker = new AMap.Marker({
					position: [lng, lat],
					map: map,
					draggable: true // 设置标记可拖拽
				});
				marker.on('dragend', updatePosition); // 监听拖动结束事件
			} else {
				// 如果 marker 已存在，则更新位置
				marker.setPosition([lng, lat]);
			}

			// 更新经纬度信息
			updatePosition(e);
		});
	}
	/**
	 *
	 * @param {AMap.Event<'click'> & { lnglat: AMap.LngLat }} e
	 */
	function updatePosition(e) {
		lng = e.lnglat ? e.lnglat.getLng() : marker.getPosition()?.getLng();
		lat = e.lnglat ? e.lnglat.getLat() : marker.getPosition()?.getLat();
	}

	function handleCopy() {
		// 跳转到用户详情页面
		goto(`/user/${id}`);
	}

	function handleEdit() {
		goto(`/hospital/${id}`);
	}

	function handleDelete() {
		console.log('Delete');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="">
		<DropdownMenu.Item class="" inset onclick={handleCopy}>影分身</DropdownMenu.Item>
		<DropdownMenu.Separator class="" />
		<DropdownMenu.Item class="" inset onclick={handleInitMap}>地理编码</DropdownMenu.Item>
		<DropdownMenu.Item class="" inset>
			<Button variant="ghost" size="icon" class="relative size-8 p-0" onclick={handleEdit}>
				<Pencil class="size-4" />
				编辑
			</Button>
		</DropdownMenu.Item>
		<DropdownMenu.Item class="" inset>
			<Button variant="ghost" size="icon" class="relative size-8 p-0">
				<Trash2 class="size-4" />
				删除
			</Button>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Sheet.Root bind:open={dialogOpen}>
	<Sheet.Content class="md:max-w-full">
		<Sheet.Header class="">
			<Sheet.Title class="">请选择该医院的地点</Sheet.Title>
			<Sheet.Description class="">使用鼠标在地图上选择正确的地址。</Sheet.Description>
		</Sheet.Header>
		<div id="map" class="my-2 h-[calc(100%-100px)] w-full"></div>
		<div class="absolute bottom-20 right-10 rounded bg-slate-400 p-2">
			经度: <span>{lng || 'N/A'}</span>, 纬度: <span>{lat || 'N/A'}</span>
		</div>

		<Sheet.Footer class="">
			<Sheet.Close>
				{#snippet child({ props })}
					<Button class="" {...props} type="submit">保存</Button>
				{/snippet}
			</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
