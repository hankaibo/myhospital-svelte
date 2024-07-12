// place files you want to import through the `$lib` alias in this folder.
import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';

const base = 'http://localhost:3000/api/v1';

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
 * @param {object} options The request options.
 * @param {string} [options.method] The HTTP method to use.
 * @param {string} options.path The path to the resource.
 * @param {object} [options.data] The request data.
 * @param {string} [options.token] The authentication token.
 * @param {RequestHeaders} [options.headers] The HTTP headers.
 * @returns {Promise<Response>} The promise for the response.
 */
async function send({ method, path, data, token, headers = {} }) {
	/** @type {RequestOptions} */
	const opts = { method, headers };

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['Authorization'] = `Bearer ${token}`;
	}

	const res = await fetch(`${base}/${path}`, opts);
	if (res.ok || res.status === 422) {
		const text = await res.text();
		return text ? JSON.parse(text) : {};
	}

	if (res.status === 401) {
		try {
			const newToken = await refreshAccessToken();

			if (newToken) {
				headers['Authorization'] = `Bearer ${newToken}`;
				response = await fetch(`${base}/${path}`, opts);
			} else {
				throw new Error('Unable to refresh token');
			}
		} catch (error) {
			console.error('Token refresh failed', error);
			goto('/login');
		}
	}

	throw error(res.status);
}

/**
 *
 * @param {string} path
 * @param {string} [token]
 * @param {object} [headers]
 * @returns
 */
export function get(path, token, headers) {
	return send({ method: 'GET', path, token, headers });
}

/**
 *
 * @param {string} path
 * @param {string} token
 * @returns
 */
export function del(path, token) {
	return send({ method: 'DELETE', path, token });
}

/**
 *
 * @param {string} path
 * @param {object} data
 * @param {string} [token]
 * @returns
 */
export function post(path, data, token) {
	return send({ method: 'POST', path, data, token });
}

/**
 *
 * @param {string} path
 * @param {object} data
 * @param {string} token
 * @returns
 */
export function put(path, data, token) {
	return send({ method: 'PUT', path, data, token });
}

/**
 *
 * @param {string} path
 * @param {object} data
 * @param {string} token
 * @returns
 */
export function patch(path, data, token) {
	return send({ method: 'PATCH', path, data, token });
}

let refreshingToken = false;
let subscribers = [];

async function refreshAccessToken() {
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
				Authorization: `Bearer ${getToken()}`
			}
		});

		if (res.ok) {
			const { accessToken } = await res.json();

			// Notify all subscribers that the token has been refreshed
			subscribers.forEach((resolve) => resolve(accessToken));
			subscribers = [];
			refreshingToken = false;

			return accessToken;
		} else {
			throw new Error('Failed to refresh token');
		}
	} catch (error) {
		refreshingToken = false;
		throw error;
	}
}
