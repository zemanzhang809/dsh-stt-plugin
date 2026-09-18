/**
 * Locale dictionaries for the plugin's own copy. Registered into the DSH
 * locale service under the `stt` namespace; the built-in locales are `zh`
 * and `en`.
 */

/** Locale namespace owned by this plugin. */
export const NS = 'stt'

/** Chinese (simplified) copy. */
export const zh: Record<string, string> = {
  'mic.start': '开始语音输入',
  'mic.stop': '停止语音输入',
  'mic.unsupported': '当前浏览器不支持语音识别（建议使用 Chrome 或 Edge）',
  'mic.denied': '麦克风权限被拒绝，请在浏览器设置中允许',
  'mic.noMic': '未检测到可用的麦克风设备',
  'mic.network': '语音识别服务网络错误，请重试',
  'mic.error': '语音识别出错',
  'settings.nav': '语音输入',
  'settings.language': '识别语言',
  'settings.language.auto': '跟随浏览器',
  'settings.continuous': '连续听写',
  'settings.continuous.hint': '开启后麦克风持续工作，直到再次点击麦克风按钮停止',
  'settings.autosend': '识别完成后自动发送',
  'settings.autosend.hint': '仅单次模式生效：一句话识别结束后自动发送消息',
  'settings.supported.ok': '当前浏览器支持语音识别。',
  'settings.supported.no': '当前浏览器不支持语音识别，请使用 Chrome 或 Edge。',
  'settings.readonly': '当前连接的设置存储为只读（或进程内存模式），修改仅对当前页面生效。',
  'settings.unavailable': '设置服务不可用，语音输入将使用默认配置。',
  'settings.fallback': '设置服务当前不可写入，更改将保存在本浏览器中（不影响其他设备）。',
}

/** English copy. */
export const en: Record<string, string> = {
  'mic.start': 'Start voice input',
  'mic.stop': 'Stop voice input',
  'mic.unsupported': 'Speech recognition is not supported in this browser (try Chrome or Edge)',
  'mic.denied': 'Microphone permission denied — allow it in the browser settings',
  'mic.noMic': 'No usable microphone was detected',
  'mic.network': 'The speech service hit a network error — try again',
  'mic.error': 'Speech recognition error',
  'settings.nav': 'Voice Input',
  'settings.language': 'Recognition language',
  'settings.language.auto': 'Follow browser',
  'settings.continuous': 'Continuous dictation',
  'settings.continuous.hint': 'Keep the microphone open until you click the mic button again',
  'settings.autosend': 'Auto-send after recognition',
  'settings.autosend.hint': 'Single-shot mode only: submit the message as soon as a phrase finishes',
  'settings.supported.ok': 'This browser supports speech recognition.',
  'settings.supported.no': 'This browser does not support speech recognition; use Chrome or Edge.',
  'settings.readonly': 'The settings store is read-only (or process-local) on this connection; changes apply to this page only.',
  'settings.unavailable': 'The settings service is unavailable; voice input uses defaults.',
  'settings.fallback': 'The settings store is not writable right now — changes are kept in this browser (they do not follow you to other devices).',
}
