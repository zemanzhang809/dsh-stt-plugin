// src/host.ts
import Schema from "schemastery";

// src/shared/languages.ts
var STT_LANGUAGES = [
  "auto",
  "zh-CN",
  "zh-TW",
  "en-US",
  "en-GB",
  "ja-JP",
  "ko-KR",
  "de-DE",
  "fr-FR",
  "es-ES",
  "pt-BR",
  "ru-RU",
  "it-IT",
  "ar-SA",
  "hi-IN",
  "th-TH",
  "vi-VN"
];

// src/host.ts
var name = "dsh-stt-plugin";
var inject = ["settings"];
var STT_NAMESPACE = "ui-stt";
function apply(ctx) {
  const settings = ctx.get("settings");
  if (settings === void 0 || typeof settings.register !== "function") {
    console.warn("[dsh-stt-plugin] settings service absent \u2014 ui-stt namespace not registered");
    return;
  }
  settings.register(STT_NAMESPACE, Schema.object({
    language: Schema.union([...STT_LANGUAGES]).default("auto").description('Recognition language ("auto" follows the browser locale)'),
    continuous: Schema.boolean().default(false).description("Keep the microphone open until toggled off"),
    autoSend: Schema.boolean().default(false).description("Submit the message automatically when a phrase finishes (single-shot mode)")
  }));
}
export {
  STT_NAMESPACE,
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
