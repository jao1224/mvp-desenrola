import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true
            }
        }
    }
})
