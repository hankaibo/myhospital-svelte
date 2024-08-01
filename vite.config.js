import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/tile': {
				target: 'https://t0.tianditu.gov.cn',
				changeOrigin: true,
				rewrite: (path) => {
					return path.replace(/^\/tile/, '') + '&tk=42974d10cfa313d12aefa1a633e50a0c';
				},
				configure: (proxy, options) => {
					// 处理代理配置
					options.headers = {
						Referer: 'https://t0.tianditu.gov.cn'
					};
				},
				bypass: (req, res, proxyOptions) => {
					const t = Math.floor(Math.random() * 8); // 随机选择 t0 到 t7 之间的一个值
					req.headers['Host'] = `t${t}.tianditu.gov.cn`;
					req.url = req.url.replace(/t{0-7}/, `t${t}`);
				}
			}
		}
	}
});
