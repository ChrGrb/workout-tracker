import { sveltekit } from '@sveltejs/kit/vite';
import mkcert from'vite-plugin-mkcert'
import { defineConfig } from 'vite';
import { resolve } from 'path';
import svg from '@poppanator/sveltekit-svg';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

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
	define: {
		'process.env.NODE_ENV': process.env.NODE_ENV === 'production' 
			? '"production"'
			: '"development"'
	},
	plugins: [
		sveltekit(), 
		mkcert(),
		svg({
			includePaths: ['./src/lib/icons/'],
		}),
		SvelteKitPWA({
			srcDir: './src',
			strategies: 'injectManifest',
			filename: 'service-worker.ts',
			scope: '/',
			devOptions: {
				enabled: true,
				type: 'module',
			},
			manifest: {
				short_name: 'Workout Tracker',
				name: 'Workout Tracker',
				description: 'The minimal workout tracking app',
				start_url: '/auth/login',
				scope: '/',
				display: 'standalone',
				theme_color: "#000000",
				background_color: "#ffffff",
				orientation: "portrait",
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'  
					},
					{
						src: 'maskable-icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				],
			},
		}),
	]
});
