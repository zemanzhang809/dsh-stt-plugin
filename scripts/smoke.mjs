/**
 * Smoke tests for the built artifacts. Run with `pnpm test` after `pnpm build`.
 *
 * Phase 1 — Host half: imported as ESM, `apply()` is invoked against a fake
 * settings service; the registered schema must resolve defaults and serialize.
 *
 * Phase 2 — Client half, degraded: executed as a browser classic script
 * against a stubbed `window.__ModuleLoader__`; the captured factory must
 * produce exports whose `apply` tolerates an absent slot system.
 *
 * Phase 3 — Client half, simulated composition: the same `apply` runs against
 * fake slot/locale/settings/timer services, both slot entries are captured,
 * and each component is rendered with `react-dom/server` against the props
 * the slot renderer would assemble. Render crashes (wrong prop shapes,
 * hook misuse) fail loudly here instead of silently blanking the UI.
 */
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const require = createRequire(import.meta.url)

let failures = 0
const check = (name, condition) => {
  if (condition) {
    console.log(`  ok  ${name}`)
  } else {
    failures += 1
    console.error(`FAIL  ${name}`)
  }
}

// Load the client bundle's exports: execute the classic script against a
// stubbed module loader, then materialize its factory with Node's require.
function loadClientExports() {
  globalThis.window = { __ModuleLoader__: null }
  let registration = null
  globalThis.window.__ModuleLoader__ = {
    load: (input) => {
      registration = input
    },
  }
  const code = readFileSync(join(root, 'lib/client.js'), 'utf8')
  const factory = new Function('require', `${code}\n;return null;`)
  factory(require)
  return { code, exports: registration.factory(require) }
}

// Minimal DOM stub for the style-injection effect.
function installDomStub() {
  const element = () => ({
    dataset: {},
    style: {},
    textContent: '',
    remove() {},
  })
  globalThis.document = {
    createElement: element,
    querySelector: () => null,
    head: { appendChild() {} },
  }
  if (!globalThis.navigator) {
    globalThis.navigator = { language: 'en-US' }
  }
  // The uninstall affordance is local-only; simulate a loopback page.
  globalThis.location = { hostname: '127.0.0.1' }
}

// --- Phase 1: Host half ------------------------------------------------------
{
  const host = await import(`file://${join(root, 'lib/index.js').replaceAll('\\', '/')}`)
  check('host: exports apply()', typeof host.apply === 'function')

  const registered = new Map()
  const fakeSettings = {
    register(namespace, schema) {
      registered.set(namespace, schema)
      return {}
    },
  }
  host.apply({ get: (key) => (key === 'settings' ? fakeSettings : undefined) })
  check('host: registers the ui-stt namespace', registered.has('ui-stt'))

  const schema = registered.get('ui-stt')
  const resolved = schema({})
  check('host: schema resolves defaults', resolved.language === 'auto'
    && resolved.continuous === false
    && resolved.autoSend === false)
  check('host: schema serializes (toJSON)', typeof schema.toJSON() === 'object')

  const resolvedUser = schema({ language: 'ja-JP', continuous: true })
  check('host: schema accepts user values', resolvedUser.language === 'ja-JP' && resolvedUser.continuous === true)

  let rejected = false
  try {
    schema({ language: 'klingon' })
  } catch {
    rejected = true
  }
  check('host: schema rejects unknown language', rejected)

  host.apply({ get: () => undefined })
  check('host: apply tolerates missing settings service', true)
}

