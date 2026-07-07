import { LEARNING_CATEGORIES, type KuntresCategory } from "@/lib/learning-data";

export default function FilterButtons({
  active,
  onChange,
}: {
  active: KuntresCategory | null;
  onChange: (category: KuntresCategory | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {LEARNING_CATEGORIES.map((category) => {
        const isActive = active === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(isActive ? null : category)}
            className={`border-[3px] border-black px-5 py-2 text-sm font-black uppercase transition-all ${
              isActive
                ? "translate-x-1 translate-y-1 bg-copper-500 text-navy-950 shadow-brutal-none"
                : "bg-cream text-navy-900 shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
