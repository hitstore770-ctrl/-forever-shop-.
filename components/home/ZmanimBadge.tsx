import { cn } from "@/lib/cn";

// Corner plate carrying today's Jerusalem sunset. Half information, half
// design element — the point is that the page is anchored to a real place
// running on real halachic time.
//
// The value is computed on the server (lib/zmanim.ts is server-only and runs a
// pure astronomical calculation — no API, no key, no network) and passed in as
// a string, so this stays a plain presentational component with nothing to
// hydrate.

export type ZmanimBadgeProps = {
  /** "HH:mm" wall clock in Jerusalem. */
  time: string;
  className?: string;
};

export default function ZmanimBadge({ time, className }: ZmanimBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-stretch border-2 border-kb bg-kb text-kb shadow-[4px_4px_0_0_var(--kb-fg)]",
        className,
      )}
    >
      <span className="flex items-center bg-kb-inv px-2.5 py-1.5 text-[0.55rem] font-extrabold tracking-[0.2em] text-kb-inv">
        שקיעה
      </span>
      <span className="flex items-center px-3 py-1.5 text-base font-extrabold tracking-tight tabular-nums">
        {time}
      </span>
      <span className="flex items-center border-s-2 border-kb px-2.5 py-1.5 text-[0.55rem] font-bold tracking-[0.15em] text-kb-dim">
        ירושלים
      </span>
    </div>
  );
}
