import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'src')
const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about', 'index.html'),
        contact: resolve(root, 'contact', 'index.html'),
        credits: resolve(root, 'credits', 'index.html'),
        works: resolve(root, 'works', 'index.html'),
      }
    }
  }
})
