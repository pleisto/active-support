import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: ['node20'],
  shims: true,
  minify: true,
  treeshake: true
})
