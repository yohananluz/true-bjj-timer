import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces for local testing across devices (TV, mobile)
    port: 3000
  }
});

