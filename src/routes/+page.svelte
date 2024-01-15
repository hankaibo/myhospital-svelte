<script>
	import { onMount } from 'svelte';
	import { Map, View } from 'ol';
	import { Draw, Modify, Snap, Select } from 'ol/interaction.js';
	import { XYZ, Vector as VectorSource, Cluster } from 'ol/source';
	import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
	import Feature from 'ol/Feature';
	import Overlay from 'ol/Overlay';
	import { fromLonLat, toLonLat, get } from 'ol/proj';
	import { defaults as defaultControls } from 'ol/control.js';
	import { Point, Circle } from 'ol/geom';
	import { Fill, Stroke, Style, Icon, Circle as CircleStyle, Text as TextStyle } from 'ol/style';
	import { click } from 'ol/events/condition';
	import ContextMenu from '$lib/ol/Contextmenu';
	import { Heading, List, Li, A } from 'flowbite-svelte';
	import { CloseSolid } from 'flowbite-svelte-icons';
	import 'ol/ol.css';
	import '$lib/ol/contextmenu.css';

	/** @type {import('./$types').PageData} */
	export let data;

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

	/**
	 * @typedef {Object} Hospital
	 * @property {number} id
	 * @property {string} name
	 * @property {string} code
	 * @property {string} district
	 * @property {string} type
	 * @property {string} level
	 * @property {string} address
	 * @property {string} zipCode
	 * @property {string} introduction
	 * @property {number} [lng]
	 * @property {number} [lat]
	 */
	/** @type {Hospital} */
	let hospital;
	let hospitalList = [];
	/** @type {Array<import('ol/Feature').default>} */
	let allFeature = [];
	/** @type {Array<number>} */
	let beforeCenter = [];
	let beforeMarkList = [];
	/** @type {number} */
	let beforeRadius = 0;
	/** @type {import('ol/Feature').default} */
	let deleteFeature;

	/** @type {Array<import('ol/Feature').default>} */
	let a19AllFeature = [];

	// 瓦片图层
	const rasterLayer = new TileLayer({
		source: new XYZ({
			// 高德
			url: 'https://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&scl=1&x={x}&y={y}&z={z}'
			// crossOrigin: '',
		})
	});
	rasterLayer.set('name', 'rasterLayer');

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
	const styleCache = {};
	const clusterLayer = new VectorLayer({
		source: clusterSource,
		style(feature) {
			const size = feature.get('features').length;
			let style = styleCache[size];
			if (!style) {
				style = new Style({
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
				styleCache[size] = style;
			}
			return style;
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
		/**
		 * Elements that make up the popup.
		 */
		const container = document.getElementById('popup');
		const content = document.getElementById('popup-content');
		const closer = document.getElementById('popup-closer');

		view = new View({
			center: fromLonLat([116.397507, 39.908708]),
			zoom: 13,
			minZoom: 8,
			maxZoom: 18,
			constrainResolution: true,
			extent
		});

		map = new Map({
			target: 'map',
			layers: [rasterLayer, vectorLayer, clusterLayer, a19VectorLayer],
			view,
			overlays: [
				new Overlay({
					id: 'popup',
					element: container,
					autoPan: {
						animation: {
							duration: 250
						}
					}
				})
			],
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
			const center = feature.getGeometry().getCenter();
			const radius = feature.getGeometry().getRadius();
			handleFetch({
				type: 'Circle',
				center: toLonLat(center),
				radius
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
					map.getOverlayById('popup').setPosition(coordinates);
				} else {
					window.alert('聚合元素不可以显示详情，请重新选择。');
				}
			} else {
				evt.stopPropagation();
				const { id, name, code, type, district, level, zipCode, address, introduction } = selectedFeature.getProperties();
				hospital = {
					id,
					name,
					code,
					type,
					district,
					level,
					zipCode,
					address,
					introduction
				};
				const coordinates = evt.coordinate;
				map.getOverlayById('popup').setPosition(coordinates);
			}
		});

		map.on('pointermove', (e) => {
			if (e.dragging) {
				return;
			}
			const hit = map.hasFeatureAtPixel(e.pixel, {
				layerFilter: (layer) => layer.get('name') === 'vectorLayer' || layer.get('name') === 'clusterLayer' || layer.get('name') === 'a19VectorLayer'
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
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { longitude, latitude } = position.coords;
				const center = fromLonLat([longitude, latitude]);
				map.getView().animate({ center });

				// 标记
				const circleFeature = new Feature({
					geometry: new Circle(center, 50)
				});
				circleFeature.setStyle(
					new Style({
						renderer: function renderer(coordinates, state) {
							const coordinates0 = coordinates[0];
							const x = coordinates0[0];
							const y = coordinates0[1];
							const coordinates1 = coordinates[1];
							const x1 = coordinates1[0];
							const y1 = coordinates1[1];
							const ctx = state.context;
							const dx = x1 - x;
							const dy = y1 - y;
							const radius = Math.sqrt(dx * dx + dy * dy);

							const innerRadius = 0;
							const outerRadius = radius * 1.4;

							const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
							gradient.addColorStop(0, 'rgba(255,0,0,0)');
							gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
							gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
							ctx.beginPath();
							ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
							ctx.fillStyle = gradient;
							ctx.fill();

							ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
							ctx.strokeStyle = 'rgba(255,0,0,1)';
							ctx.stroke();
						}
					})
				);

				const circle = new Feature({
					geometry: new Point(center)
				});
				circle.setStyle(
					new Style({
						image: new CircleStyle({
							radius: 0,
							stroke: new Stroke({
								color: 'red'
							})
						})
					})
				);
				a19VectorSource.addFeature(circleFeature);
				a19VectorSource.addFeature(circle);
				map.addLayer(userVectorLayer);

				// 动画
				let radius = 0;
				map.on('postcompose', () => {
					radius += 1;
					radius %= 20;
					circle.setStyle(
						new Style({
							image: new CircleStyle({
								radius,
								stroke: new Stroke({
									color: 'red'
								})
							})
						})
					);
				});
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
	 * @param {Array} list
	 */
	function addMarker(list) {
		if (!Array.isArray(list)) {
			return;
		}

		const newList = [];
		list
			// 过滤已绘制的
			.filter((item) => !allFeature.includes(item.id))
			.forEach((item) => {
				allFeature.push(item.id);
				newList.push(item);
			});

		const featureList = [];
		newList.forEach((item) => {
			const iconFeature = new Feature({
				geometry: new Point(fromLonLat([item.lng, item.lat])),
				id: item.id,
				name: item.name,
				code: item.code,
				type: item.type,
				district: item.district,
				level: item.level,
				postalCode: item.postalCode,
				address: item.address,
				introduction: item.introduction
			});
			featureList.push(iconFeature);
		});
		markerVectorSource.addFeatures(featureList);
		beforeMarkList = [];
	}

	/**
	 * 添加A类医院
	 * @param list
	 */
	function addMarkerA19(list) {
		if (!list || !Array.isArray(list) || Object.keys(list).length) {
			return;
		}
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
				level: item.level,
				postalCode: item.postalCode,
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
		map.getOverlayById('popup').setPosition(undefined);
		return false;
	}

	/**
	 * 【弹出层】，从医院名称跳转到官网详情页面
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

	/**
	 * 根据坐标范围查询医院数据
	 * @param params
	 */
	function handleFetch() {
		const dataMock = [
			{
				id: 9467,
				name: '北京丰台右安门医院',
				code: '06110017',
				district: '丰台区',
				type: '对外综合',
				level: '三级',
				address: '北京市丰台区右安门外大街199号',
				postalCode: '110106',
				introduction: '',
				lng: 116.361553,
				lat: 39.859265
			},
			{
				id: 9332,
				name: '丰台区右安门街道玉林西里社区卫生服务站',
				code: '06162090',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区右安门外翠林一里17号楼107-108室',
				postalCode: '110106',
				introduction: '',
				lng: 116.366663,
				lat: 39.857547
			},
			{
				id: 9487,
				name: '北京市丰台区右安门翠林敬老院医务室',
				code: '06100099',
				district: '丰台区',
				type: '对内',
				level: '未评级',
				address: '北京市丰台区右安门外翠林二里九号楼',
				postalCode: '110106',
				introduction: '',
				lng: 116.368738,
				lat: 39.859625
			},
			{
				id: 9375,
				name: '丰台区右安门街道玉林社区卫生服务站',
				code: '06162028',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区右安门外玉林里38号楼',
				postalCode: '110106',
				introduction: '',
				lng: 116.359383,
				lat: 39.863242
			},
			{
				id: 9368,
				name: '丰台区右安门街道翠林社区卫生服务站',
				code: '06162035',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区翠林小区二里1号楼',
				postalCode: '110106',
				introduction: '',
				lng: 116.371493,
				lat: 39.860167
			},
			{
				id: 9418,
				name: '北京开阳中医医院',
				code: '06151200',
				district: '丰台区',
				type: '对外中医',
				level: '一级',
				address: '北京市丰台区右安门外东三条1号',
				postalCode: '110106',
				introduction: '',
				lng: 116.365395,
				lat: 39.86551
			},
			{
				id: 9430,
				name: '首都医科大学校医院',
				code: '06141004',
				district: '丰台区',
				type: '对外综合',
				level: '未评级',
				address: '北京市丰台区右安门外西头条10号',
				postalCode: '110106',
				introduction: '',
				lng: 116.354228,
				lat: 39.863791
			},
			{
				id: 9414,
				name: '北京市丰台区马家堡社区卫生服务中心',
				code: '06152001',
				district: '丰台区',
				type: '对外综合',
				level: '一级',
				address: '北京市丰台区马家堡嘉园二里14号',
				postalCode: '110106',
				introduction: '',
				lng: 116.374709,
				lat: 39.850852
			},
			{
				id: 9372,
				name: '丰台区马家堡街道马家堡社区卫生服务站',
				code: '06162031',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区马家堡西里53号楼',
				postalCode: '110106',
				introduction: '',
				lng: 116.374521,
				lat: 39.850544
			},
			{
				id: 9334,
				name: '北京市丰台区马家堡街道镇国寺社区卫生服务站',
				code: '06162076',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区镇国寺北街4号院2号楼底商601室',
				postalCode: '110106',
				introduction: '',
				lng: 116.362491,
				lat: 39.845087
			},
			{
				id: 9975,
				name: '北京市西城区月坛街道复外24号楼社区卫生服务站',
				code: '02162002',
				district: '西城区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市西城区复外大街24号楼老干部活动室',
				postalCode: '110106',
				introduction: '',
				lng: 116.362491,
				lat: 39.845087
			},
			{
				id: 9472,
				name: '北京市丰台区右安门社区卫生服务中心',
				code: '06110011',
				district: '丰台区',
				type: '对外综合',
				level: '一级',
				address: '北京市丰台区右安门外开阳里二街5号',
				postalCode: '110106',
				introduction: '',
				lng: 116.368813,
				lat: 39.86689
			},
			{
				id: 9412,
				name: '首都医科大学附属北京佑安医院（传染病专科）',
				code: '06154001',
				district: '丰台区',
				type: '对外专科',
				level: '三级',
				address: '北京市丰台区右安门外西头条8号',
				postalCode: '110106',
				introduction: '',
				lng: 116.355575,
				lat: 39.866847
			},
			{
				id: 9347,
				name: '丰台区西罗园街道洋桥西里社区卫生服务站',
				code: '06162056',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区洋桥西里29号楼前商用房',
				postalCode: '110106',
				introduction: '',
				lng: 116.378503,
				lat: 39.858141
			},
			{
				id: 9305,
				name: '北京市丰台区卢沟桥乡万泉寺村社区卫生服务站',
				code: '06162146',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区柳村路九号院10号楼裙房一层',
				postalCode: '110106',
				introduction: '',
				lng: 116.345532,
				lat: 39.856576
			},
			{
				id: 9376,
				name: '丰台区西罗园街道洋桥北里社区卫生服务站',
				code: '06162027',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区洋桥北里小区38号楼一层东侧',
				postalCode: '110106',
				introduction: '',
				lng: 116.380134,
				lat: 39.860901
			},
			{
				id: 9410,
				name: '北京博爱医院',
				code: '06155001',
				district: '丰台区',
				type: '对外综合',
				level: '三级',
				address: '北京市丰台区角门北路10号',
				postalCode: '110106',
				introduction: '',
				lng: 116.379032,
				lat: 39.849267
			},
			{
				id: 9324,
				name: '北京市丰台区花乡草桥村社区卫生服务站',
				code: '06162126',
				district: '丰台区',
				type: '社区卫生站',
				level: '未评级',
				address: '北京市丰台区草桥欣园乙10号楼',
				postalCode: '110106',
				introduction: '',
				lng: 116.352021,
				lat: 39.844291
			},
			{
				id: 9879,
				name: '北京市西城区证仁医院',
				code: '04110016',
				district: '西城区',
				type: '对外综合',
				level: '一级',
				address: '北京市西城区右安门西街临4号',
				postalCode: '110102',
				introduction: '',
				lng: 116.357705,
				lat: 39.870383
			},
			{
				id: 9407,
				name: '北京市丰台区妇幼保健计划生育服务中心（北京市丰台区妇幼保健院）',
				code: '06159071',
				district: '丰台区',
				type: '对外专科',
				level: '二级',
				address: '北京市丰台区开阳里三区1号/北京市丰台区风格与林苑甲37号楼',
				postalCode: '110106',
				introduction: '',
				lng: 116.373794,
				lat: 39.86824
			}
		];
		new Promise(() => {
			setTimeout(() => {
				addMarker(dataMock);
			}, 1000);
		});
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

<div id="map" class="h-[calc(100vh-73px)]"></div>
<div
	id="popup"
	class="absolute bg-white shadow p-4 rounded-lg border border-gray-300 bottom-3 -left-12 min-w-max after:top-full after:border-transparent after:h-0 after:w-0 after:absolute after:pointer-events-none after:border-t-white after:border-[10px] after:left-12 after:-ml-2.5 before:top-full before:border-transparent before:h-0 before:w-0 before:absolute before:pointer-events-none before:border-t-slate-200 before:border-[11px] before:left-1 before:-ml-3"
>
	<CloseSolid class="absolute top-5 right-4 cursor-pointer" size="sm" on:click={handleClose} />
	<div id="popup-content">
		<Heading tag="h2" customSize="text-lg font-semibold" class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">医院信息</Heading>
		<List tag="ul" class="mb-8 space-y-4 text-gray-500 dark:text-gray-400" list="none">
			<Li class="gap-3">
				<span class="mr-2 text-gray-900">医院名称</span>
				<A class="mr-2 text-gray-900" on:click={() => handleDetail(hospital?.name)}>{hospital?.name}</A>
			</Li>
			<Li class="gap-3">
				<span class="mr-2 text-gray-900">医院编码</span>
				{hospital?.code}
			</Li>
			<Li class="gap-3">
				<span class="mr-2 text-gray-900">医院等级</span>
				{hospital?.level}
			</Li>
			<Li class="gap-3">
				<span class="mr-2 text-gray-900">医院类别</span>
				{hospital?.type}
			</Li>
			<Li class="gap-3">
				<span class="mr-2 text-gray-900">单位地址</span>
				{hospital?.address}
			</Li>
			<Li class="gap-3">
				<span class="mr-2 text-gray-900">医院简介</span>
				{hospital?.introduction}
			</Li>
		</List>
	</div>
</div>
