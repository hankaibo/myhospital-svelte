import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

export default defineConfig({
	base: process.env.VITE_BASE || '/',
	plugins: [sveltekit()]
});
