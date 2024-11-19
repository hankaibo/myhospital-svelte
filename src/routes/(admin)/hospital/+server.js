import { json } from '@sveltejs/kit';
import * as api from '$lib/api.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, cookies }) {
	const city = 'beijing';

	const body = await api.get(`hospitals/sync/${city}`, { cookies });

	return json({
		body
	});
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ request, cookies }) {
	const { id, lng, lat } = await request.json();

	const body = await api.patch(
		`hospitals/${id}`,
		{
			lng,
			lat
		},
		{ cookies }
	);

	return json({
		body
	});
}
