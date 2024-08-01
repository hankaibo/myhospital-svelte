import { fail, error, redirect } from '@sveltejs/kit';
import * as api from '$lib/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url, cookies }) {
	if (!locals.user) {
		throw error(401);
	}

	const page = url.searchParams.get('page') ?? 1;
	const limit = url.searchParams.get('limit') || 10;

	const params = new URLSearchParams();
	params.set('page', '' + page);
	params.set('limit', '' + limit);

	const body = await api.get(`users?${params}`, { cookies });

	if (body.errors) {
		return fail(401, body);
	}
	return {
		users: body.data,
		hasNextPage: body.hasNextPage
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	add: async ({ request, cookies }) => {
		const data = await request.formData();

		const user = {
			email: data.get('email'),
			password: data.get('password'),
			firstName: data.get('firstName'),
			lastName: data.get('lastName')
		};

		const body = await api.post('users', user, { cookies });

		if (body.errors) {
			return fail(401, body);
		}

		throw redirect(307, '/');
	},
	delete: async ({ locals, request, cookies }) => {
		if (!locals.user) throw error(401);

		const data = await request.formData();
		const id = data.get('id');

		await api.del(`users/${id}`, { cookies });
		throw redirect(307, '/user');
	}
};
