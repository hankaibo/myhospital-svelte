<script>
	import { onMount } from 'svelte';
	import { Map, View } from 'ol';
	import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
	import { XYZ, Vector as VectorSource, Cluster } from 'ol/source';
	import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
	import Feature from 'ol/Feature';
	import Overlay from 'ol/Overlay';
	import { fromLonLat, toLonLat, get } from 'ol/proj';
	import { defaults as defaultControls } from 'ol/control.js';
	import { Point, LineString, Circle as CircleGeom } from 'ol/geom';
	import { getLength } from 'ol/sphere.js';
	import { Fill, Stroke, Style, Icon, Circle as CircleStyle, Text as TextStyle } from 'ol/style';
	import { click } from 'ol/events/condition';
	import ContextMenu from '$lib/ol/Contextmenu';
	import * as api from '$lib/api.js';
	import 'ol/ol.css';
	import '$lib/ol/contextmenu.css';
	import HospitalDetail from './index/popup-detail.svelte';
	import HospitalList from './index/popup-list.svelte';
	import LoginAvatar from './index/avatar.svelte';

	// /** @type {import('./$types').PageData} */
	// export const data;

	/**	@type {import('ol/Map').default} */
	let map;
	/** @type {import('ol/View').default} */
	let view;
	/**	@type {import('ol/interaction/Modify').default}	*/
	let modify;
	/**	@type {import('ol/interaction/Draw').default}	*/
	let draw;
	/** @type {import('ol/interaction/Snap').default} */
	let snap;
	/** @type {import('ol/interaction/Select').default} */
	let select;
	/** @type {import('ol/Overlay').default} */
	let overlayDetail;

	/** @type {import('./index/types').Hospital} */
	let hospital;
	/** @type {Array<import('./index/types').Hospital>}*/
	$: hospitalList = [];
	/** @type {Array<number>} */
	let allFeature = [];
	/** @type {Array<number>} */
	let beforeCenter = [];
	/** @type {Array<import('ol/Feature').default>} */
	let beforeMarkList = [];
	/** @type {number} */
	let beforeRadius = 0;
	/** @type {import('ol/Feature').default} */
	let deleteFeature;

	/** @type {Array<import('ol/Feature').default>} */
	let a19AllFeature = [];

	/** @type {HTMLElement | null}*/
	let popupDetail;

	// 瓦片图层
	const tileLayer1 = new TileLayer({
		source: new XYZ({
			url: '/tile/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
		})
	});
	const tileLayer2 = new TileLayer({
		source: new XYZ({
			url: '/tile/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}'
		})
	});
	tileLayer1.set('name', 'tileLayer1');
	tileLayer2.set('name', 'tileLayer2');

	// 矢量图层
	/** @type {import('ol/source/Vector').default} */
	const vectorSource = new VectorSource({
		wrapX: true
	});
	const vectorLayer = new VectorLayer({
		source: vectorSource,
		style: new Style({
			fill: new Fill({
				color: 'rgba(155, 211, 229, 0.5)'
			}),
			stroke: new Stroke({
				color: 'rgba(49, 143, 227, 1)',
				width: 1
			})
		})
	});
	vectorLayer.set('name', 'vectorLayer');

	// 聚合图层
	/** @type {import('ol/source/Vector').default} */
	const markerVectorSource = new VectorSource();
	const clusterSource = new Cluster({
		distance: 40,
		source: markerVectorSource
	});
	/** @type {Object<number, import('ol/style/Style').default>} */
	const styleCache = {};
	const clusterLayer = new VectorLayer({
		source: clusterSource,
		style(feature) {
			const size = feature.get('features').length;
			let cacheStyle = styleCache[size];
			if (!cacheStyle) {
				cacheStyle = new Style({
					image: new Icon({
						anchor: [0.5, 30],
						anchorXUnits: 'fraction',
						anchorYUnits: 'pixels',
						src: '/marker.png'
					}),
					text: new TextStyle({
						font: 'bold 18px serif',
						offsetY: -16,
						text: size.toString(),
						fill: new Fill({
							color: '#000'
						})
					})
				});
				styleCache[size] = cacheStyle;
			}
			return cacheStyle;
		}
	});
	clusterLayer.set('name', 'clusterLayer');

	// 矢量图层（用户）
	const userVectorSource = new VectorSource();
	const userVectorLayer = new VectorLayer({
		source: userVectorSource
	});

	// 矢量图层（A类医院）
	const a19VectorSource = new VectorSource();
	const a19VectorLayer = new VectorLayer({
		source: a19VectorSource
	});
	a19VectorLayer.set('name', 'a19VectorLayer');

	/**
	 *
	 * @param {number} index
	 * @param {string} tag
	 */
	const handleOffset = (index, tag) => {
		let row = 0;
		let idx = index;
		switch (tag) {
			case 'blue':
				if (index > 9) {
					row = 2;
					idx = index - 10;
				} else {
					row = 1;
				}
				break;
			case 'red':
				if (index > 9) {
					row = 4;
					idx = index - 10;
				} else {
					row = 3;
				}
				break;
			case 'yellow':
				row = 5;
				break;
			default:
				idx = 3;
				row = 0;
		}
		return [19 + 88 * idx, 8 + 88 * row];
	};

	// Limit multi-world panning to one world east and west of the real world.
	// Geometry coordinates have to be within that range.
	const extent = get('EPSG:3857')?.getExtent().slice();
	if (Array.isArray(extent)) {
		extent[0] += extent[0];
		extent[2] += extent[2];
	}

	function initMap() {
		overlayDetail = new Overlay({
			element: popupDetail || undefined,
			autoPan: {
				animation: {
					duration: 250
				}
			}
		});

		view = new View({
			center: fromLonLat([116.397029, 39.917839]),
			zoom: 15,
			minZoom: 3,
			maxZoom: 18,
			constrainResolution: true,
			extent
		});

		map = new Map({
			target: 'map',
			layers: [tileLayer1, tileLayer2, vectorLayer, clusterLayer],
			view,
			overlays: [overlayDetail],
			controls: defaultControls({
				zoom: false,
				rotate: false,
				attribution: false
			})
		});
	}
	function addInteractionModify() {
		modify = new Modify({ source: vectorSource });
		modify.on('modifystart', ({ features }) => {
			const feature = features.item(0);
			handleCircleBefore(feature);
		});
		modify.on('modifyend', ({ features }) => {
			const feature = features.item(0);
			handleCircleAfter(feature);
		});
		map.addInteraction(modify);
	}
	function addInteractionDraw() {
		draw = new Draw({
			source: vectorSource,
			type: 'Circle'
		});
		draw.on('drawend', ({ feature }) => {
			const geometry = feature.getGeometry();
			const center = geometry.getCenter();
			const lastPoint = geometry.getLastCoordinate();
			const line = new LineString([center, lastPoint]);
			const distance = getLength(line);
			handleFetch({
				type: 'Circle',
				center: toLonLat(center),
				radius: distance
			});
		});
		map.addInteraction(draw);
	}
	function addInteractionSnap() {
		snap = new Snap({ source: vectorSource });
		map.addInteraction(snap);
	}
	function addInteractionSelect() {
		if (select !== null) {
			map.removeInteraction(select);
		}

		select = new Select({
			condition: click,
			layers: [vectorLayer]
		});

		if (select !== null) {
			map.addInteraction(select);
			select.on('select', (e) => {
				if (e.selected.length) {
					hospitalList = markerVectorSource
						.getFeatures()
						.filter((item) => e.selected[0].getGeometry()?.intersectsCoordinate(item.getGeometry().getCoordinates()))
						.map((it) => ({ ...it.getProperties() }));
				} else {
					hospitalList = [];
				}
			});
		}
	}

	/**
	 * 为地图绑定事件
	 * 1，点击 marker 显示医院详情
	 * 2，鼠标移入 marker 变为手型
	 */
	function addEvent() {
		map.on('click', (evt) => {
			const selectedFeature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature, {
				layerFilter: (layer) => ['clusterLayer', 'a19VectorLayer'].includes(layer.get('name'))
			});
			if (!selectedFeature) {
				return;
			}
			// 聚合
			if (Array.isArray(selectedFeature.get('features'))) {
				evt.stopPropagation();
				if (selectedFeature.get('features').length === 1) {
					hospital = {
						...selectedFeature.get('features')[0].getProperties()
					};
					const coordinates = evt.coordinate;
					// const coordinates = selectedFeature.getGeometry().getCoordinates();
					overlayDetail?.setPosition(coordinates);
					evt.stopPropagation();
				} else {
					window.alert('聚合元素不可以显示详情，请重新选择。');
				}
			} else {
				evt.stopPropagation();
				const { id, name, code, type, district, lvl, zipCode, address, introduction } = selectedFeature.getProperties();
				hospital = {
					id,
					name,
					code,
					type,
					district,
					lvl,
					zipCode,
					address,
					introduction
				};
				const coordinates = evt.coordinate;
				overlayDetail?.setPosition(coordinates);
				evt.stopPropagation();
			}
		});

		map.on('pointermove', (e) => {
			if (e.dragging) {
				return;
			}
			const hit = map.hasFeatureAtPixel(e.pixel, {
				layerFilter: (layer) => ['vectorLayer', 'clusterLayer', 'a19VectorLayer'].includes(layer.get('name'))
			});
			draw.setActive(!hit);
			map.getTargetElement().style.cursor = hit ? 'pointer' : '';
		});
	}

	/**
	 * 右键菜单
	 */
	function handleContextMenu() {
		const contextmenuItems = [
			{
				text: '定位中心到此',
				classname: 'text-bold',
				icon: '/center.png',
				/**
				 *
				 * @param {import('ol/coordinate')} obj
				 */
				callback(obj) {
					view.animate({
						duration: 700,
						center: obj.coordinate
					});
				}
			}
		];
		const contextmenu = new ContextMenu({
			width: 180,
			items: contextmenuItems
		});
		contextmenu.on('open', (evt) => {
			const selectedFeature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature, {
				layerFilter: (layer) => layer.get('name') === 'vectorLayer'
			});
			if (selectedFeature) {
				contextmenu.clear();
				contextmenu.push({
					text: '删除',
					classname: 'marker',
					data: { marker: selectedFeature },
					callback: deleteDraw
				});
				deleteFeature = selectedFeature;
			} else {
				contextmenu.clear();
				contextmenu.extend(contextmenuItems);
				contextmenu.extend(contextmenu.getDefaultItems());
			}
		});
		map.addControl(contextmenu);
	}

	/**
	 * 定位地图中心到用户当前位置
	 */
	function handleLocation() {
		// 获取用户位置
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { longitude, latitude } = position.coords;
				const center = fromLonLat([longitude, latitude]);
				map.getView().animate({ center });

				// 标记
				// const circleFeature = new Feature({
				// 	geometry: new CircleGeom(center, 50)
				// });
				// circleFeature.setStyle(
				// 	new Style({
				// 		renderer: function renderer(coordinates, state) {
				// 			const coordinates0 = coordinates[0];
				// 			const x = coordinates0[0];
				// 			const y = coordinates0[1];
				// 			const coordinates1 = coordinates[1];
				// 			const x1 = coordinates1[0];
				// 			const y1 = coordinates1[1];
				// 			const ctx = state.context;
				// 			const dx = x1 - x;
				// 			const dy = y1 - y;
				// 			const radius = Math.sqrt(dx * dx + dy * dy);

				// 			const innerRadius = 0;
				// 			const outerRadius = radius * 1.4;

				// 			const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
				// 			gradient.addColorStop(0, 'rgba(255,0,0,0)');
				// 			gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
				// 			gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
				// 			ctx.beginPath();
				// 			ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
				// 			ctx.fillStyle = gradient;
				// 			ctx.fill();

				// 			ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
				// 			ctx.strokeStyle = 'rgba(255,0,0,1)';
				// 			ctx.stroke();
				// 		}
				// 	})
				// );

				// const circle = new Feature({
				// 	geometry: new Point(center)
				// });
				// circle.setStyle(
				// 	new Style({
				// 		image: new CircleStyle({
				// 			radius: 0,
				// 			stroke: new Stroke({
				// 				color: 'red'
				// 			})
				// 		})
				// 	})
				// );
				// a19VectorSource.addFeature(circleFeature);
				// a19VectorSource.addFeature(circle);
				// map.addLayer(userVectorLayer);

				// 动画
				// let radius = 0;
				// map.on('postcompose', () => {
				// 	radius += 1;
				// 	radius %= 20;
				// 	console.log(radius);
				// 	circle.setStyle(
				// 		new Style({
				// 			image: new CircleStyle({
				// 				radius,
				// 				stroke: new Stroke({
				// 					color: 'red'
				// 				})
				// 			})
				// 		})
				// 	);
				// });
			});
		}
	}

	/**
	 *
	 * @param {import('ol/Feature').default} feature
	 */
	function handleCircleBefore(feature) {
		/** @type {import('ol/geom/Circle').default} */
		const geometryCircle = /** @type {import('ol/geom/Circle')} */ feature.getGeometry();
		beforeCenter = geometryCircle.getCenter();
		beforeRadius = geometryCircle.getRadius();
		beforeMarkList = markerVectorSource.getFeatures().filter((item) => geometryCircle.intersectsCoordinate(item.getGeometry().getCoordinates()));
	}

	/**
	 *
	 * @param {import('ol/Feature').default} feature
	 */
	function handleCircleAfter(feature) {
		const geometryCircle = feature.getGeometry();
		const center = geometryCircle.getCenter();
		const radius = geometryCircle.getRadius();
		// drag
		if (beforeCenter.toString() !== center.toString()) {
			beforeMarkList.forEach((item) => {
				if (!geometryCircle.intersectsCoordinate(item.getGeometry().getCoordinates())) {
					removeMarker(item);
				}
			});
			handleFetch({
				type: 'Circle',
				center: toLonLat(center),
				radius
			});
		} else if (radius > beforeRadius) {
			handleFetch({
				type: 'Circle',
				center: toLonLat(center),
				radius
			});
		} else {
			beforeMarkList.forEach((item) => {
				if (!geometryCircle.intersectsCoordinate(item.getGeometry().getCoordinates())) {
					removeMarker(item);
				}
			});
		}
	}

	/**
	 * 根据查询到的医院数据添加地图标记
	 * @param {Array<import('./index/types').Hospital>} list
	 */
	function addMarker(list) {
		if (!Array.isArray(list)) {
			return;
		}

		/** @type {Array<import('./index/types').Hospital>} */
		const newList = [];
		list
			// 过滤已绘制的
			.filter((item) => !allFeature.includes(item.id))
			.forEach((item) => {
				allFeature.push(item.id);
				newList.push(item);
			});

		/** @type {Array<import('ol/Feature').default>} */
		const featureList = [];
		newList.forEach((item) => {
			const { lngLat } = item;
			let coordinates = [0, 0];
			if (lngLat) {
				({ coordinates } = lngLat);
			}
			const marker = new Feature({
				geometry: new Point(fromLonLat(coordinates)),
				id: item.id,
				name: item.name,
				code: item.code,
				type: item.type,
				district: item.district,
				lvl: item.lvl,
				zipCode: item.zipCode,
				address: item.address,
				introduction: item.introduction
			});
			featureList.push(marker);
		});
		markerVectorSource.addFeatures(featureList);
		beforeMarkList = [];
	}

	/**
	 * 添加A类医院
	 * @param {Array<import('./index/types').Hospital>} list
	 */
	function addMarkerA19(list) {
		if (!list || !Array.isArray(list) || Object.keys(list).length) {
			return;
		}

		/** @type {Array<import('./index/types').Hospital>} */
		const newList = [];
		list
			.filter((item) => !a19AllFeature.includes(item.id))
			.forEach((item) => {
				a19AllFeature.push(item.id);
				newList.push(item);
			});

		const featureArray = [];
		newList.forEach((item, index) => {
			const iconFeature = new Feature({
				geometry: new Point(fromLonLat([item.lng, item.lat])),
				id: item.id,
				name: item.name,
				code: item.code,
				type: item.type,
				district: item.district,
				lvl: item.lvl,
				zipCode: item.zipCode,
				address: item.address,
				introduction: item.introduction
			});
			const iconStyle = new Style({
				image: new Icon({
					anchor: [0.5, 0.96],
					size: [44, 64],
					offset: handleOffset(index, 'red'),
					src: 'https://www.amap.com/assets/img/poi-marker.png'
				})
			});
			iconFeature.setStyle(iconStyle);
			featureArray.push(iconFeature);
		});
		a19VectorSource.addFeatures(featureArray);
	}

	/**
	 * 删除地图标记
	 * @param {import('../lib/ol/types').CallbackObject} feature
	 */
	function removeMarker(feature) {
		const sum = vectorSource.getFeatures().length;
		if (sum === 0) {
			markerVectorSource.clear();
			allFeature = [];
		} else {
			let isDelete = true;
			vectorSource.forEachFeature((item) => {
				if (item.getGeometry().intersectsCoordinate(feature.coordinate)) {
					isDelete = false;
				}
			});
			if (isDelete) {
				allFeature = allFeature.filter((it) => it !== feature.get('id'));
				markerVectorSource.removeFeature(feature);
			}
		}
	}

	/**
	 * 删除选中的图形区域
	 */
	function deleteDraw() {
		const selected = select.getFeatures();
		if (deleteFeature === selected.getArray()[0]) {
			hospitalList = [];
		}

		const geometry = deleteFeature.getGeometry();
		const deletMarkers = markerVectorSource.getFeatures().filter((item) => geometry.intersectsCoordinate(item.getGeometry().getCoordinates()));
		deletMarkers.forEach((feature) => markerVectorSource.removeFeature(feature));
		vectorSource.removeFeature(deleteFeature);
	}

	/**
	 * 【弹出层】，关闭
	 */
	function handleClose() {
		overlayDetail.setPosition(undefined);
		return false;
	}

	/**
	 * 根据坐标范围查询医院数据
	 * @param {Object} params - 参数对象
	 * @param {string} params.type - 类型
	 * @param {import("ol/coordinate").Coordinate} params.center - 中心坐标
	 * @param {number} params.radius - 半径
	 */
	async function handleFetch({ center, radius }) {
		const [longitude, latitude] = center;
		const q = new URLSearchParams();
		q.set('longitude', longitude.toString());
		q.set('latitude', latitude.toString());
		q.set('radius', radius.toString());
		const response = await api.get(`hospitals?${q}`, {
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (Array.isArray(response)) {
			addMarker(response);
		}
	}

	onMount(() => {
		initMap();
		addInteractionModify();
		addInteractionDraw();
		addInteractionSnap();
		addInteractionSelect();
		addEvent();
		handleContextMenu();
		handleLocation();
	});
</script>

<svelte:head>
	<title>首页</title>
</svelte:head>

<div id="map" class="h-dvh"></div>

<!-- 某个医院的详情弹框 -->
<HospitalDetail {hospital} bind:domRef={popupDetail} on:closeDetail={handleClose} />

<HospitalList {hospitalList} />

<LoginAvatar class="absolute right-4 top-4 z-10" />
