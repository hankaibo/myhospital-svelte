import { error } from '@sveltejs/kit';
import * as api from '$lib/api';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url, cookies }) {
	if (!locals.user) {
		throw error(401);
	}

	/** @type {string} */
	const page = url.searchParams.get('page') ?? '1';
	/** @type {string} */
	const limit = url.searchParams.get('limit') ?? "10";
	/** @type {string} */
	const sort = JSON.stringify([{ orderBy: 'code', order: 'ASC' }])

	const params = new URLSearchParams();
	params.set('page', page);
	params.set('limit', limit);
	params.set('sort', sort)

	const { data, total } = await api.get(`hospitals/pagination?${params}`, { cookies });

	return {
		hospitals: data,
		total: total
	};
}

/** @type {import('./$types').Actions} */
export const actions = {};