// --- Phase 2 + 3: Client half ------------------------------------------------
{
  const { code, exports } = loadClientExports()
  check('client: bundle carries the module-loader handoff', code.includes(`window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}`))
  check('client: exports apply()', typeof exports.apply === 'function')

  // Degraded composition.
  installDomStub()
  const degradedEffects = []
  exports.apply({
    get: () => undefined,
    effect: (callback) => {
      const disposer = callback()
      if (typeof disposer === 'function') degradedEffects.push(disposer)
      return () => {}
    },
  })
  check('client: apply tolerates an absent slot system', true)
  for (const disposer of degradedEffects) disposer()

  // Simulated composition with real React rendering.
  const React = require('react')
  const { renderToStaticMarkup } = require('react-dom/server')

  const entries = { mic: null, settings: null }
  const fakeSlots = {
    inject: (key, callback) => callback(),
    register: (options, component) => {
      if (options.name === 'conversation.input.right') entries.mic = { options, component }
      if (options.name === 'settings.section') entries.settings = { options, component }
      return () => {}
    },
  }

  const dicts = new Map()
  const fakeLocale = {
    register: (namespace, d) => {
      dicts.set(namespace, d)
      return () => {}
    },
    bind: (namespace) => (key) => dicts.get(namespace)?.en?.[key] ?? key,
    subscribe: () => () => {},
  }

  const bindSpecs = []
  const fakeScope = {
    getSnapshot: () => ({
      status: 'ready',
      value: { language: 'zh-CN', continuous: true, autoSend: true },
      writable: true,
      mode: 'host',
    }),
    subscribe: () => () => {},
    set: async () => {},
  }
  const fakeSettingsScope = {
    bind: (spec) => {
      bindSpecs.push(spec)
      return fakeScope
    },
  }

  const fakeTimer = {
    timeout: (callback, delayMs) => {
      const id = setTimeout(callback, delayMs)
      return () => clearTimeout(id)
    },
  }

  const effects = []
  const fakeCtx = {
    get: (key) => ({
      slots: fakeSlots,
      locale: fakeLocale,
      settingsScope: fakeSettingsScope,
      timer: fakeTimer,
    })[key],
    effect: (callback) => {
      const disposer = callback()
      if (typeof disposer === 'function') effects.push(disposer)
      return () => {}
    },
  }

  exports.apply(fakeCtx)

  check('client: registers the mic button entry', entries.mic !== null)
  check('client: registers the settings page entry', entries.settings !== null)
  check('client: binds the ui-stt settings scope', bindSpecs.length === 1 && bindSpecs[0].namespace === 'ui-stt')
  check('client: registers locale dictionaries', dicts.has('stt'))
  for (const disposer of effects) disposer()

  const shared = {
    config: () => ({ language: 'zh-CN', continuous: true, autoSend: true }),
    schedule: (callback, delayMs) => {
      const id = setTimeout(callback, delayMs)
      return () => clearTimeout(id)
    },
    scope: fakeScope,
    persisted: () => true,
  }

  // Mic button with the standard session props a live composer supplies.
  let micHtml = null
  let micError = null
  try {
    micHtml = renderToStaticMarkup(React.createElement(entries.mic.component, {
      t: (key) => key,
      ...shared,
      useInput: (selector) => selector({ draft: 'hello', phase: 'plain' }),
      inputActions: { setDraft() {}, submit() {} },
    }))
  } catch (error) {
    micError = error
  }
  check('client: mic button renders', micError === null && micHtml !== null && micHtml.includes('dsh-stt-mic'))
  // Node has no SpeechRecognition, so the button must render disabled there;
  // enabled rendering is covered by the same code path once supported is true.
  check('client: mic button disabled without SpeechRecognition', micHtml !== null && micHtml.includes('disabled'))
  if (micError !== null) console.error(micError)

  // Settings page with the owner props the settings shell supplies.
  let settingsHtml = null
  let settingsError = null
  try {
    settingsHtml = renderToStaticMarkup(React.createElement(entries.settings.component, {
      t: (key) => key,
      ...shared,
      close: () => {},
    }))
  } catch (error) {
    settingsError = error
  }
  check('client: settings page renders', settingsError === null && settingsHtml !== null && settingsHtml.includes('dsh-stt-section'))
  check('client: settings page shows bound values', settingsHtml !== null && settingsHtml.includes('zh-CN'))
  if (settingsError !== null) console.error(settingsError)

  // Read-only scope (settings domain absent / non-loopback page): the page
  // must fall back to browser-local persistence and keep every control
  // enabled — no `disabled` attribute anywhere.
  const roScope = {
    getSnapshot: () => ({
      status: 'ready',
      value: { language: 'auto', continuous: false, autoSend: false },
      writable: false,
      mode: 'memory',
    }),
    subscribe: () => () => {},
    set: async () => {},
  }
  let roHtml = null
  try {
    roHtml = renderToStaticMarkup(React.createElement(entries.settings.component, {
      t: (key) => key,
      ...shared,
      scope: roScope,
      persisted: () => false,
    }))
  } catch (error) {
    console.error(error)
  }
  check('client: read-only scope keeps controls enabled', roHtml !== null && !roHtml.includes('disabled'))
  check('client: read-only scope shows the fallback hint', roHtml !== null && roHtml.includes('settings.fallback'))

  // Uninstall affordance: hidden without the plugin-manager service, shown
  // with it on a loopback page.
  check('client: uninstall zone hidden without plugin-manager', settingsHtml !== null && !settingsHtml.includes('settings.uninstall'))
  const fakeManager = {
    list: async () => [{ id: 'stt', name: 'dsh-stt-plugin', version: '0.1.1' }],
    uninstall: async () => {},
  }
  let managedHtml = null
  try {
    managedHtml = renderToStaticMarkup(React.createElement(entries.settings.component, {
      t: (key) => key,
      ...shared,
      manager: fakeManager,
    }))
  } catch (error) {
    console.error(error)
  }
  check('client: uninstall button renders with plugin-manager', managedHtml !== null && managedHtml.includes('settings.uninstall'))
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`)
  process.exit(1)
}
console.log('\nall smoke checks passed')
