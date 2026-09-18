/**
 * Browser-local fallback persistence for the plugin's settings.
 *
 * Used when the bound settings scope cannot accept writes — the settings
 * service is absent from the composition, or the page is served from a
 * non-loopback address where the scope downgrades to a process-local memory
 * store. The mic button reads the same effective config either way; values
 * saved here apply to this browser only, which the settings page states in
 * its hint copy.
 */

import { STT_LANGUAGES } from '../shared/languages'
import type { SttConfig } from './types'

const STORAGE_KEY = 'dsh-stt-plugin:config'

/** Default settings value, mirrored from the Host schema defaults. */
export const DEFAULT_CONFIG: SttConfig = {
  language: 'auto',
  continuous: false,
  autoSend: false,
}

/** localStorage may be unavailable (sandboxed frames, non-browser tests). */
const memory = new Map<string, string>()

function storageGet(key: string): string | undefined {
  try {
    if (typeof localStorage === 'undefined') return memory.get(key)
    return localStorage.getItem(key) ?? undefined
  } catch {
    return memory.get(key)
  }
}

function storageSet(key: string, value: string): void {
  try {
    if (typeof localStorage === 'undefined') {
      memory.set(key, value)
      return
    }
    localStorage.setItem(key, value)
  } catch {
    memory.set(key, value)
  }
}

/** Narrow arbitrary parsed JSON into the plugin's config shape. */
export function decodeLocal(raw: unknown): SttConfig {
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_CONFIG }
  const record = raw as Record<string, unknown>
  return {
    language: typeof record.language === 'string' && STT_LANGUAGES.includes(record.language)
      ? record.language
      : DEFAULT_CONFIG.language,
    continuous: record.continuous === true,
    autoSend: record.autoSend === true,
  }
}

/** Read the browser-local config (defaults when nothing was stored yet). */
export function readLocalConfig(): SttConfig {
  const raw = storageGet(STORAGE_KEY)
  if (raw === undefined) return { ...DEFAULT_CONFIG }
  try {
    return decodeLocal(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

const listeners = new Set<() => void>()

/** Subscribe to browser-local config changes (same-page notification only). */
export function subscribeLocal(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Merge one field into the browser-local config and notify subscribers. */
export function writeLocalField(field: keyof SttConfig, value: SttConfig[keyof SttConfig]): SttConfig {
  const next: SttConfig = { ...readLocalConfig(), [field]: value }
  storageSet(STORAGE_KEY, JSON.stringify(next))
  for (const listener of listeners) listener()
  return next
}
