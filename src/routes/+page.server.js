import { fail, redirect } from '@sveltejs/kit';
import * as api from '$lib/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, url }) {
	const type = url.searchParams.get('type');
	const center = url.searchParams.get('center');
	const radius = url.searchParams.get('radius');

	const params = new URLSearchParams();
	params.set('type', type);
	params.set('center', center);
	params.set('radius', radius);

	// const body = await api.get(`lala?${params}`, locals?.token);

	// if (body.errors) {
	// 	return fail(401, body);
	// }

	return {};
}
