import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import { existsSync } from 'fs'

// Load environment variables from .env files
const envDir = resolve('src/renderer')
const mode = process.env.NODE_ENV || 'development'

// Load .env file
if (existsSync(resolve(envDir, '.env'))) {
  dotenv.config({ path: resolve(envDir, '.env') })
}

// Load .env.production or .env.development based on mode
const envFile = mode === 'production' ? '.env.production' : '.env.development'
if (existsSync(resolve(envDir, envFile))) {
  dotenv.config({ path: resolve(envDir, envFile), override: true })
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    // Set the directory where .env files are located
    envDir: resolve('src/renderer'),
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()],
    // Explicitly define which env variables to expose
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        process.env.VITE_API_URL || 'http://localhost:5000/api'
      )
    }
  }
})
