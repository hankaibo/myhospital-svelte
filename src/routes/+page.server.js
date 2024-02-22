import { fail } from '@sveltejs/kit';
import * as api from '$lib/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url, params }) {
	const type = url.searchParams.get('type') || 'circle';
	const longitude = url.searchParams.get('longitude') || '116.397507';
	const latitude = url.searchParams.get('latitude') || '39.908708';
	const radius = url.searchParams.get('radius') || '0';

	const p = new URLSearchParams();
	p.set('type', type);
	p.set('longitude', longitude);
	p.set('latitude', latitude);
	p.set('radius', radius);

	// const body = await api.get(`hospitals?${params}`, locals?.token);

	// if (body.errors) {
	// 	return fail(401, body);
	// }

	// const data = { hospitalList: body.data };

	return {
		post: {
			title: `Title for 1 goes here`,
			content: `Content for 2 goes here`
		}
	};
}
