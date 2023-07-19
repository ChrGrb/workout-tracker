import { sveltekit } from '@sveltejs/kit/vite';
import mkcert from'vite-plugin-mkcert'
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	server: {
		https: true,
		host: 'dev.workout-tracker.com'
	},
	resolve: {
		alias: {
			$: resolve('./src'),
		},
	},
	plugins: [sveltekit(), mkcert()]
});
