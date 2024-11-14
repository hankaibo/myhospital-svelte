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

	const { data, total } = await api.get(`hospitals/pagination?${params}`, { cookies });

	return {
		hospitals: data,
		total: total
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	// 更新医院信息
	update: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const body = await api.post('hospitals/', form.data);

		if (body.errors) {
			return fail(401, body);
		}

		const value = btoa(JSON.stringify(body));
		cookies.set('jwt', value, { path: '/' });

		throw redirect(307, '/');
	}
};
