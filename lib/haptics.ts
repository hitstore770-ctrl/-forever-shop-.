// Short haptic tick for primary actions.
//
// Worth knowing before you rely on this: the Vibration API is Android-only in
// practice. iOS Safari does not implement `navigator.vibrate` at all — there
// is no permission to ask for and no polyfill that works from a web page, so
// on an iPhone this is a silent no-op. Every call site therefore has to stand
// on its own visually; the buzz is a bonus on the devices that have it, never
// the feedback itself.
//
// Browsers also ignore vibration outside a user gesture, which is exactly when
// we call it, and some throttle repeated calls. Both fail quietly.

const DEFAULT_MS = 50;

export function haptic(durationMs: number = DEFAULT_MS): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") {
    return;
  }
  try {
    navigator.vibrate(durationMs);
  } catch {
    // Some browsers throw instead of returning false when vibration is
    // blocked by a policy. Nothing useful to do either way.
  }
}
