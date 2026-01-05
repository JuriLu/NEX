import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'angular-resource-stub',
      transform(code, id) {
        if (id.endsWith('.ts') && (code.includes('templateUrl') || code.includes('styleUrl'))) {
          let newCode = code.replace(/templateUrl\s*:\s*['"]([^'"]+)['"]/g, 'template: ""');
          newCode = newCode.replace(/styleUrl\s*:\s*['"]([^'"]+)['"]/g, 'styles: []');
          return { code: newCode, map: null };
        }
        return null;
      },
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    alias: {
      '@angular/compiler': resolve(
        __dirname,
        './node_modules/@angular/compiler/fesm2022/compiler.mjs'
      ),
    },
    server: {
      deps: {
        inline: [/@angular/, /@ngrx/],
      },
    },
    coverage: {
      provider: 'v8',
      include: ['src/app/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/test-setup.ts', 'src/environments/**', 'src/main.ts'],
      reporter: ['text', 'html'],
    },
  },
});
