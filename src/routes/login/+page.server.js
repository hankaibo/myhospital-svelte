import { fail, redirect } from '@sveltejs/kit';
import * as api from '$lib/api.js';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { superValidate } from 'sveltekit-superforms';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	if (locals.user) {
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
	default: async (event) => {
		const { cookies, request } = event;
		const data = await request.formData();

		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const body = await api.post('auth/email/login', {
			email: data.get('email'),
			password: data.get('password')
		});

		if (body.errors) {
			return fail(401, body);
		}

		const value = btoa(JSON.stringify(body));
		cookies.set('jwt', value, { path: '/' });

		throw redirect(307, '/');
	}
};
