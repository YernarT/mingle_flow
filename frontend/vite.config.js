import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(path.resolve(), './src'),
		},
	},
	plugins: [react()],

	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},

	server: {
		host: '0.0.0.0',
		port: 3016,
	},
});
