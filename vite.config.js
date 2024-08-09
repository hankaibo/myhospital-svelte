import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

export default defineConfig({
	base:  process.env.VITE_BASE || '/',
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/tile': {
				target: 'https://t0.tianditu.gov.cn',
				changeOrigin: true,
				rewrite: (path) => {
					if (path && process.env.VITE_TK) {
						const url = `${path.replace(/^\/tile/, '')}&tk=${process.env.VITE_TK}`;
						return url;
					}
					throw new Error('Path or VITE_TK is missing');
				},
				configure: (proxy, options) => {
					if (options) {
						options.headers = options.headers || {};
						options.headers.Referer = 'https://t0.tianditu.gov.cn';
					}
				},
				bypass: (req, res, proxyOptions) => {
					if (req && req.url && proxyOptions) {
						const t = Math.floor(Math.random() * 8); // Randomly select a value between 0 and 7
						req.headers.Host = `t${t}.tianditu.gov.cn`;
						req.url = req.url.replace(/t{0-7}/, `t${t}`);
					} else {
						throw new Error('Invalid arguments for bypass function');
					}
				}
			}
		}
	}
});
