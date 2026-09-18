/**
 * Minimal structural types for the DSH client surfaces this plugin touches.
 *
 * The plugin deliberately avoids runtime imports from `@deepseek-ai/*`
 * packages (they are not published to npm); everything here mirrors the
 * runtime contracts as plain structural interfaces, kept in sync with the
 * harness sources this plugin was written against.
 */

import type { ReactNode } from 'react'

/** Minimal Cordis context face used by the client half. */
export interface ClientContext {
  /** Optional service read; returns undefined when the service is absent. */
  get(key: string): unknown
  /** Register a Fiber-owned side effect; the callback returns a disposer. */
  effect(callback: () => (() => void) | void, label?: string): () => void
}

/** Minimal slot registration/injection face. */
export interface SlotsService {
  inject(key: string, callback: () => void): () => void
  register(options: SlotRegistrationOptions, component: (props: never) => ReactNode): void
}

export interface SlotRegistrationOptions {
  name: string
  /** list kind: stable entry id. */
  id?: string
  /** list kind: ascending order. */
  order?: number
  /** list kind: display label; a thunk is re-resolved on locale changes. */
  label?: string | (() => string)
  /** Locale namespace this entry's copy comes from; provides `t` to the component. */
  locale?: string
  /** Business face; its members are flattened into component props. */
  inject?: () => unknown
}

/** Translate function bound to a locale namespace. */
export type Translate = (key: string, params?: Record<string, unknown>) => string

/** Minimal locale service face. */
export interface LocaleService {
  register(namespace: string, dicts: Record<string, Record<string, string>>): () => void
  bind(namespace: string): Translate
  subscribe(fn: () => void): () => void
}

/** Minimal timer service face (Fiber-owned timers). */
export interface TimerService {
  timeout(callback: () => void, delay: number): () => void
}

/** The plugin's own settings value (`ui-stt` namespace section). */
export interface SttConfig {
  language: string
  continuous: boolean
  autoSend: boolean
}

/** Client-side snapshot of one settings namespace scope. */
export interface ScopeSnapshot<T> {
  status: 'loading' | 'ready' | 'unavailable'
  value: T | undefined
  writable: boolean
  mode: 'host' | 'memory'
}

/** Minimal settings-scope face bound for one namespace. */
export interface SettingsScope<T> {
  getSnapshot(): ScopeSnapshot<T>
  subscribe(listener: () => void): () => void
  set(field: string, value: unknown): Promise<void>
  unset(field: string): Promise<void>
}

/** Minimal settingsScope binder face. */
export interface SettingsScopeBinder {
  bind<T>(spec: { namespace: string; decode?: (section: unknown) => T | undefined }): SettingsScope<T>
}

/** The public input-action face every session-scope slot component receives. */
export interface InputActions {
  /** Replace the whole composer draft. */
  setDraft(text: string): void
  /** Enter submission (adjudication / claim transaction / default sink). */
  submit(): void
}

/** Published per-session input state (the fields the mic button reads). */
export interface InputState {
  readonly draft: string
  readonly phase: 'plain' | 'adjudicating' | 'claimed' | 'submitting'
}

/** Snapshot-selector hook shape handed to session-scope slot components. */
export type SelectorHook<S> = <U>(selector: (state: S) => U) => U

/**
 * Business face the apply closure hands to its components via the slot
 * `inject` option. The slot renderer flattens every inject-face member into
 * top-level component props (`InjectFace<I> = I` — no `injected` nesting), so
 * component prop interfaces extend this face directly.
 */
export interface SttShared {
  /** Current settings value (always defined; falls back to defaults). */
  config(): SttConfig
  /** Fiber-owned setTimeout; falls back to a native timer when absent. */
  schedule(callback: () => void, delayMs: number): () => void
  /** Bound settings scope, or undefined when the settings domain is absent. */
  scope: SettingsScope<SttConfig> | undefined
  /** True when writes persist through the DSH settings store; false = browser-local fallback. */
  persisted(): boolean
}
