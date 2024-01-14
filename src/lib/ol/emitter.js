/**
 * @typedef {Object} EventObject
 * @property {Object.<string, Array<{fn:function, ctx:object}>>} [name]
 */

class E {
	/**
	 *
	 * @param {string} name
	 * @param {function} callback
	 * @param {object} [ctx]
	 * @returns {object}
	 */
	on(name, callback, ctx) {
		/** @type {EventObject} */
		const e = this.e || (this.e = {});

		(e[name] || (e[name] = [])).push({
			fn: callback,
			ctx
		});

		return this;
	}

	/**
	 *
	 * @param {string} name
	 * @param {function} callback
	 * @param {object} [ctx]
	 * @returns  {object}
	 */
	once(name, callback, ctx) {
		let self = this;
		/**
		 *
		 * @param  {...any} args
		 */
		function listener(...args) {
			self.off(name, listener);
			callback.apply(ctx, args);
		}

		listener._ = callback;
		return this.on(name, listener, ctx);
	}

	/**
	 *
	 * @param {string} name
	 * @param {any[]} args
	 * @returns {object}
	 */
	emit(name, ...args) {
		let events = ((this.e || (this.e = {}))[name] || []).slice();

		let i = 0;
		let len = events.length;
		for (i; i < len; i++) {
			events[i].fn.apply(events[i].ctx, args);
		}

		return this;
	}

	/**
	 *
	 * @param {string} name
	 * @param {function} [callback]
	 * @returns {object}
	 */
	off(name, callback) {
		let e = this.e || (this.e = {});
		let events = e[name];
		let liveEvents = [];

		if (events && callback) {
			for (let i = 0, len = events.length; i < len; i++) {
				if (events[i].fn !== callback && events[i].fn._ !== callback) {
					liveEvents.push(events[i]);
				}
			}
		}

		liveEvents.length ? (e[name] = liveEvents) : delete e[name];

		return this;
	}
}

export default E;
