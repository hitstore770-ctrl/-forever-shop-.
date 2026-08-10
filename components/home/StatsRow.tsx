import CountUp from "@/components/home/CountUp";
import { HOME_STATS } from "@/lib/home-data";
import { cn } from "@/lib/cn";

// Four counters on one rule. Two columns on a phone, four from sm up, with the
// separators drawn as grid gaps over an inverted ground rather than as
// per-cell borders — same trick as the sharp grid, and for the same reason:
// the rules stay even and never double up where two cells meet.

export default function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-[3px] border-[3px] border-kb bg-kb-inv sm:grid-cols-4">
      {HOME_STATS.map((stat, index) => (
        <div
          key={stat.label}
          className={cn(
            "flex flex-col justify-between bg-kb p-5 sm:p-7",
            // Last cell on a 2-col phone grid would leave a ragged edge if the
            // list ever grows odd; spanning it keeps the block rectangular.
            HOME_STATS.length % 2 === 1 && index === HOME_STATS.length - 1
              ? "col-span-2 sm:col-span-1"
              : undefined,
          )}
        >
          <span className="text-[0.55rem] font-bold tracking-[0.25em] text-kb-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
          <CountUp
            value={stat.value}
            suffix={stat.suffix}
            className="mt-6 block text-4xl leading-none font-extrabold tracking-[-0.05em] text-kb sm:text-6xl"
          />
          <span className="mt-2 text-xs font-bold tracking-tight text-kb-dim sm:text-sm">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}
