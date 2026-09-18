window.__ModuleLoader__.load({ id: "dsh-stt-plugin", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/locales.ts
var NS = "stt";
var zh = {
  "mic.start": "\u5F00\u59CB\u8BED\u97F3\u8F93\u5165",
  "mic.stop": "\u505C\u6B62\u8BED\u97F3\u8F93\u5165",
  "mic.unsupported": "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B\uFF08\u5EFA\u8BAE\u4F7F\u7528 Chrome \u6216 Edge\uFF09",
  "mic.denied": "\u9EA6\u514B\u98CE\u6743\u9650\u88AB\u62D2\u7EDD\uFF0C\u8BF7\u5728\u6D4F\u89C8\u5668\u8BBE\u7F6E\u4E2D\u5141\u8BB8",
  "mic.noMic": "\u672A\u68C0\u6D4B\u5230\u53EF\u7528\u7684\u9EA6\u514B\u98CE\u8BBE\u5907",
  "mic.network": "\u8BED\u97F3\u8BC6\u522B\u670D\u52A1\u7F51\u7EDC\u9519\u8BEF\uFF0C\u8BF7\u91CD\u8BD5",
  "mic.error": "\u8BED\u97F3\u8BC6\u522B\u51FA\u9519",
  "settings.nav": "\u8BED\u97F3\u8F93\u5165",
  "settings.language": "\u8BC6\u522B\u8BED\u8A00",
  "settings.language.auto": "\u8DDF\u968F\u6D4F\u89C8\u5668",
  "settings.continuous": "\u8FDE\u7EED\u542C\u5199",
  "settings.continuous.hint": "\u5F00\u542F\u540E\u9EA6\u514B\u98CE\u6301\u7EED\u5DE5\u4F5C\uFF0C\u76F4\u5230\u518D\u6B21\u70B9\u51FB\u9EA6\u514B\u98CE\u6309\u94AE\u505C\u6B62",
  "settings.autosend": "\u8BC6\u522B\u5B8C\u6210\u540E\u81EA\u52A8\u53D1\u9001",
  "settings.autosend.hint": "\u4EC5\u5355\u6B21\u6A21\u5F0F\u751F\u6548\uFF1A\u4E00\u53E5\u8BDD\u8BC6\u522B\u7ED3\u675F\u540E\u81EA\u52A8\u53D1\u9001\u6D88\u606F",
  "settings.supported.ok": "\u5F53\u524D\u6D4F\u89C8\u5668\u652F\u6301\u8BED\u97F3\u8BC6\u522B\u3002",
  "settings.supported.no": "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u8BED\u97F3\u8BC6\u522B\uFF0C\u8BF7\u4F7F\u7528 Chrome \u6216 Edge\u3002",
  "settings.readonly": "\u5F53\u524D\u8FDE\u63A5\u7684\u8BBE\u7F6E\u5B58\u50A8\u4E3A\u53EA\u8BFB\uFF08\u6216\u8FDB\u7A0B\u5185\u5B58\u6A21\u5F0F\uFF09\uFF0C\u4FEE\u6539\u4EC5\u5BF9\u5F53\u524D\u9875\u9762\u751F\u6548\u3002",
  "settings.unavailable": "\u8BBE\u7F6E\u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u8BED\u97F3\u8F93\u5165\u5C06\u4F7F\u7528\u9ED8\u8BA4\u914D\u7F6E\u3002",
  "settings.fallback": "\u8BBE\u7F6E\u670D\u52A1\u5F53\u524D\u4E0D\u53EF\u5199\u5165\uFF0C\u66F4\u6539\u5C06\u4FDD\u5B58\u5728\u672C\u6D4F\u89C8\u5668\u4E2D\uFF08\u4E0D\u5F71\u54CD\u5176\u4ED6\u8BBE\u5907\uFF09\u3002",
  "settings.uninstall": "\u5378\u8F7D\u672C\u63D2\u4EF6",
  "settings.uninstall.hint": "\u901A\u8FC7\u63D2\u4EF6\u7BA1\u7406\u5668\u79FB\u9664\u672C\u63D2\u4EF6\u7684\u5B89\u88C5\u76EE\u5F55\u4E0E\u914D\u7F6E\u884C\uFF0C\u91CD\u542F Harness \u540E\u751F\u6548\u3002",
  "settings.uninstall.busy": "\u6B63\u5728\u5378\u8F7D\u2026",
  "settings.uninstall.confirm": "\u786E\u5B9A\u5378\u8F7D\u8BED\u97F3\u8F93\u5165\u63D2\u4EF6\u5417\uFF1F\u5B89\u88C5\u76EE\u5F55\u4E0E\u914D\u7F6E\u884C\u5C06\u88AB\u79FB\u9664\uFF0C\u91CD\u542F Harness \u540E\u751F\u6548\u3002",
  "settings.uninstall.restart": "\u5DF2\u63D0\u4EA4\u5378\u8F7D\uFF1A\u63D2\u4EF6\u5C06\u5728\u91CD\u542F Harness \u540E\u79FB\u9664\u3002\u611F\u8C22\u4F7F\u7528\uFF01",
  "settings.uninstall.missing": "\u63D2\u4EF6\u7BA1\u7406\u5668\u672A\u8DDF\u8E2A\u672C\u63D2\u4EF6\uFF08\u53EF\u80FD\u662F\u624B\u5DE5\u5B89\u88C5\uFF09\u3002\u8BF7\u5728\u7EC8\u7AEF\u6267\u884C\uFF1Adsh plugin --profile web remove dsh-stt-plugin",
  "settings.uninstall.failed": "\u5378\u8F7D\u5931\u8D25\uFF1A"
};
var en = {
  "mic.start": "Start voice input",
  "mic.stop": "Stop voice input",
  "mic.unsupported": "Speech recognition is not supported in this browser (try Chrome or Edge)",
  "mic.denied": "Microphone permission denied \u2014 allow it in the browser settings",
  "mic.noMic": "No usable microphone was detected",
  "mic.network": "The speech service hit a network error \u2014 try again",
  "mic.error": "Speech recognition error",
  "settings.nav": "Voice Input",
  "settings.language": "Recognition language",
  "settings.language.auto": "Follow browser",
  "settings.continuous": "Continuous dictation",
  "settings.continuous.hint": "Keep the microphone open until you click the mic button again",
  "settings.autosend": "Auto-send after recognition",
  "settings.autosend.hint": "Single-shot mode only: submit the message as soon as a phrase finishes",
  "settings.supported.ok": "This browser supports speech recognition.",
  "settings.supported.no": "This browser does not support speech recognition; use Chrome or Edge.",
  "settings.readonly": "The settings store is read-only (or process-local) on this connection; changes apply to this page only.",
  "settings.unavailable": "The settings service is unavailable; voice input uses defaults.",
  "settings.fallback": "The settings store is not writable right now \u2014 changes are kept in this browser (they do not follow you to other devices).",
  "settings.uninstall": "Uninstall this plugin",
  "settings.uninstall.hint": "Removes this plugin's install directory and configuration row through the plugin manager; applies after restarting the harness.",
  "settings.uninstall.busy": "Uninstalling\u2026",
  "settings.uninstall.confirm": "Uninstall the Voice Input plugin? Its install directory and configuration row will be removed; the change applies after restarting the harness.",
  "settings.uninstall.restart": "Uninstall submitted: the plugin will be removed when the harness restarts. Thanks for using it!",
  "settings.uninstall.missing": "The plugin manager does not track this plugin (manual install?). Run in a terminal: dsh plugin --profile web remove dsh-stt-plugin",
  "settings.uninstall.failed": "Uninstall failed: "
};

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
var STT_LANGUAGE_LABELS = {
  auto: "Auto",
  "zh-CN": "\u4E2D\u6587\uFF08\u666E\u901A\u8BDD\uFF09",
  "zh-TW": "\u4E2D\u6587\uFF08\u53F0\u7063\uFF09",
  "en-US": "English (US)",
  "en-GB": "English (UK)",
  "ja-JP": "\u65E5\u672C\u8A9E",
  "ko-KR": "\uD55C\uAD6D\uC5B4",
  "de-DE": "Deutsch",
  "fr-FR": "Fran\xE7ais",
  "es-ES": "Espa\xF1ol",
  "pt-BR": "Portugu\xEAs (Brasil)",
  "ru-RU": "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
  "it-IT": "Italiano",
  "ar-SA": "\u0627\u0644\u0639\u0631\u0628\u064A\u0629",
  "hi-IN": "\u0939\u093F\u0928\u094D\u0926\u0940",
  "th-TH": "\u0E44\u0E17\u0E22",
  "vi-VN": "Ti\u1EBFng Vi\u1EC7t"
};

// src/client/local-store.ts
var STORAGE_KEY = "dsh-stt-plugin:config";
var DEFAULT_CONFIG = {
  language: "auto",
  continuous: false,
  autoSend: false
};
var memory = /* @__PURE__ */ new Map();
function storageGet(key) {
  try {
    if (typeof localStorage === "undefined") return memory.get(key);
    return localStorage.getItem(key) ?? void 0;
  } catch {
    return memory.get(key);
  }
}
function storageSet(key, value) {
  try {
    if (typeof localStorage === "undefined") {
      memory.set(key, value);
      return;
    }
    localStorage.setItem(key, value);
  } catch {
    memory.set(key, value);
  }
}
function decodeLocal(raw) {
  if (typeof raw !== "object" || raw === null) return { ...DEFAULT_CONFIG };
  const record = raw;
  return {
    language: typeof record.language === "string" && STT_LANGUAGES.includes(record.language) ? record.language : DEFAULT_CONFIG.language,
    continuous: record.continuous === true,
    autoSend: record.autoSend === true
  };
}
function readLocalConfig() {
  const raw = storageGet(STORAGE_KEY);
  if (raw === void 0) return { ...DEFAULT_CONFIG };
  try {
    return decodeLocal(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}
var listeners = /* @__PURE__ */ new Set();
function subscribeLocal(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
function writeLocalField(field, value) {
  const next = { ...readLocalConfig(), [field]: value };
  storageSet(STORAGE_KEY, JSON.stringify(next));
  for (const listener of listeners) listener();
  return next;
}

// src/client/mic-button.tsx
var import_react = require("react");

// src/client/speech.ts
function getSpeechRecognition() {
  if (typeof window === "undefined") return void 0;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}
function isSpeechSupported() {
  return getSpeechRecognition() !== void 0;
}
function appendPhrase(left, right) {
  const a = left.trim();
  const b = right.trim();
  if (a === "") return b;
  if (b === "") return a;
  return `${a} ${b}`;
}

// src/client/mic-button.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function MicGlyph() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { className: "dsh-stt-mic-glyph", viewBox: "0 0 16 16", width: "16", height: "16", "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5.5", y: "1", width: "5", height: "8", rx: "2.5", fill: "currentColor" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "path",
      {
        d: "M3.5 7.5a4.5 4.5 0 0 0 9 0",
        stroke: "currentColor",
        strokeWidth: "1.5",
        fill: "none",
        strokeLinecap: "round"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", { x1: "8", y1: "12", x2: "8", y2: "15", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
  ] });
}
function MicButton(props) {
  const { t, config, schedule } = props;
  const supported = getSpeechRecognition() !== void 0;
  const input = props.useInput !== void 0 ? props.useInput((state) => state) : void 0;
  const [listening, setListening] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const inputRef = (0, import_react.useRef)(void 0);
  const recognitionRef = (0, import_react.useRef)(null);
  const wantsListeningRef = (0, import_react.useRef)(false);
  const baseDraftRef = (0, import_react.useRef)("");
  const finalTextRef = (0, import_react.useRef)("");
  const autoSendRef = (0, import_react.useRef)(false);
  const restartDisposerRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    inputRef.current = input;
  }, [input]);
  (0, import_react.useEffect)(() => () => {
    wantsListeningRef.current = false;
    try {
      recognitionRef.current?.abort();
    } catch {
    }
    restartDisposerRef.current?.();
  }, []);
  const composeDraft = (text) => {
    const actions = props.inputActions;
    const state = inputRef.current;
    if (actions === void 0 || state === void 0 || state.phase !== "plain") return;
    const base = baseDraftRef.current.trimEnd();
    const next = base === "" ? text.trim() : appendPhrase(base, text);
    if (next === state.draft) return;
    actions.setDraft(next);
  };
  const startRecognition = () => {
    const Ctor = getSpeechRecognition();
    if (Ctor === void 0) return;
    const current = config();
    const recognition = new Ctor();
    recognition.lang = current.language === "auto" ? typeof navigator !== "undefined" && navigator.language !== "" ? navigator.language : "en-US" : current.language;
    recognition.continuous = current.continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        if (result === void 0) continue;
        const transcript = result[0]?.transcript ?? "";
        if (result.isFinal) {
          finalTextRef.current = appendPhrase(finalTextRef.current, transcript);
        } else {
          interim += transcript;
        }
      }
      composeDraft(appendPhrase(finalTextRef.current, interim));
    };
    recognition.onerror = (event) => {
      const code = event.error;
      if (code === "no-speech" || code === "aborted") return;
      if (code === "not-allowed" || code === "service-not-allowed") setError(t("mic.denied"));
      else if (code === "audio-capture") setError(t("mic.noMic"));
      else if (code === "network") setError(t("mic.network"));
      else setError(`${t("mic.error")} (${code})`);
    };
    recognition.onend = () => {
      if (wantsListeningRef.current && config().continuous) {
        restartDisposerRef.current?.();
        restartDisposerRef.current = schedule(() => {
          restartDisposerRef.current = null;
          if (!wantsListeningRef.current) return;
          try {
            startRecognition();
          } catch {
            wantsListeningRef.current = false;
            setListening(false);
          }
        }, 250);
        return;
      }
      wantsListeningRef.current = false;
      setListening(false);
      if (autoSendRef.current) {
        autoSendRef.current = false;
        try {
          props.inputActions?.submit();
        } catch {
        }
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  };
  const start = () => {
    if (!supported || props.inputActions === void 0) return;
    setError(null);
    baseDraftRef.current = inputRef.current?.draft ?? "";
    finalTextRef.current = "";
    wantsListeningRef.current = true;
    autoSendRef.current = config().autoSend && !config().continuous;
    try {
      startRecognition();
      setListening(true);
    } catch {
      wantsListeningRef.current = false;
      setError(t("mic.error"));
    }
  };
  const stop = () => {
    wantsListeningRef.current = false;
    restartDisposerRef.current?.();
    restartDisposerRef.current = null;
    try {
      recognitionRef.current?.stop();
    } catch {
    }
    setListening(false);
  };
  const keepFocus = (event) => {
    event.preventDefault();
  };
  const label = listening ? t("mic.stop") : t("mic.start");
  const disabled = !supported || props.inputActions === void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "button",
    {
      type: "button",
      className: "dsh-stt-mic",
      "data-listening": listening ? "true" : "false",
      "aria-label": label,
      "aria-pressed": listening,
      title: error ?? (supported ? label : t("mic.unsupported")),
      disabled,
      onMouseDown: keepFocus,
      onClick: listening || wantsListeningRef.current ? stop : start,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicGlyph, {})
    }
  );
}

