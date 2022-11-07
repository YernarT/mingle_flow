import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';
import react from '@vitejs/plugin-react';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(path.resolve(), './src'),
		},
	},
	
	plugins: [
		react(),
		vitePluginImp({
			optimize: true,
			libList: [
				{
					libName: 'antd',
					libDirectory: 'es',
					style: name => `antd/es/${name}/style`,
				},
			],
		}),
	],

	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},

});
