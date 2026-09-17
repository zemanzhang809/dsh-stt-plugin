/**
 * Build script for dsh-stt-plugin.
 *
 * Emits the two artifacts the DSH runtime expects from a dual-face bundle:
 *
 * - `lib/index.js`  — the Host (Node) half, ESM, imported by the Cordis
 *   loader through the package's `.` export. `schemastery` stays external
 *   (it is a real dependency resolved from node_modules on disk).
 * - `lib/client.js` — the browser half, a classic CJS script that registers
 *   its factory with the DSH client module loader:
 *
 *       window.__ModuleLoader__.load({ id: "dsh-stt-plugin", factory: (require) => {
 *         var module = { exports: {} }; var exports = module.exports;
 *         <bundle body>
 *         return module.exports; } });
 *
 *   The id MUST equal the package name — the boot graph keys entries by it.
 *   `react`, `react/jsx-runtime` and `react-dom` stay external: they are
 *   platform modules the DSH web shell seeds into the loader module table.
 */
import { build } from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(join(root, '..', 'package.json'), 'utf8'))
const outdir = join(root, '..', 'lib')
mkdirSync(outdir, { recursive: true })

// Host half — Node ESM.
await build({
  entryPoints: [join(root, '..', 'src/host.ts')],
  outfile: join(outdir, 'index.js'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node18',
  sourcemap: true,
  external: ['schemastery'],
})

// Client half — browser classic script with the module-loader handoff.
const client = join(outdir, 'client.js')
await build({
  entryPoints: [join(root, '..', 'src/client/index.tsx')],
  outfile: client,
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2020',
  jsx: 'automatic',
  sourcemap: true,
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
  banner: {
    js: [
      `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}, factory: (require) => {`,
      'var module = { exports: {} }; var exports = module.exports;',
    ].join('\n'),
  },
  footer: {
    js: 'return module.exports; } });',
  },
})

// Keep the sourcemap comment pointing at the adjacent map (esbuild already
// does; rewrite defensively in case the banner shifts the tail).
const code = readFileSync(client, 'utf8')
if (!code.includes('sourceMappingURL=client.js.map')) {
  writeFileSync(client, `${code.replace(/\/\/# sourceMappingURL=.*\s*$/, '')}\n//# sourceMappingURL=client.js.map`)
}

console.log('[dsh-stt-plugin] built lib/index.js and lib/client.js')