// src/client/settings-section.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var PLUGIN_NAME = "dsh-stt-plugin";
function isLoopbackPage() {
  if (typeof location === "undefined") return false;
  const host = location.hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host === "::1";
}
function SttSettingsSection(props) {
  const { t, scope, persisted, manager } = props;
  const [snapshot, setSnapshot] = (0, import_react2.useState)(
    scope?.getSnapshot()
  );
  const [localConfig, setLocalConfig] = (0, import_react2.useState)(() => readLocalConfig());
  (0, import_react2.useEffect)(() => {
    if (scope === void 0) return void 0;
    return scope.subscribe(() => {
      setSnapshot(scope.getSnapshot());
    });
  }, [scope]);
  (0, import_react2.useEffect)(() => subscribeLocal(() => {
    setLocalConfig(readLocalConfig());
  }), []);
  const useScope = snapshot !== void 0 && snapshot.status === "ready" && snapshot.writable;
  const value = useScope ? snapshot.value : localConfig;
  const language = value?.language ?? "auto";
  const continuous = value?.continuous ?? false;
  const autoSend = value?.autoSend ?? false;
  const setField = (field, next) => {
    if (useScope) {
      scope?.set(field, next).catch(() => {
      });
      return;
    }
    setLocalConfig(writeLocalField(field, next));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-stt-section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh-stt-note", children: isSpeechSupported() ? t("settings.supported.ok") : t("settings.supported.no") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-stt-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-copy", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-label", children: t("settings.language") }) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "select",
        {
          className: "dsh-stt-select",
          value: language,
          onChange: (event) => {
            setField("language", event.currentTarget.value);
          },
          children: STT_LANGUAGES.map((code) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("option", { value: code, children: code === "auto" ? t("settings.language.auto") : STT_LANGUAGE_LABELS[code] ?? code }, code))
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-stt-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh-stt-row-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-label", children: t("settings.continuous") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-hint", children: t("settings.continuous.hint") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          className: "dsh-stt-switch",
          role: "switch",
          "aria-checked": continuous,
          "aria-label": t("settings.continuous"),
          "data-on": continuous ? "true" : "false",
          onClick: () => {
            setField("continuous", !continuous);
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-stt-row", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh-stt-row-copy", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-label", children: t("settings.autosend") }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-hint", children: t("settings.autosend.hint") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          className: "dsh-stt-switch",
          role: "switch",
          "aria-checked": autoSend,
          "aria-label": t("settings.autosend"),
          "data-on": autoSend ? "true" : "false",
          onClick: () => {
            setField("autoSend", !autoSend);
          }
        }
      )
    ] }),
    persisted() ? null : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh-stt-note", children: t("settings.fallback") }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(UninstallZone, { manager, t })
  ] });
}
function UninstallZone(props) {
  const { manager, t } = props;
  const [state, setState] = (0, import_react2.useState)({ kind: "idle" });
  if (manager === void 0 || !isLoopbackPage()) return null;
  const onUninstall = () => {
    if (state.kind === "busy") return;
    if (!window.confirm(t("settings.uninstall.confirm"))) return;
    setState({ kind: "busy" });
    void (async () => {
      try {
        const rows = await manager.list();
        const row = rows.find((item) => item.name === PLUGIN_NAME || item.id === PLUGIN_NAME);
        if (row === void 0) {
          setState({ kind: "missing" });
          return;
        }
        await manager.uninstall(row.id);
        setState({ kind: "done" });
      } catch (reason) {
        setState({ kind: "failed", message: reason instanceof Error ? reason.message : String(reason) });
      }
    })();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh-stt-danger-zone", children: [
    state.kind === "done" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh-stt-note", children: t("settings.uninstall.restart") }) : state.kind === "missing" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "dsh-stt-note", children: t("settings.uninstall.missing") }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh-stt-row-hint", children: t("settings.uninstall.hint") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          type: "button",
          className: "dsh-stt-danger",
          disabled: state.kind === "busy",
          onClick: onUninstall,
          children: state.kind === "busy" ? t("settings.uninstall.busy") : t("settings.uninstall")
        }
      )
    ] }),
    state.kind === "failed" ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("p", { className: "dsh-stt-note", children: [
      t("settings.uninstall.failed"),
      state.message
    ] }) : null
  ] });
}

