import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	appType: 'mpa', // disable "mod-rewrite"-like behaviour
	plugins: [
		tailwindcss(),
		react(),
	],
	server: {
		open: false,
		host: '127.0.0.1',
		port: 3000,
		strictPort: true,
	},
	preview: {
		open: false,
		host: '127.0.0.1',
		port: 3000,
		strictPort: true,
	},
});
