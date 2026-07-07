import { RECENT_DEDICATIONS } from "@/lib/donate-data";
import { HeartHandIcon } from "@/components/icons";

// Social proof — recent dedications, in a straight, evenly aligned grid.
export default function RecentDedications() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {RECENT_DEDICATIONS.map((dedication) => (
        <div
          key={dedication.name + dedication.note}
          className="flex items-start gap-4 border-4 border-black bg-cream p-5 shadow-brutal"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-copper-400 text-navy-950">
            <HeartHandIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-navy-950">{dedication.name}</p>
            <p className="mt-1 text-sm font-normal text-navy-700/70">{dedication.note}</p>
            <p className="mt-2 text-xs font-semibold text-copper-600 uppercase">{dedication.timeAgo}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
