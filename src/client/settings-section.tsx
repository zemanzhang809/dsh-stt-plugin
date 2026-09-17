/**
 * The Voice Input page registered into `settings.section` — one entry in the
 * settings dialog's navigation with a full content column.
 *
 * Values read and write through the bound `ui-stt` settings scope, which the
 * Host half registers with the settings service; when the settings domain is
 * absent from the composition the page degrades to a hint and the mic button
 * keeps using defaults.
 */
import { useEffect, useState, type ReactNode } from 'react'
import { STT_LANGUAGE_LABELS, STT_LANGUAGES } from '../shared/languages'
import { isSpeechSupported } from './speech'
import type { ScopeSnapshot, SttConfig, SttShared, Translate } from './types'

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
  const { t, scope, persisted } = props
  const [snapshot, setSnapshot] = useState<ScopeSnapshot<SttConfig> | undefined>(
    scope?.getSnapshot(),
  )

  useEffect(() => {
    if (scope === undefined) return undefined
    return scope.subscribe(() => {
      setSnapshot(scope.getSnapshot())
    })
  }, [scope])

  const value = snapshot?.value
  const ready = snapshot !== undefined && snapshot.status === 'ready'
  const writable = ready && snapshot.writable
  const language = value?.language ?? 'auto'
  const continuous = value?.continuous ?? false
  const autoSend = value?.autoSend ?? false

  const setField = (field: string, next: unknown): void => {
    // A failed write reloads Host state through the scope's own recovery;
    // swallow the rejection so it never becomes an unhandled rejection.
    scope?.set(field, next).catch(() => {})
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
          disabled={!writable}
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
          disabled={!writable}
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
          disabled={!writable}
          onClick={() => {
            setField('autoSend', !autoSend)
          }}
        />
      </div>

      {persisted() ? null : (
        <p className="dsh-stt-note">{scope === undefined ? t('settings.unavailable') : t('settings.readonly')}</p>
      )}
    </div>
  )
}