// src/client/styles.ts
var STT_CSS = `
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
.dsh-stt-danger {
  align-self: flex-start;
  padding: 6px 14px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-danger, #d64545);
  font-size: 13px;
  cursor: pointer;
}
.dsh-stt-danger:hover:not(:disabled) {
  background: var(--dsw-alias-bg-danger, rgba(214, 69, 69, 0.1));
  border-color: var(--dsw-alias-label-danger, #d64545);
}
.dsh-stt-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.dsh-stt-danger-zone {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.12));
}
`;

// src/client/index.tsx
var name = "dsh-stt-plugin";
var inject = ["slots", "locale", "settingsScope"];
var DEFAULT_CONFIG2 = {
  language: "auto",
  continuous: false,
  autoSend: false
};
function decodeConfig(section) {
  if (typeof section !== "object" || section === null) return void 0;
  const raw = section;
  return {
    language: typeof raw.language === "string" && STT_LANGUAGES.includes(raw.language) ? raw.language : DEFAULT_CONFIG2.language,
    continuous: raw.continuous === true,
    autoSend: raw.autoSend === true
  };
}
function fallbackTranslate(key) {
  const browserZh = typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("zh");
  const dict = browserZh ? zh : en;
  return dict[key] ?? key;
}
function apply(ctx) {
  console.log("[dsh-stt-plugin] client half applying");
  const slots = ctx.get("slots");
  if (slots === void 0) {
    console.warn("[dsh-stt-plugin] slots service absent \u2014 nothing to register");
    return;
  }
  ctx.effect(() => {
    if (typeof document === "undefined") return void 0;
    const style = document.createElement("style");
    style.dataset.plugin = "dsh-stt-plugin";
    style.textContent = STT_CSS;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, "dsh-stt-plugin: styles");
  const locale = ctx.get("locale");
  let t = fallbackTranslate;
  if (locale !== void 0) {
    ctx.effect(() => locale.register(NS, { zh, en }), "dsh-stt-plugin: dictionaries");
    t = locale.bind(NS);
  }
  const settingsScope = ctx.get("settingsScope");
  let scope;
  if (settingsScope !== void 0 && typeof settingsScope.bind === "function") {
    scope = settingsScope.bind({ namespace: "ui-stt", decode: decodeConfig });
  }
  const readConfig = () => {
    const snapshot = scope?.getSnapshot();
    if (snapshot?.status === "ready" && snapshot.writable && snapshot.value !== void 0) {
      return snapshot.value;
    }
    return readLocalConfig();
  };
  const persistedNow = () => {
    const snapshot = scope?.getSnapshot();
    return snapshot?.status === "ready" && snapshot.writable && snapshot.mode === "host";
  };
  const timer = ctx.get("timer");
  const managerCandidate = ctx.get("pluginManager");
  const manager = managerCandidate !== void 0 && typeof managerCandidate.list === "function" && typeof managerCandidate.uninstall === "function" ? managerCandidate : void 0;
  const shared = {
    config: readConfig,
    schedule: (callback, delayMs) => {
      if (timer !== void 0 && typeof timer.timeout === "function") {
        return timer.timeout(callback, delayMs);
      }
      const id = setTimeout(callback, delayMs);
      return () => {
        clearTimeout(id);
      };
    },
    scope,
    persisted: persistedNow,
    manager
  };
  slots.inject("conversation.input.right", () => slots.register(
    { name: "conversation.input.right", id: "stt-mic", locale: NS, inject: () => shared },
    (props) => MicButton(props)
  ));
  slots.inject("settings.section", () => slots.register(
    { name: "settings.section", id: "stt", order: 900, label: () => t("settings.nav"), locale: NS, inject: () => shared },
    (props) => SttSettingsSection(props)
  ));
  console.log("[dsh-stt-plugin] slots registered: mic button + settings page");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
