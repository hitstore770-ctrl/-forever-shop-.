"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@/components/icons";
import type { ZmanimToday } from "@/lib/zmanim";

// Live "זמני היום" panel for Jerusalem. Fetches the small JSON from
// /api/zmanim on mount (keeping the zmanim library server-side) and renders
// today's halachic times in the brutalist brand style. Fails quietly — if the
// calculation is unavailable, the panel simply doesn't render.
export default function ZmanimPanel() {
  const [data, setData] = useState<ZmanimToday | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/zmanim")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad status"))))
      .then((json: ZmanimToday) => {
        if (!cancelled) {
          setData(json);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "error") return null;

  return (
    <div className="border-4 border-black bg-navy-950 p-6 text-cream shadow-brutal-lg sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-xl font-semibold uppercase">
          <ClockIcon className="h-5 w-5 text-copper-400" />
          זמני היום · ירושלים
        </h3>
        {data && (
          <span className="text-sm font-normal text-cream/60">
            {data.hebrewWeekday} · {new Date(data.date).toLocaleDateString("he-IL")}
          </span>
        )}
      </div>

      {status === "loading" ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse border-2 border-cream/20 bg-cream/5" aria-hidden="true" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data?.items.map((zman) => (
            <div key={zman.key} className="border-2 border-cream/20 bg-navy-900 px-3 py-2.5">
              <p className="text-xs font-normal text-cream/60">{zman.label}</p>
              <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-copper-300" dir="ltr">
                {zman.time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
