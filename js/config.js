/**
 * Application environment configuration.
 * Frozen to prevent object property modifications at runtime.
 *
 * DEBUG_MODE options:
 * - "all"   : Log all actions, warnings, and errors
 * - "error" : Log ONLY errors
 * - "off"   : Disable all logging completely
 */
export const ENV = Object.freeze({
  DEBUG_MODE: "all",
});
