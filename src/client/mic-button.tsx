/**
 * The microphone toggle registered into `conversation.input.right` — the
 * compact-control list at the right end of the composer tool row, rendered
 * directly beside the model selector and the submit action.
 *
 * Data flow:
 * - input state arrives through the standard session slot props
 *   (`useInput` selector hook + `inputActions` — the same provide channel
 *   the resident composer uses);
 * - settings arrive through the plugin's inject face, which the slot renderer
 *   flattens into top-level props (`config`, `schedule`, `scope`, `persisted`
 *   — see {@link SttShared}), mirroring the `ui-stt` settings namespace;
 * - speech recognition runs in the browser via the Web Speech API.
 *
 * Draft writes go through `inputActions.setDraft` (replace-whole-draft), so
 * dictation composes `draft captured at start + recognized phrases`. Writes
 * are skipped unless the input machine sits in its `plain` phase.
 */
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import type { InputActions, InputState, SelectorHook, SttShared, Translate } from './types'
import {
  appendPhrase,
  getSpeechRecognition,
  type SpeechRecognitionErrorEventLike,
  type SpeechRecognitionEventLike,
  type SpeechRecognitionLike,
} from './speech'

/** Component props as assembled by the slot renderer. */
export interface MicButtonProps extends SttShared {
  /** Localized copy (bound by the registration's `locale` option). */
  t: Translate
  /** Standard session prop: input-state selector hook (absent when not live). */
  useInput?: SelectorHook<InputState>
  /** Standard session prop: public input actions (absent when not live). */
  inputActions?: InputActions
}

/** Round microphone glyph. */
function MicGlyph(): ReactNode {
  return (
    <svg className="dsh-stt-mic-glyph" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <rect x="5.5" y="1" width="5" height="8" rx="2.5" fill="currentColor" />
      <path
        d="M3.5 7.5a4.5 4.5 0 0 0 9 0"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="8" y1="12" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Render the microphone toggle.
 * @param props - composed slot props (see {@link MicButtonProps}).
 * @returns the button element, or a disabled stub when unsupported.
 */
export function MicButton(props: MicButtonProps): ReactNode {
  const { t, config, schedule } = props
  const supported = getSpeechRecognition() !== undefined

  // Standard props are stable per mount; the conditional keeps hook order
  // consistent for any given mounted instance.
  const input = props.useInput !== undefined ? props.useInput((state) => state) : undefined
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputRef = useRef<InputState | undefined>(undefined)
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const wantsListeningRef = useRef(false)
  const baseDraftRef = useRef('')
  const finalTextRef = useRef('')
  const autoSendRef = useRef(false)
  const restartDisposerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    inputRef.current = input
  }, [input])

  // Fiber-safe teardown: abort recognition and cancel a pending restart.
  useEffect(() => () => {
    wantsListeningRef.current = false
    try {
      recognitionRef.current?.abort()
    } catch {
      // already stopped
    }
    restartDisposerRef.current?.()
  }, [])

  const composeDraft = (text: string): void => {
    const actions = props.inputActions
    const state = inputRef.current
    if (actions === undefined || state === undefined || state.phase !== 'plain') return
    const base = baseDraftRef.current.trimEnd()
    const next = base === '' ? text.trim() : appendPhrase(base, text)
    if (next === state.draft) return
    actions.setDraft(next)
  }

  const startRecognition = (): void => {
    const Ctor = getSpeechRecognition()
    if (Ctor === undefined) return
    const current = config()
    const recognition: SpeechRecognitionLike = new Ctor()
    recognition.lang = current.language === 'auto'
      ? (typeof navigator !== 'undefined' && navigator.language !== '' ? navigator.language : 'en-US')
      : current.language
    recognition.continuous = current.continuous
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = ''
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index]
        if (result === undefined) continue
        const transcript = result[0]?.transcript ?? ''
        if (result.isFinal) {
          finalTextRef.current = appendPhrase(finalTextRef.current, transcript)
        } else {
          interim += transcript
        }
      }
      composeDraft(appendPhrase(finalTextRef.current, interim))
    }

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      const code = event.error
      if (code === 'no-speech' || code === 'aborted') return
      if (code === 'not-allowed' || code === 'service-not-allowed') setError(t('mic.denied'))
      else if (code === 'audio-capture') setError(t('mic.noMic'))
      else if (code === 'network') setError(t('mic.network'))
      else setError(`${t('mic.error')} (${code})`)
    }

    recognition.onend = () => {
      // In continuous mode restart until the user toggles off; a browser may
      // still end the session on silence, so re-arm through the Fiber timer.
      if (wantsListeningRef.current && config().continuous) {
        restartDisposerRef.current?.()
        restartDisposerRef.current = schedule(() => {
          restartDisposerRef.current = null
          if (!wantsListeningRef.current) return
          try {
            startRecognition()
          } catch {
            wantsListeningRef.current = false
            setListening(false)
          }
        }, 250)
        return
      }
      wantsListeningRef.current = false
      setListening(false)
      if (autoSendRef.current) {
        autoSendRef.current = false
        try {
          props.inputActions?.submit()
        } catch {
          // the machine refused (busy phase); the draft stays for a manual send
        }
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const start = (): void => {
    if (!supported || props.inputActions === undefined) return
    setError(null)
    baseDraftRef.current = inputRef.current?.draft ?? ''
    finalTextRef.current = ''
    wantsListeningRef.current = true
    autoSendRef.current = config().autoSend && !config().continuous
    try {
      startRecognition()
      setListening(true)
    } catch {
      wantsListeningRef.current = false
      setError(t('mic.error'))
    }
  }

  const stop = (): void => {
    wantsListeningRef.current = false
    restartDisposerRef.current?.()
    restartDisposerRef.current = null
    try {
      recognitionRef.current?.stop()
    } catch {
      // already stopped
    }
    setListening(false)
  }

  // Keep the composer editor focused when the button is pressed.
  const keepFocus = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
  }

  const label = listening ? t('mic.stop') : t('mic.start')
  const disabled = !supported || props.inputActions === undefined

  return (
    <button
      type="button"
      className="dsh-stt-mic"
      data-listening={listening ? 'true' : 'false'}
      aria-label={label}
      aria-pressed={listening}
      title={error ?? (supported ? label : t('mic.unsupported'))}
      disabled={disabled}
      onMouseDown={keepFocus}
      onClick={listening || wantsListeningRef.current ? stop : start}
    >
      <MicGlyph />
    </button>
  )
}
