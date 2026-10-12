import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
const apiTarget = `http://127.0.0.1:${process.env.API_PORT || 8000}`;
export default defineConfig({
  plugins: [svelte()],
  build: { manifest: true, cssCodeSplit: false },
  server: { strictPort: true, proxy: { '/api': apiTarget } },
  preview: { proxy: { '/api': apiTarget } },
});
