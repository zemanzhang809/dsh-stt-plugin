/**
 * Language options shared by the Host settings schema and the Client UI.
 * `auto` follows the browser locale (`navigator.language`).
 */

/** Every value the `ui-stt.language` setting accepts. */
export const STT_LANGUAGES: readonly string[] = [
  'auto',
  'zh-CN',
  'zh-TW',
  'en-US',
  'en-GB',
  'ja-JP',
  'ko-KR',
  'de-DE',
  'fr-FR',
  'es-ES',
  'pt-BR',
  'ru-RU',
  'it-IT',
  'ar-SA',
  'hi-IN',
  'th-TH',
  'vi-VN',
]

/** Human-readable labels (native names — no locale lookup needed). */
export const STT_LANGUAGE_LABELS: Readonly<Record<string, string>> = {
  auto: 'Auto',
  'zh-CN': '中文（普通话）',
  'zh-TW': '中文（台灣）',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'de-DE': 'Deutsch',
  'fr-FR': 'Français',
  'es-ES': 'Español',
  'pt-BR': 'Português (Brasil)',
  'ru-RU': 'Русский',
  'it-IT': 'Italiano',
  'ar-SA': 'العربية',
  'hi-IN': 'हिन्दी',
  'th-TH': 'ไทย',
  'vi-VN': 'Tiếng Việt',
}
