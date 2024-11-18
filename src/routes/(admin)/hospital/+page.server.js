import { error } from '@sveltejs/kit';
import * as api from '$lib/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url, cookies }) {
	if (!locals.user) {
		throw error(401);
	}

	const page = url.searchParams.get('page') ?? 1;
	const limit = url.searchParams.get('limit') ?? 10;

	const params = new URLSearchParams();
	params.set('page', '' + page);
	params.set('limit', '' + limit);

	const { data, total } = await api.get(`hospitals/pagination?${params}`, { cookies });

	return {
		hospitals: data,
		total: total
	};
}

/** @type {import('./$types').Actions} */
export const actions = {};
