import { error, fail } from '@sveltejs/kit';
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

	const body = await api.get(`hospitals/all?${params}`, { cookies });

	if (body?.errors) {
		return fail(401, body);
	}

	return {
		hospitals: body.data,
		hasNextPage: body.hasNextPage
	};
}
