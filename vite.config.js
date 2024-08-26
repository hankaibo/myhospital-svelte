import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const { VITE_JSCODE } = env;

	return {
		plugins: [sveltekit()],
		server: {
			proxy: {
				// 代理 '/api/v1/hospitals' 请求到目标地址
				'/api/v1': 'http://localhost:3000',
				'/_AMapService/': {
					target: 'https://restapi.amap.com/',
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/_AMapService/, ''),
					configure: (proxy, options) => {
						proxy.on('proxyReq', (proxyReq, req, res) => {
							let originalUrl = new URL(req.url, `http://${req.headers.host}`);
							let searchParams = new URLSearchParams(originalUrl.search);

							// Add the jscode parameter
							searchParams.append('jscode', VITE_JSCODE);

							// Set the modified search params back to the URL
							proxyReq.path = `${originalUrl.pathname}?${searchParams.toString()}`;
						});
					}
				}
			}
		}
	};
});
