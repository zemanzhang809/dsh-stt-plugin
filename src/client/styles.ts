/**
 * Plugin-owned stylesheet, injected once per run as a tagged <style> element.
 * Colors reference the DSH theme alias tokens so the control follows light
 * and dark themes.
 */

export const STT_CSS = `
.dsh-stt-mic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #8a8f99);
  cursor: pointer;
  flex: none;
}
.dsh-stt-mic:hover:not(:disabled) {
  color: var(--dsw-alias-label-primary, #1a1d23);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.06));
}
.dsh-stt-mic:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.dsh-stt-mic[data-listening="true"] {
  color: var(--dsw-alias-state-error-primary, #d64545);
}
.dsh-stt-mic[data-listening="true"] .dsh-stt-mic-glyph {
  animation: dsh-stt-pulse 1.2s ease-in-out infinite;
}
@keyframes dsh-stt-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}
.dsh-stt-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 560px;
}
.dsh-stt-note {
  margin: 0;
  color: var(--dsw-alias-label-secondary, #8a8f99);
  font-size: 12px;
  line-height: 1.6;
}
.dsh-stt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.dsh-stt-row-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh-stt-row-label {
  color: var(--dsw-alias-label-primary, #1a1d23);
  font-size: 13px;
}
.dsh-stt-row-hint {
  color: var(--dsw-alias-label-secondary, #8a8f99);
  font-size: 12px;
  line-height: 1.5;
}
.dsh-stt-select {
  flex: none;
  min-width: 160px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  color: var(--dsw-alias-label-primary, #1a1d23);
  font-size: 13px;
}
.dsh-stt-select:disabled {
  opacity: 0.5;
}
.dsh-stt-switch {
  position: relative;
  flex: none;
  width: 34px;
  height: 20px;
  border: none;
  border-radius: 10px;
  background: var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.18));
  cursor: pointer;
  transition: background 120ms ease;
}
.dsh-stt-switch[data-on="true"] {
  background: var(--dsw-alias-brand-primary, #4b6bfb);
}
.dsh-stt-switch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dsh-stt-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform 120ms ease;
}
.dsh-stt-switch[data-on="true"]::after {
  transform: translateX(14px);
}
`
