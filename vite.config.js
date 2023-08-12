import { sveltekit } from '@sveltejs/kit/vite';
import mkcert from'vite-plugin-mkcert'
import { defineConfig } from 'vite';
import { resolve } from 'path';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	server: {
		https: true,
		host: 'dev.workout-tracker.com',
		watch: {
			usePolling: true,
		},
	},
	resolve: {
		alias: {
			$: resolve('./src'),
		},
	},
	plugins: [
		sveltekit(), 
		mkcert(),
		svg({
			includePaths: ['./src/lib/icons/'],
		}),
	]
});
