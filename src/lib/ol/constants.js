/**
 * @type {import("./types").Options}
 */
export const DEFAULT_OPTIONS = {
	width: 150,
	scrollAt: 4,
	eventType: 'contextmenu',
	defaultItems: true,
	items: []
};

const NAMESPACE = 'ol-ctx-menu';

export const CSS_CLASSES = {
	namespace: NAMESPACE,
	container: `${NAMESPACE}-container`,
	separator: `${NAMESPACE}-separator`,
	submenu: `${NAMESPACE}-submenu`,
	hidden: `${NAMESPACE}-hidden`,
	icon: `${NAMESPACE}-icon`,
	zoomIn: `${NAMESPACE}-zoom-in`,
	zoomOut: `${NAMESPACE}-zoom-out`,
	unselectable: `ol-unselectable`
};

/**
 * @type {Array<import('./types').SingleItem>}
 */
export const DEFAULT_ITEMS = [
	{
		text: 'Zoom In',
		classname: `${CSS_CLASSES.zoomIn} ${CSS_CLASSES.icon}`,
		callback: (object, map) => {
			const view = map.getView();

			view.animate({
				zoom: Number(view.getZoom()) + 1,
				duration: 700,
				center: object.coordinate
			});
		}
	},
	{
		text: 'Zoom Out',
		classname: `${CSS_CLASSES.zoomOut} ${CSS_CLASSES.icon}`,
		callback: (object, map) => {
			const view = map.getView();

			view.animate({
				zoom: Number(view.getZoom()) - 1,
				duration: 700,
				center: object.coordinate
			});
		}
	}
];
