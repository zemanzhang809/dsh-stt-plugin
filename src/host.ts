/**
 * dsh-stt-plugin — Host (Node) half.
 *
 * Registers the `ui-stt` settings namespace so the browser half can bind a
 * durable scope through the settings transport (`ctx.settingsScope`) and
 * render its Voice Input page inside the DSH settings dialog.
 *
 * The namespace must be registered with a Schemastery schema: the settings
 * service serializes the node with `schema.toJSON()` into the describe mirror
 * consumed by the client. No other Host contribution is needed — speech
 * recognition runs entirely in the browser (Web Speech API).
 */

import Schema from 'schemastery'
import { STT_LANGUAGES } from './shared/languages.ts'

/** Diagnostic plugin name. */
export const name = 'dsh-stt-plugin'

/**
 * Hard service dependency: without this the host fiber applies before the
 * settings service mounts, `ctx.get('settings')` is undefined, and the
 * `ui-stt` namespace never registers — the browser scope then reports
 * `unavailable` and every settings control renders disabled.
 */
export const inject = ['settings']

/** Minimal structural view of the Cordis context this plugin needs. */
interface HostContext {
  /** Optional service read; returns undefined when the service is absent. */
  get(key: string): unknown
}

/** Minimal structural view of the settings service registration face. */
interface SettingsService {
  register(namespace: string, schema: unknown, options?: unknown): unknown
}

/** The settings namespace owned by this plugin. */
export const STT_NAMESPACE = 'ui-stt'

/** Contribute the settings namespace. */
export function apply(ctx: HostContext): void {
  const settings = ctx.get('settings') as SettingsService | undefined
  if (settings === undefined || typeof settings.register !== 'function') {
    // Defensive: inject should guarantee the service. The browser half still
    // works; preferences fall back to in-memory defaults for the session.
    console.warn('[dsh-stt-plugin] settings service absent — ui-stt namespace not registered')
    return
  }
  settings.register(STT_NAMESPACE, Schema.object({
    language: Schema.union([...STT_LANGUAGES])
      .default('auto')
      .description('Recognition language ("auto" follows the browser locale)'),
    continuous: Schema.boolean()
      .default(false)
      .description('Keep the microphone open until toggled off'),
    autoSend: Schema.boolean()
      .default(false)
      .description('Submit the message automatically when a phrase finishes (single-shot mode)'),
  }))
}
