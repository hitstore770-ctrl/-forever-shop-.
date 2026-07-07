import { SearchIcon } from "@/components/icons";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-navy-900/50" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="חיפוש קונטרס, שיעור או מרצה..."
        className="w-full border-4 border-black bg-cream py-4 pr-12 pl-4 text-lg font-bold text-navy-950 shadow-brutal placeholder:font-medium placeholder:text-navy-900/40 focus:outline-none"
      />
    </div>
  );
}
