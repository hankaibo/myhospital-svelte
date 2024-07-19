import { fail, error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import * as api from '$lib/api.js';

export async function load({ locals }) {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	return {
		form: await superValidate(zod(formSchema))
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	upload: async ({ cookies, locals, request }) => {
		if (!locals.user) {
			throw error(401);
		}

		const data = await request.formData();

		const user = {
			firstName: data.get('firstName'),
			lastName: data.get('lastName'),
			oldPassword: data.get('oldPassword'),
			password: data.get('password'),
			photo: data.get('photo')
		};

		const body = await api.patch('files/upload', user, { cookies });
		if (body.errors) {
			return fail(400, body.errors);
		}

		locals.user = body.user;
	},
	save: async ({ cookies, locals, request }) => {
		if (!locals.user) {
			throw error(401);
		}

		const data = await request.formData();

		const user = {
			firstName: data.get('firstName'),
			lastName: data.get('lastName'),
			oldPassword: data.get('oldPassword'),
			password: data.get('password'),
			photo: data.get('photo')
		};

		const body = await api.patch('auth/me', user, { cookies });
		if (body.errors) {
			return fail(400, body.errors);
		}

		const value = btoa(JSON.stringify(body.user));
		cookies.set('jwt', value, { path: '/' });

		locals.user = body.user;
	}
};
