import { defineConfig } from 'vite';

export default defineConfig({
  base: '/hand-tracker/',
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
});
