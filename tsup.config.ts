import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  target: ['node22'],
  shims: false,
  minify: false,
  treeshake: false,
  skipNodeModulesBundle: true
})
