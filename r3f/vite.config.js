import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base: './' → chemins relatifs, le build fonctionne depuis n'importe quel sous-dossier statique.
// SINGLE=1 → build tout-en-un (un seul index.html ouvrable en double-clic).
export default defineConfig(() => ({
  plugins: [react(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  base: './',
}))
