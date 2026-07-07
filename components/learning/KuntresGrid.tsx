import KuntresCard from "@/components/learning/KuntresCard";
import type { Kuntres } from "@/lib/learning-data";

export default function KuntresGrid({ items }: { items: Kuntres[] }) {
  if (items.length === 0) {
    return (
      <div className="border-4 border-black bg-cream-dark px-6 py-10 text-center shadow-brutal">
        <p className="text-lg font-black text-navy-950">לא נמצאו תוצאות</p>
        <p className="mt-1 text-sm font-medium text-navy-700/70">נסו חיפוש אחר או נקו את הסינון</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <KuntresCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
}
