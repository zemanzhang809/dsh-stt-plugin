/**
 * The Voice Input page registered into `settings.section` — one entry in the
 * settings dialog's navigation with a full content column.
 *
 * Writes go through the bound `ui-stt` settings scope while it accepts
 * writes; when it cannot persist (settings domain absent, or a non-loopback
 * page in memory mode) the page transparently falls back to browser-local
 * storage instead of disabling the controls, and says so in its hint copy.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { STT_LANGUAGE_LABELS, STT_LANGUAGES } from '../shared/languages'
import { readLocalConfig, subscribeLocal, writeLocalField } from './local-store'
import { isSpeechSupported } from './speech'
import type { ScopeSnapshot, SttConfig, SttShared, Translate } from './types'

/** This plugin's package name — the uninstall target row's `name`. */
const PLUGIN_NAME = 'dsh-stt-plugin'

/** Whether the page is served from a local address (uninstall is local-only). */
function isLoopbackPage(): boolean {
  if (typeof location === 'undefined') return false
  const host = location.hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host === '::1'
}

/** Lifecycle of the uninstall affordance. */
type UninstallState =
  | { kind: 'idle' }
  | { kind: 'busy' }
  | { kind: 'done' }
  | { kind: 'missing' }
  | { kind: 'failed'; message: string }

/** Component props as assembled by the settings shell renderer. */
export interface SttSectionProps extends SttShared {
  /** Localized copy (bound by the registration's `locale` option). */
  t: Translate
  /** Shell affordance: close the settings panel. */
  close?: () => void
}

/**
 * Render the Voice Input settings page.
 * @param props - composed slot props (see {@link SttSectionProps}).
 * @returns the section element tree.
 */
export function SttSettingsSection(props: SttSectionProps): ReactNode {
  const { t, scope, persisted, manager } = props
  const [snapshot, setSnapshot] = useState<ScopeSnapshot<SttConfig> | undefined>(
    scope?.getSnapshot(),
  )
  const [localConfig, setLocalConfig] = useState<SttConfig>(() => readLocalConfig())

  useEffect(() => {
    if (scope === undefined) return undefined
    return scope.subscribe(() => {
      setSnapshot(scope.getSnapshot())
    })
  }, [scope])

  useEffect(() => subscribeLocal(() => {
    setLocalConfig(readLocalConfig())
  }), [])

  // Scope mode: the snapshot is ready and the store accepts writes — the
  // DSH settings store is the source of truth. Otherwise browser-local.
  const useScope = snapshot !== undefined && snapshot.status === 'ready' && snapshot.writable
  const value = useScope ? snapshot.value : localConfig
  const language = value?.language ?? 'auto'
  const continuous = value?.continuous ?? false
  const autoSend = value?.autoSend ?? false

  const setField = (field: 'language' | 'continuous' | 'autoSend', next: string | boolean): void => {
    if (useScope) {
      // A failed write reloads Host state through the scope's own recovery;
      // swallow the rejection so it never becomes an unhandled rejection.
      scope?.set(field, next).catch(() => {})
      return
    }
    setLocalConfig(writeLocalField(field, next as never))
  }

  return (
    <div className="dsh-stt-section">
      <p className="dsh-stt-note">
        {isSpeechSupported() ? t('settings.supported.ok') : t('settings.supported.no')}
      </p>

      <div className="dsh-stt-row">
        <span className="dsh-stt-row-copy">
          <span className="dsh-stt-row-label">{t('settings.language')}</span>
        </span>
        <select
          className="dsh-stt-select"
          value={language}
          onChange={(event) => {
            setField('language', event.currentTarget.value)
          }}
        >
          {STT_LANGUAGES.map((code) => (
            <option key={code} value={code}>
              {code === 'auto' ? t('settings.language.auto') : STT_LANGUAGE_LABELS[code] ?? code}
            </option>
          ))}
        </select>
      </div>

      <div className="dsh-stt-row">
        <span className="dsh-stt-row-copy">
          <span className="dsh-stt-row-label">{t('settings.continuous')}</span>
          <span className="dsh-stt-row-hint">{t('settings.continuous.hint')}</span>
        </span>
        <button
          type="button"
          className="dsh-stt-switch"
          role="switch"
          aria-checked={continuous}
          aria-label={t('settings.continuous')}
          data-on={continuous ? 'true' : 'false'}
          onClick={() => {
            setField('continuous', !continuous)
          }}
        />
      </div>

      <div className="dsh-stt-row">
        <span className="dsh-stt-row-copy">
          <span className="dsh-stt-row-label">{t('settings.autosend')}</span>
          <span className="dsh-stt-row-hint">{t('settings.autosend.hint')}</span>
        </span>
        <button
          type="button"
          className="dsh-stt-switch"
          role="switch"
          aria-checked={autoSend}
          aria-label={t('settings.autosend')}
          data-on={autoSend ? 'true' : 'false'}
          onClick={() => {
            setField('autoSend', !autoSend)
          }}
        />
      </div>

      {persisted() ? null : (
        <p className="dsh-stt-note">{t('settings.fallback')}</p>
      )}

      <UninstallZone manager={manager} t={t} />
    </div>
  )
}

/**
 * Self-uninstall affordance: routes through the plugin-manager client
 * service when it is composed and the page is local; hidden otherwise
 * (the manager UI or `dsh plugin --profile web remove` remain the paths).
 */
function UninstallZone(props: { manager: SttSectionProps['manager']; t: Translate }): ReactNode {
  const { manager, t } = props
  const [state, setState] = useState<UninstallState>({ kind: 'idle' })

  if (manager === undefined || !isLoopbackPage()) return null

  const onUninstall = (): void => {
    if (state.kind === 'busy') return
    if (!window.confirm(t('settings.uninstall.confirm'))) return
    setState({ kind: 'busy' })
    void (async () => {
      try {
        const rows = await manager.list()
        const row = rows.find((item) => item.name === PLUGIN_NAME || item.id === PLUGIN_NAME)
        if (row === undefined) {
          setState({ kind: 'missing' })
          return
        }
        await manager.uninstall(row.id)
        setState({ kind: 'done' })
      } catch (reason) {
        setState({ kind: 'failed', message: reason instanceof Error ? reason.message : String(reason) })
      }
    })()
  }

  return (
    <div className="dsh-stt-danger-zone">
      {state.kind === 'done' ? (
        <p className="dsh-stt-note">{t('settings.uninstall.restart')}</p>
      ) : state.kind === 'missing' ? (
        <p className="dsh-stt-note">{t('settings.uninstall.missing')}</p>
      ) : (
        <>
          <span className="dsh-stt-row-hint">{t('settings.uninstall.hint')}</span>
          <button
            type="button"
            className="dsh-stt-danger"
            disabled={state.kind === 'busy'}
            onClick={onUninstall}
          >
            {state.kind === 'busy' ? t('settings.uninstall.busy') : t('settings.uninstall')}
          </button>
        </>
      )}
      {state.kind === 'failed' ? (
        <p className="dsh-stt-note">{t('settings.uninstall.failed')}{state.message}</p>
      ) : null}
    </div>
  )
}
