import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
  test: {
    include: ['tests/unit/components/*.spec.js'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      all: true,
      include: ['src/components/*.vue']
    }
  },
  root: '.'
})
