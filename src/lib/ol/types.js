import MapBrowserEvent from 'ol/MapBrowserEvent';

/**
 * @typedef {import('ol/Map').default} OlMap
 * @typedef {import('ol/coordinate').Coordinate} Coordinate
 */

/**
 * @enum {string}
 */
export const EventTypes = {
	CONTEXTMENU: 'contextmenu',
	CLICK: 'click',
	DBLCLICK: 'dblclick'
};

/**
 * @enum {string}
 */
export const CustomEventTypes = {
	BEFOREOPEN: 'beforeopen',
	OPEN: 'open',
	CLOSE: 'close',
	ADD_MENU_ENTRY: 'add-menu-entry'
};

/**
 * @typedef {'beforeopen' | 'open'} TypeEnum
 */

/**
 * @class
 * @extends MapBrowserEvent<MouseEvent>
 */
export class ContextMenuEvent extends MapBrowserEvent {
	/**
	 * @param {Object} options
	 * @param {TypeEnum} options.type
	 * @param {OlMap} options.map
	 * @param {MouseEvent} options.originalEvent
	 */
	constructor(options) {
		super(options.type, options.map, options.originalEvent);
	}
}

/**
 * @typedef {Object} CallbackObject
 * @property {Coordinate} coordinate
 * @property {unknown} data
 */

/**
 * @typedef {'-'} ItemSeparator
 */

/**
 * @typedef {Object} SingleItem
 * @property {string} text
 * @property {string} [classname]
 * @property {string} [icon]
 * @property {(object: CallbackObject, map: OlMap) => void} callback
 * @property {unknown} [data]
 */

/**
 * @typedef {Object} MenuEntry
 * @property {string} id
 * @property {boolean} isSubmenu
 * @property {boolean} isInsideSubmenu
 * @property {boolean} isSeparator
 * @property {(object: CallbackObject, map: OlMap) => void | null} callback
 * @property {unknown} data
 */

/**
 * @typedef {Object} ItemWithNested
 * @property {string} text
 * @property {string} [classname]
 * @property {string} [icon]
 * @property {Item[]} items
 */

/**
 * @typedef {(SingleItem | ItemSeparator | ItemWithNested)} Item
 */

/**
 * @typedef {Object} Options
 * @property {number} width
 * @property {number} scrollAt
 * @property {`${EventTypes}`} eventType
 * @property {boolean} defaultItems
 * @property {Item[]} items
 */
