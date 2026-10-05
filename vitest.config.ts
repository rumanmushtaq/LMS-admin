import { defineConfig } from 'vitest/config';

export default defineConfig({
  // tsconfig keeps `jsx: preserve` for Next. Vitest 4 transforms with oxc
  // (and esbuild in older setups), so both are told to use the automatic
  // React runtime for the .tsx files under test.
  oxc: { jsx: { runtime: 'automatic' } },
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    globals: true,
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next'],
  },
} as any);
