import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import * as api from '$lib/api.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
	const { user } = await parent();
	if (user) {
		throw redirect(307, '/');
	}

	const response = await fetch('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
	const data = await response.json();
	const url = `https://cn.bing.com${data.images[0].url}`;
	return {
		url,
		form: await superValidate(zod(formSchema))
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const body = await api.post('auth/email/register', form.data);

		if (body.errors) {
			return fail(401, body);
		}

		throw redirect(307, `${base}/login`);
	}
};
