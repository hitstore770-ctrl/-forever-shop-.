"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { haptic } from "@/lib/haptics";

// Square, physical push-switch that inverts the landing page.
//
// The state of record is the `data-kb-dark` attribute on <html>, not React
// state. globals.css keys the whole two-colour system off that attribute, so
// making the DOM the source of truth means there is exactly one place the
// theme lives — no chance of the class list and a useState drifting apart.
// useSyncExternalStore subscribes this component to it and hands SSR a stable
// `false`, which avoids the hydration mismatch a localStorage read in a
// useState initialiser would cause.
//
// Only .kb-page descendants respond to the attribute, so leaving it set while
// the visitor browses to the brutalist cream pages changes nothing there, and
// their choice is still in effect when they come back.

const STORAGE_KEY = "kb-dark";
const EVENT = "kb-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  // Keeps two open tabs in agreement.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return document.documentElement.dataset.kbDark === "true";
}

function getServerSnapshot() {
  return false;
}

function applyDark(next: boolean) {
  if (next) {
    document.documentElement.dataset.kbDark = "true";
  } else {
    delete document.documentElement.dataset.kbDark;
  }
  window.dispatchEvent(new Event(EVENT));
}

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Restore the saved choice. This writes to an external system (the DOM) and
  // notifies subscribers, rather than calling setState — the store above picks
  // the change up on its own.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Safari in private mode throws on localStorage access.
    }
    if (saved === "true") applyDark(true);
  }, []);

  const toggle = useCallback(() => {
    const next = !getSnapshot();
    applyDark(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Preference just will not persist; the toggle still works this session.
    }
    haptic(30);
  }, []);

  const Icon = isDark ? Sun : Moon;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ x: 3, y: 3 }}
      transition={{ type: "spring", stiffness: 1200, damping: 60, mass: 0.4 }}
      aria-pressed={isDark}
      aria-label={isDark ? "מצב בהיר" : "מצב כהה"}
      className="fixed top-5 left-4 z-50 flex h-11 w-11 items-center justify-center border-2 border-kb bg-kb text-kb shadow-[3px_3px_0_0_var(--kb-fg)] sm:h-12 sm:w-12"
    >
      <Icon strokeWidth={2.5} className="h-5 w-5" aria-hidden="true" />
    </motion.button>
  );
}
