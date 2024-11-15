import { fail, error, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import * as api from '$lib/api.js';

/** @type {import('./$types').Actions} */
export const actions = {
	logout: async ({ cookies, locals }) => {
		if (!locals.user) {
			throw error(401);
		}

		const body = await api.post('auth/logout', null, { cookies });
		if (body.errors) {
			return fail(400, body.errors);
		}

		cookies.delete('jwt', { path: '/' });
		locals.user = null;

		throw redirect(307, `${base}/login`);
	}
};
