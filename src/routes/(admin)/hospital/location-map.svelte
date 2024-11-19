<script>
	import { tick } from 'svelte';
	import { mode } from 'mode-watcher';
	import '@amap/amap-jsapi-types';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';

	let { id, dialogOpen, longitude = 116.397861, latitude = 39.900401 } = $props();
	/**	@type {AMap.Map} */
	let map;
	/** @type {AMap.Marker} */
	let marker;
	/** @type {number} */
	let lng = $state(longitude);
	/** @type {number} */
	let lat = $state(latitude);

	async function handleInitMap() {
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
			center: [lng, lat]
		});

		if ($mode === 'dark') {
			// 设置地图的显示样式
			map.setMapStyle('amap://styles/dark');
		} else {
			map.setMapStyle('amap://styles/normal');
		}

		if (lng && lat) {
			marker = new AMap.Marker({
				position: [lng, lat],
				offset: new AMap.Pixel(-13, -30) //以 icon 的 [center bottom] 为原点
			});
			marker.on('dragend', updatePosition); // 监听拖动结束事件
			map.add(marker);
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
		lng = e.lnglat ? e.lnglat.getLng() : marker.getPosition()?.getLng() || 116.397861;
		lat = e.lnglat ? e.lnglat.getLat() : marker.getPosition()?.getLat() || 39.900401;

		fetch('/hospital', {
			method: 'PATCH',
			body: JSON.stringify({ id, lng, lat }),
			headers: {
				'content-type': 'application/json'
			}
		}).then(() => {});
	}

	$effect(() => {
		if (dialogOpen) {
			handleInitMap();
		}
	});
</script>

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
