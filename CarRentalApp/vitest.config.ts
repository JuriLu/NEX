import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    {
      name: 'angular-resource-stub',
      transform(code, id) {
        if (id.endsWith('.ts')) {
          // Replace templateUrl and styleUrl with template and styles to avoid resource loading issues in JIT
          let newCode = code.replace(/templateUrl\s*:\s*['"]([^'"]+)['"]/g, 'template: ""');
          newCode = newCode.replace(/styleUrl\s*:\s*['"]([^'"]+)['"]/g, 'styles: []');
          return { code: newCode, map: null };
        }
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
  },
});
