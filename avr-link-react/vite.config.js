import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE: where the site is served from.
//   '/'            -> custom domain or user site (default)
//   '/AVR-Link/'   -> GitHub project site, e.g. user.github.io/AVR-Link/
// Override at build time:  VITE_BASE=/AVR-Link/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: { outDir: 'docs', emptyOutDir: true },
});
