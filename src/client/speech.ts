/**
 * Web Speech API surface used by the mic button, with the minimal ambient
 * declarations the standard lib.dom of the targeted TypeScript versions may
 * not carry. Recognition runs entirely in the browser; Chrome and Edge ship
 * the non-prefixed or `webkit`-prefixed implementation, Firefox does not
 * expose it.
 */

export interface SpeechRecognitionAlternativeLike {
  readonly transcript: string
  readonly confidence: number
}

export interface SpeechRecognitionResultLike {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternativeLike
}

export interface SpeechRecognitionResultListLike {
  readonly length: number
  [index: number]: SpeechRecognitionResultLike
}

export interface SpeechRecognitionEventLike {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultListLike
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported'

export interface SpeechRecognitionErrorEventLike {
  readonly error: SpeechRecognitionErrorCode
  readonly message: string
}

export interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

export type SpeechRecognitionCtor = new () => SpeechRecognitionLike

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
}

/** The browser's SpeechRecognition constructor, or undefined when unsupported. */
export function getSpeechRecognition(): SpeechRecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined
  return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

/** Whether this browser exposes the Web Speech API at all. */
export function isSpeechSupported(): boolean {
  return getSpeechRecognition() !== undefined
}

/** Join two dictation phrases with a single space, tolerating empty sides. */
export function appendPhrase(left: string, right: string): string {
  const a = left.trim()
  const b = right.trim()
  if (a === '') return b
  if (b === '') return a
  return `${a} ${b}`
}
