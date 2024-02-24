import { defineConfig, type Options } from 'tsup'

import './src/env'

export default defineConfig((options: Options) => ({
  entryPoints: ['src/index.ts'],
  clean: true,
  format: ['esm'],
  ...options,
}))
