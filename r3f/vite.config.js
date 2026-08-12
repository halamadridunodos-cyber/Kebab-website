import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' → chemins relatifs, le build fonctionne depuis n'importe quel sous-dossier statique
export default defineConfig({
  plugins: [react()],
  base: './',
})
