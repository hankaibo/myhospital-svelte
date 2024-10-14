import adapter from '@sveltejs/adapter-node';

import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.development' });
// console.log(process.env); // 检查 VITE_BASE 是否正确加载

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		paths: {
			base: process.env.VITE_BASE
		}
	}
};

export default config;
