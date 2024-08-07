// place files you want to import through the `$lib` alias in this folder.
import { error } from '@sveltejs/kit';

const base = import.meta.env.VITE_BASE_URL;

/**
 * @typedef {object} RequestHeaders
 * @property {string} [Authorization] The authentication token.
 * @property {string} [Content-Type] The content type of the request.
 */

/**
 * @typedef {object} RequestOptions
 * @property {string} [method] The HTTP method to use.
 * @property {RequestHeaders} headers The HTTP headers.
 * @property {string|undefined} [body] The request payload as a stringified JSON object.
 */

/**
 * Sends a request to the server.
 *
 * @async
 * @param {object} options The request options.
 * @param {string} options.method The HTTP method to use.
 * @param {string} options.url The path to the resource.
 * @param {object|null|undefined} [options.data] The request data.
 * @param {RequestHeaders} [options.headers] The HTTP headers.
 * @param {Record<string, any>} [options.cookies] The HTTP headers.
 * @returns {Promise<object>} - The response from the server, parsed as a JSON object.
 * @throws {HttpError} This error instructs SvelteKit to initiate HTTP error handling.
 * @throws {Error} If the provided status is invalid (not between 400 and 599).
 */
async function send({ method, url, data, headers = {}, cookies }) {
	/** @type {RequestOptions} */
	const opts = { method, headers };

	/** @type {string} */
	let token = '';
	/** @type {string} */
	let refreshToken = '';
	let user = {};

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (cookies) {
		const jwt = cookies.get('jwt');
		({ token, refreshToken, user } = JSON.parse(atob(jwt)));
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(`${base}/${url}`, opts);
	if (res.ok || res.status === 422) {
		const text = await res.text();
		return text ? JSON.parse(text) : {};
	}

	if (res.status === 401) {
		try {
			const { token: newToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);
			const value = btoa(JSON.stringify({ token: newToken, refreshToken: newRefreshToken, user }));
			cookies?.set('jwt', value, { path: '/' });

			if (newToken) {
				headers['Authorization'] = `Bearer ${newToken}`;

				const retryRes = await fetch(`${base}/${url}`, opts);
				const retryText = await retryRes.text();

				return retryText ? JSON.parse(retryText) : {};
			} else {
				throw new Error('Unable to refresh token');
			}
		} catch (err) {
			console.error('Token refresh failed', err);
		}
	}

	throw error(res.status);
}

/**
 *
 * @param {string} url
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {object} [options.cookies]
 * @returns
 */
export function get(url, options = {}) {
	return send({ method: 'GET', url, ...options });
}

/**
 *
 * @param {string} url
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {object} [options.cookies]
 * @returns
 */
export function del(url, options = {}) {
	return send({ method: 'DELETE', url, ...options });
}

/**
 *
 * @param {string} url
 * @param {object|null|undefined} data
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {object} [options.cookies]
 * @returns {Promise<object>} - The response from the server, parsed as a JSON object.
 * @throws {Error} If an HTTP error occurs.
 */
export function post(url, data, options = {}) {
	return send({ method: 'POST', url, data, ...options });
}

/**
 *
 * @param {string} url
 * @param {object} data
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {object} [options.cookies]
 * @returns
 */
export function put(url, data, options = {}) {
	return send({ method: 'PUT', url, data, ...options });
}

/**
 *
 * @param {string} url
 * @param {object} data
 * @param {object} [options]
 * @param {object} [options.headers]
 * @param {object} [options.cookies]
 * @returns
 */
export function patch(url, data, options = {}) {
	return send({ method: 'PATCH', url, data, ...options });
}

/** @type {boolean} */
let refreshingToken = false;

/** @type {any[]} */
let subscribers = [];

/**
 *
 * @param {string} refreshToken
 * @returns
 */
async function refreshAccessToken(refreshToken) {
	if (refreshingToken) {
		// If already refreshing, return a promise that resolves when the refresh is done
		return new Promise((resolve) => {
			subscribers.push(resolve);
		});
	}

	refreshingToken = true;

	try {
		const res = await fetch(`${base}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${refreshToken}`
			}
		});

		if (res.ok) {
			const { token, refreshToken } = await res.json();

			// Notify all subscribers that the token has been refreshed
			subscribers.forEach((resolve) => resolve(token));
			subscribers = [];
			refreshingToken = false;

			return { token, refreshToken };
		} else {
			throw new Error('Failed to refresh token');
		}
	} catch (error) {
		refreshingToken = false;
		throw error;
	}
}
