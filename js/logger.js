const STORAGE_KEY = "holoavi:debug";

function readDebugFlag() {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get(
      "debug",
    );
    if (fromQuery !== null) return fromQuery !== "0" && fromQuery !== "false";
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch (e) {
    return false;
  }
}

let debugEnabled = readDebugFlag();

export function setDebug(enabled) {
  debugEnabled = !!enabled;
  try {
    localStorage.setItem(STORAGE_KEY, debugEnabled ? "1" : "0");
  } catch (e) {
    // localStorage unavailable (private mode, etc.) - flag just won't persist
  }
}

export function isDebugEnabled() {
  return debugEnabled;
}

export function createLogger(namespace) {
  const prefix = `[${namespace}]`;
  return {
    log: (...args) => {
      if (debugEnabled) console.log(prefix, ...args);
    },
    warn: (...args) => {
      if (debugEnabled) console.warn(prefix, ...args);
    },
    error: (...args) => {
      if (debugEnabled) console.error(prefix, ...args);
    },
  };
}
