import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	const { VITE_JSCODE } = env;

	return {
		plugins: [sveltekit()],
		server: {
			proxy: {
				'/api/v1': {
					target: 'http://localhost:3000',
					changeOrigin: true,
					configure: (proxy, options) => {
					  // proxy 是 'http-proxy' 的实例
					  proxy.on('proxyReq', (proxyReq, req, res) => {
						// proxyReq is the proxy request object from 'http-proxy'
						// req and res are the original request and response objects from the client
						// You can modify proxyReq here if needed
						// console.log('proxyReq:', options);
					  });
					}
				  },
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
