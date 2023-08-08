const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
export default {	
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}', 		
		require('path').join(
			require.resolve('@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Montserrat', ...defaultTheme.fontFamily.sans]
			}
		},
	},
	plugins: [
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	],
}
