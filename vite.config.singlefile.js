import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Build « fichier unique » : tout le JS/CSS et l'image sont inlinés dans un seul
// index.html autonome, ouvrable directement dans un navigateur.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 100000000, // inline l'image (base64)
    cssCodeSplit: false,
    outDir: 'dist-html',
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
