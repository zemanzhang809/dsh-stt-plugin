/**
 * dsh-stt-plugin — Client (browser) half.
 *
 * Contributes:
 * - a microphone toggle in `conversation.input.right` (the composer tool
 *   row's compact-control list beside the model selector and the submit
 *   action) that dictates into the draft through the standard input action
 *   face, with optional auto-send;
 * - a "Voice Input" page in `settings.section` for recognition language,
 *   continuous dictation, and auto-send, persisted through the `ui-stt`
 *   settings namespace registered by the Host half.
 *
 * Speech recognition uses the browser's Web Speech API — no audio ever
 * reaches the Host or the model provider beyond the recognized text.
 */
import type { ReactNode } from 'react'
import { en, NS, zh } from './locales'
import { readLocalConfig } from './local-store'
import { MicButton } from './mic-button'
import { SttSettingsSection } from './settings-section'
import { STT_CSS } from './styles'
import { STT_LANGUAGES } from '../shared/languages'
import type {
  ClientContext,
  LocaleService,
  PluginManagerFace,
  SettingsScope,
  SettingsScopeBinder,
  SlotsService,
  SttConfig,
  SttShared,
  TimerService,
  Translate,
} from './types'

export const name = 'dsh-stt-plugin'

/**
 * Hard service dependencies. Without this export the client fiber activates
 * immediately — before the slot system mounts — and `ctx.get('slots')` is
 * undefined in apply. Declaring them keeps the fiber PENDING until the
 * providers are live, then runs apply. `timer` is deliberately optional:
 * the schedule helper falls back to a native timeout.
 */
export const inject = ['slots', 'locale', 'settingsScope']

/** Default settings value, also the schema default on the Host side. */
const DEFAULT_CONFIG: SttConfig = {
  language: 'auto',
  continuous: false,
  autoSend: false,
}

/** Narrow one wire section into the plugin's config shape. */
function decodeConfig(section: unknown): SttConfig | undefined {
  if (typeof section !== 'object' || section === null) return undefined
  const raw = section as Record<string, unknown>
  return {
    language: typeof raw.language === 'string' && STT_LANGUAGES.includes(raw.language)
      ? raw.language
      : DEFAULT_CONFIG.language,
    continuous: raw.continuous === true,
    autoSend: raw.autoSend === true,
  }
}

/** Fallback translator used when the locale service is not composed. */
function fallbackTranslate(key: string): string {
  const browserZh = typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
  const dict = browserZh ? zh : en
  return dict[key] ?? key
}

/** Contribute the mic toggle and the settings page. */
export function apply(ctx: ClientContext): void {
  console.log('[dsh-stt-plugin] client half applying')
  const slots = ctx.get('slots') as SlotsService | undefined
  if (slots === undefined) {
    console.warn('[dsh-stt-plugin] slots service absent — nothing to register')
    return
  }

  // Plugin-owned styles (Fiber-owned: removed with the run).
  ctx.effect(() => {
    if (typeof document === 'undefined') return undefined
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-stt-plugin'
    style.textContent = STT_CSS
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, 'dsh-stt-plugin: styles')

  // Locale dictionaries (optional service).
  const locale = ctx.get('locale') as LocaleService | undefined
  let t: Translate = fallbackTranslate
  if (locale !== undefined) {
    ctx.effect(() => locale.register(NS, { zh, en }), 'dsh-stt-plugin: dictionaries')
    t = locale.bind(NS)
  }

  // Settings scope over the Host-registered `ui-stt` namespace (optional).
  const settingsScope = ctx.get('settingsScope') as SettingsScopeBinder | undefined
  let scope: SettingsScope<SttConfig> | undefined
  if (settingsScope !== undefined && typeof settingsScope.bind === 'function') {
    scope = settingsScope.bind<SttConfig>({ namespace: 'ui-stt', decode: decodeConfig })
  }

  // Effective config: the settings scope when it can persist (snapshot is
  // ready and writable — the DSH settings store), otherwise the browser-local
  // fallback. The mic button and the settings page read the same values in
  // either mode.
  const readConfig = (): SttConfig => {
    const snapshot = scope?.getSnapshot()
    if (snapshot?.status === 'ready' && snapshot.writable && snapshot.value !== undefined) {
      return snapshot.value
    }
    return readLocalConfig()
  }

  // True when writes land in the DSH settings store; false = browser-local.
  const persistedNow = (): boolean => {
    const snapshot = scope?.getSnapshot()
    return snapshot?.status === 'ready' && snapshot.writable && snapshot.mode === 'host'
  }

  // Fiber-owned timer (optional; the composition ships one).
  const timer = ctx.get('timer') as TimerService | undefined

  // Plugin-manager client service (optional; shipped by the web bundle's
  // plugin-manager). Read at apply time — bundle ordering puts its provider
  // ahead of this patch-layer plugin. When absent, the uninstall affordance
  // hides and users manage plugins through the manager UI or the CLI.
  const managerCandidate = ctx.get('pluginManager') as PluginManagerFace | undefined
  const manager = managerCandidate !== undefined
    && typeof managerCandidate.list === 'function'
    && typeof managerCandidate.uninstall === 'function'
    ? managerCandidate
    : undefined

  const shared: SttShared = {
    config: readConfig,
    schedule: (callback, delayMs) => {
      if (timer !== undefined && typeof timer.timeout === 'function') {
        return timer.timeout(callback, delayMs)
      }
      const id = setTimeout(callback, delayMs)
      return () => {
        clearTimeout(id)
      }
    },
    scope,
    persisted: persistedNow,
    manager,
  }

  // Microphone toggle in the composer tool row (session-scoped list entry).
  slots.inject('conversation.input.right', () => slots.register(
    { name: 'conversation.input.right', id: 'stt-mic', locale: NS, inject: () => shared },
    (props) => MicButton(props as never) as ReactNode,
  ))

  // Voice Input page in the settings dialog.
  slots.inject('settings.section', () => slots.register(
    { name: 'settings.section', id: 'stt', order: 900, label: () => t('settings.nav'), locale: NS, inject: () => shared },
    (props) => SttSettingsSection(props as never) as ReactNode,
  ))

  console.log('[dsh-stt-plugin] slots registered: mic button + settings page')
}
