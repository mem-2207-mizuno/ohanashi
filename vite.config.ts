/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Vitestの設定オプション
    globals: true,
    environment: 'jsdom',
    // coverageやalias等の設定を追加するならここで
  },
})
