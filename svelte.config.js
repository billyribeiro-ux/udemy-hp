import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore missing blog posts, case studies, and favicon during prerender
				if (
					path.startsWith('/blog/') ||
					path.startsWith('/case-studies/') ||
					path === '/favicon.svg'
				) {
					console.warn(`Warning: ${message} (linked from ${referrer})`);
					return;
				}
				throw new Error(message);
			}
		},
		alias: {
			$components: './src/lib/components',
			$assets: './src/lib/assets',
			$lib: './src/lib',
			$utils: './src/lib/utils',
			$types: './src/lib/types'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
