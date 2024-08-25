import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	preview: {
    host: '0.0.0.0',
    port: 10000, // 원하는 포트로 변경 가능
  },
});
