import { ENV } from "./config.js";

/**
 * Supported debug modes:
 * - "all"   : Logs all actions, warnings, and errors.
 * - "error" : Logs ONLY errors.
 * - "off"   : Disables all logging output.
 */
export const DEBUG_MODES = Object.freeze({
  ALL: "all",
  ERROR: "error",
  OFF: "off",
});

function normalizeMode(val) {
  if (val === null || val === undefined) return DEBUG_MODES.OFF;
  const str = String(val).trim().toLowerCase();
  if (
    str === "all" ||
    str === "verbose" ||
    str === "1" ||
    str === "true" ||
    str === "full"
  ) {
    return DEBUG_MODES.ALL;
  }
  if (str === "error" || str === "errors" || str === "err") {
    return DEBUG_MODES.ERROR;
  }
  return DEBUG_MODES.OFF;
}

const currentDebugMode = normalizeMode(ENV?.DEBUG_MODE);

export function getDebugMode() {
  return currentDebugMode;
}

export function isDebugEnabled() {
  return currentDebugMode !== DEBUG_MODES.OFF;
}

export function createLogger(namespace) {
  const prefix = `[${namespace}]`;
  return {
    log: (...args) => {
      if (currentDebugMode === DEBUG_MODES.ALL) {
        console.log(prefix, ...args);
      }
    },
    warn: (...args) => {
      if (currentDebugMode === DEBUG_MODES.ALL) {
        console.warn(prefix, ...args);
      }
    },
    error: (...args) => {
      if (
        currentDebugMode === DEBUG_MODES.ALL ||
        currentDebugMode === DEBUG_MODES.ERROR
      ) {
        console.error(prefix, ...args);
      }
    },
  };
}
