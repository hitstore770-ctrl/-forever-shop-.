"use client";

import { useSyncExternalStore } from "react";
import { headlineForHour } from "@/lib/home-data";

// Sub-headline picked from the visitor's own clock.
//
// The clock is an external source, so it is read through useSyncExternalStore
// rather than a useState/useEffect pair. That gets two things for free: the
// server snapshot is `null`, so the server never commits to a variant it
// cannot know, and there is no synchronous setState in an effect to trigger a
// second render pass on every mount.
//
// The wrapper reserves a line of height while the value is unknown, so the
// headline below does not jump when the real text arrives.

// Nothing pushes updates — the hour is read once per render and does not
// change within a session that matters.
const noopSubscribe = () => () => {};
const getSnapshot = () => new Date().getHours();
const getServerSnapshot = () => null;

export default function TimeHeadline({ className }: { className?: string }) {
  const hour = useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);

  return (
    <span className={className}>
      {hour === null ? <span className="invisible">&nbsp;</span> : headlineForHour(hour)}
    </span>
  );
}
