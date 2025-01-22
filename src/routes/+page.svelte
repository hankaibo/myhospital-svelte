<script>
	import { onMount, onDestroy } from 'svelte';
	import { mode } from 'mode-watcher';
	import '@amap/amap-jsapi-types';
	import HospitalDetail from './index/popup-detail.svelte';
	import HospitalList from './index/popup-list.svelte';
	import LoginAvatar from './index/avatar.svelte';

	let AMapLoader = null;
	/** @type {import('./index/types').Hospital | undefined} */
	let hospital = $state();
	/** @type {Array<import('./index/types').Hospital>}*/
	let hospitalList = $derived([]);
	/** @type {Array<number>} */
	let allHospitalIds = $state([]); // 用于保存已绘制的医院 id,避免重复绘制[];
	/** @type {HTMLElement | undefined}*/
	let popupDetail = $state();

	/**	@type {AMap.Map} */
	let map;
	/** @type {AMap.InfoWindow}*/
	let infoWindow;
	/** @type {AMap.ContextMenu} */
	let contextMenu;
	/** @type {boolean}*/
	let isDrawing = false;
	/** @type {AMap.Circle | undefined} */
	let circle;
	/** @type {AMap.Circle} */
	let selectedCircle; // 用于保存当前右键选中的 Circle

	/**
	 * 初始化地图
	 */
	async function initMap() {
		try {
			// 引入高德 jsapi-loader
			AMapLoader = await import('@amap/amap-jsapi-loader');

			// 配置高德密钥
			window._AMapSecurityConfig = {
				serviceHost: import.meta.env.VITE_AMAP_SERVICE_HOST
			};

			// 加载高德地图相关脚本
			const AMap = await AMapLoader.load({
				key: import.meta.env.VITE_KEY,
				version: '2.0',
				plugins: ['AMap.Scale', 'AMap.Geolocation', 'AMap.Circle', 'AMap.CircleEditor']
			});

			// 初始化地图
			map = new AMap.Map('map', {
				viewMode: '2D',
				zoom: 13,
				center: [116.397428, 39.90923]
			});

			toggleTheme();
			createPopup(AMap);
			setupEventHandlers(AMap);
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * 切换主题样式
	 */
	function toggleTheme() {
		if ($mode === 'dark') {
			// 设置地图的显示样式
			map?.setMapStyle('amap://styles/dark');
		} else {
			map?.setMapStyle('amap://styles/normal');
		}
	}

	/**
	 * 创建弹窗
	 * @param {AMap} AMap - 参数对象
	 */
	function createPopup(AMap) {
		infoWindow = new AMap.InfoWindow({
			content: popupDetail
		});
	}

	/**
	 * 设置地图相关事件
	 * @param {AMap} AMap - 参数对象
	 */
	function setupEventHandlers(AMap) {
		contextMenu = createContextMenu(AMap);

		map?.on('click', handleMapClick.bind(null, AMap));
		map?.on('mousemove', handleMapMouseMove.bind(null, AMap));
		map?.on('rightclick', () => contextMenu.close());
	}

	/**
	 * 创建右键菜单
	 * @param {AMap} AMap - 参数对象
	 */
	function createContextMenu(AMap) {
		const contextMenu = new AMap.ContextMenu();
		contextMenu.addItem(
			'删除',
			() => {
				removeCircle(selectedCircle);
			},
			0
		);
		return contextMenu;
	}

	/**
	 * 地图点击事件
	 * @param {AMap} AMap - 参数对象
	 * @param {AMap.Event<'click'> & { lnglat: AMap.LngLat }} event - 参数对象
	 */
	function handleMapClick(AMap, event) {
		if (!isDrawing) {
			startDrawingCircle(AMap, event.lnglat);
		} else {
			finishDrawingCircle();
		}
	}

	/**
	 * 地图鼠标移动事件
	 * @param {AMap} AMap - 参数对象
	 * @param {AMap.Event<'click'> & { lnglat: AMap.LngLat }} event - 参数对象
	 */
	function handleMapMouseMove(AMap, event) {
		if (isDrawing && circle) {
			const movePoint = event.lnglat;
			const radius = AMap.GeometryUtil.distance(circle.getCenter(), movePoint);
			circle.setRadius(radius);
		}
	}

	/**
	 * 开始绘制圆形
	 * @param {AMap} AMap - 参数对象
	 * @param {AMap.LngLat} point - 参数对象
	 */
	function startDrawingCircle(AMap, point) {
		isDrawing = true;
		circle = new AMap.Circle({
			center: point,
			radius: 0, // 初始半径为0
			bubble: true,
			strokeColor: '#FF33FF',
			strokeWeight: 6,
			strokeOpacity: 0.2,
			fillOpacity: 0.4,
			strokeStyle: 'dashed',
			strokeDasharray: [10, 10],
			fillColor: '#1791fc',
			draggable: true,
			zIndex: 50
		});
		circle.on('click', (event) => handleCircleClick(event.target));
		circle.on('rightclick', (event) => {
			selectedCircle = event.target;
			if (map) {
				contextMenu.open(map, event.lnglat);
			}
		});
		circle.on('dragend', (event) => {
			// 删除旧的不在当前圆形范围内的 marker
			removeCircle(event.target);
			// 发送请求，获取新的医院数据
			const { lng, lat } = event.target.getCenter();
			const radius = event.target.getRadius();
			handleFetch({ lng, lat, radius });
		});
		if (map) {
			circle.setMap(map);
		}
	}

	/**
	 * 结束绘制圆形
	 */
	function finishDrawingCircle() {
		isDrawing = false;
		if (circle) {
			const { lng, lat } = circle.getCenter();
			const radius = circle.getRadius();
			handleFetch({ lng, lat, radius });
			circle = undefined; // 重置圆形对象
		}
	}

	/**
	 * 处理圆形点击事件
	 * @param {AMap.Circle} circle - 参数对象
	 */
	function handleCircleClick(circle) {
		map?.getAllOverlays('marker').forEach((marker) => {
			if (circle.contains(marker.getPosition())) {
				hospitalList.push(marker.getExtData());
			}
		});
	}

	/**
	 * 根据查询到的医院数据添加地图标记
	 * @param {Array<import('./index/types').Hospital>} list 医院信息数组
	 */
	function addMarker(list) {
		if (!Array.isArray(list)) {
			return;
		}

		/** @type {Array<import('./index/types').Hospital>} */
		const newList = [];
		list
			// 过滤已绘制的
			.filter((item) => !allHospitalIds.includes(item.id))
			.forEach((item) => {
				allHospitalIds.push(item.id);
				newList.push(item);
			});

		/** @type {Array<AMap.Marker>} */
		const markerList = [];
		newList.forEach((item) => {
			const { lng, lat, name } = item;

			const marker = new AMap.Marker({
				position: new AMap.LngLat(lng, lat), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
				title: name,
				extData: item
			});
			marker.on('click', () => {
				hospital = item;
				infoWindow.open(map, marker.getPosition());
			});
			markerList.push(marker);
		});
		//将创建的点标记添加到已有的地图实例：
		if (markerList.length) {
			map?.add(markerList);
		}
	}

	/**
	 * 删除地图标记
	 * @param {AMap.Circle} circle - 圆形对象
	 */
	function removeCircle(circle) {
		// 创建一个数组来保存 Circle 内的 Marker
		/** @type {Array<AMap.Marker>} */
		const markersInCircle = [];

		// 遍历地图上的所有 Marker
		map?.getAllOverlays('marker').forEach((marker) => {
			// 检查 Marker 是否在 Circle 内
			if (circle.contains(marker.getPosition())) {
				markersInCircle.push(marker);
			}
		});
		markersInCircle.forEach((marker) => {
			allHospitalIds.splice(allHospitalIds.indexOf(marker.getExtData().id), 1);
			marker.setMap(null);
		});
		// 或者
		// map?.remove(markersInCircle);
	}

	/**
	 * 根据坐标范围查询医院数据
	 * @param {Object} params - 参数对象
	 * @param {number} params.lng - 经度
	 * @param {number} params.lat - 纬度
	 * @param {number} params.radius - 半径
	 */
	async function handleFetch({ lng, lat, radius }) {
		const response = await fetch('/', {
			method: 'POST',
			body: JSON.stringify({ lng, lat, radius }),
			headers: {
				'content-type': 'application/json'
			}
		});

		if (!response.ok) return;

		const hospitals = await response.json();

		addMarker(hospitals);
	}

	function handleCloseDetail() {
		popupDetail = undefined;
	}

	onMount(() => {
		initMap();
	});

	onDestroy(() => {
		//解绑地图的点击事件
		map?.off('click', () => handleMapClick);
		//销毁地图，并清空地图容器
		map?.destroy();
	});
</script>

<svelte:head>
	<title>首页</title>
</svelte:head>

<div id="map" class="h-dvh"></div>

<!-- 某个医院的详情弹框 -->
<HospitalDetail {hospital} bind:domRef={popupDetail} on:closeDetail={handleCloseDetail} />

<HospitalList {hospitalList} />

<LoginAvatar class="absolute right-4 top-4 z-10" />
