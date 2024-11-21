import * as api from '$lib/api.js';

/**
 *
 * 同步医院
 * @type {import('./$types').RequestHandler}
 *
 */
export async function GET({ cookies }) {
	const city = 'beijing';

	await api.get(`hospitals/sync/${city}`, { cookies });

	return new Response(null, { status: 204 });
}

/**
 *
 * 定位医院，修改医院的经纬度信息
 * @type {import('./$types').RequestHandler}
 *
 */
export async function PATCH({ request, cookies }) {
	const { id, lng, lat } = await request.json();

	await api.patch(
		`hospitals/${id}`,
		{
			lng,
			lat
		},
		{ cookies }
	);

	return new Response(null, { status: 204 });
}

/**
 *
 * 复制医院
 * @type {import('./$types').RequestHandler}
 *
 */
export async function POST({ request, cookies }) {
	const { id } = await request.json();

	if (id) {
		// 复制单个医院信息
		await api.post(`hospitals/${id}/copy`, {}, { cookies });
	} else {
		// 复制单个医院信息
		await api.post('hospitals/copy', {}, { cookies });
	}
	return new Response(null, { status: 204 });
}

/**
 *
 * 删除医院
 * @type {import('./$types').RequestHandler}
 *
 */
export async function DELETE({ request, cookies }) {
	const { id } = await request.json();

	await api.del(`hospitals/${id}`, { cookies });

	return new Response(null, { status: 204 });
}
