import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    clearScreen: false,
    base: "/battleship",
    build: {
        outDir: "dist/battleship"
    },
    plugins: [],
})
