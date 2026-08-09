"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// A one-shot word rewrite: renders `from`, holds, then backspaces and retypes
// itself as `to`.
//
// Two details that make it read as "digital" rather than as a gimmick:
//
// 1. It only deletes back to the two words' common prefix. מבוססת -> מבוקשת
//    share "מבו", so three characters are removed instead of six. The cursor
//    barely moves and the swap feels like a correction, not a restart.
// 2. The word is measured against a hidden sizer set to the *longer* of the
//    two, and the live text is absolutely positioned over it. Nothing after
//    the word moves while the characters come and go — in an RTL line a
//    reflowing mid-sentence word drags the rest of the sentence sideways on
//    every keystroke, which looks broken.
//
// Cost: one setTimeout per character, ~13 renders total, then it is inert
// forever. No rAF, no scroll listener, nothing left running.

const HOLD_MS = 2000;
const DELETE_MS = 45;
const TYPE_MS = 75;

type Step = { text: string; delay: number };

/** Backspace to the shared prefix, then type the rest. */
function buildScript(from: string, to: string): Step[] {
  let common = 0;
  while (common < from.length && common < to.length && from[common] === to[common]) {
    common += 1;
  }

  const steps: Step[] = [];
  for (let length = from.length - 1; length >= common; length -= 1) {
    steps.push({ text: from.slice(0, length), delay: DELETE_MS });
  }
  for (let length = common + 1; length <= to.length; length += 1) {
    steps.push({ text: to.slice(0, length), delay: TYPE_MS });
  }
  return steps;
}

export type TypewriterWordProps = {
  from: string;
  to: string;
  className?: string;
};

export default function TypewriterWord({ from, to, className }: TypewriterWordProps) {
  const prefersReducedMotion = useReducedMotion();
  const [text, setText] = useState(from);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Under reduced motion nothing is scheduled at all; the settled word is
    // substituted at render time below rather than through state, which keeps
    // this effect free of synchronous setState.
    if (prefersReducedMotion) return;

    const script = buildScript(from, to);
    let cancelled = false;
    // Only ever one timeout in flight, so tracking the latest is enough.
    let timer: ReturnType<typeof setTimeout>;

    const step = (index: number) => {
      if (index >= script.length) {
        setIsDone(true);
        return;
      }
      timer = setTimeout(() => {
        if (cancelled) return;
        setText(script[index].text);
        step(index + 1);
      }, script[index].delay);
    };

    timer = setTimeout(() => {
      if (!cancelled) step(0);
    }, HOLD_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [from, to, prefersReducedMotion]);

  const sizer = to.length >= from.length ? to : from;
  const displayed = prefersReducedMotion ? to : text;
  const showCaret = !prefersReducedMotion && !isDone;

  return (
    <span className="relative inline-block align-baseline">
      {/* Reserves the width of the longer word so the rest of the line
          never shifts. Hidden from assistive tech and from the eye. */}
      <span aria-hidden="true" className="invisible">
        {sizer}
      </span>

      {/* The full final sentence is announced once via the parent's sr-only
          copy, so the animated characters are decorative here. */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 start-0 whitespace-nowrap ${className ?? ""}`}
      >
        {displayed}
        <span
          className={`ms-0.5 inline-block w-[0.06em] self-stretch bg-current align-[-0.1em] ${
            showCaret ? "animate-pulse" : "opacity-0"
          }`}
          style={{ height: "0.9em" }}
        />
      </span>
    </span>
  );
}
