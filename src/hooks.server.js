import { handleRefreshToken } from './lib/api';

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');
	const { user = undefined, token = undefined, refreshToken = undefined } = jwt ? JSON.parse(atob(jwt)) : {};
	console.log('token:', token);
	console.log('refreshToken:', refreshToken);

	event.locals.user = user;
	event.locals.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6eyJpZCI6MX0sInNlc3Npb25JZCI6MTUsImlhdCI6MTcyMTIwNDA5NCwiZXhwIjoxNzIxMjA0OTk0fQ.ufnDumWsYVN-6gKb1jmwBY2PwbBgzDvw1mQ6hGsvyY8' || token;
	event.locals.refreshToken = refreshToken;

	let response;

	// 尝试原始请求
	try {
		response = await resolve(event);
	} catch (err) {
		if (err.status === 401 && refreshToken) {
			// 尝试刷新令牌
			const refreshResponse = await handleRefreshToken(refreshToken);

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				const { token: newToken } = data;
				const value = btoa(JSON.stringify({ ...data, user }));

				// 设置新的 JWT 到 cookie 中
				event.cookies.set('jwt', value, { path: '/' });

				// 更新 locals 中的 token
				event.locals.token = newToken;

				// 重新尝试原始请求
				event.request.headers.set('Authorization', `Bearer ${newToken}`);
				response = await resolve(event);
			} else {
				// 如果刷新令牌失败，清除 cookies 并重定向到登录页面
				event.cookies.delete('jwt', { path: '/' });
				throw redirect(302, '/login');
			}
		} else {
			throw err;
		}
	}

	return response;
};
