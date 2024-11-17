/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');
	const {
		user = undefined,
		token = undefined,
		refreshToken = undefined
	} = jwt ? JSON.parse(jwt) : {};

	event.locals.user = user;
	event.locals.token = token;
	event.locals.refreshToken = refreshToken;

	if (event.route.id?.startsWith('/(admin)')) {
		if (!user || user.role.name !== 'Admin') {
			return new Response('Unauthorized', { status: 401 });
		}
	}

	return await resolve(event);
};
