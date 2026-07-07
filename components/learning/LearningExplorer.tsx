"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/learning/SearchBar";
import FilterButtons from "@/components/learning/FilterButtons";
import KuntresGrid from "@/components/learning/KuntresGrid";
import { KUNTRES_ITEMS, type KuntresCategory } from "@/lib/learning-data";

// Holds the search + category-filter state and derives the visible list.
// A dedicated client component so the page itself can stay a server component.
export default function LearningExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<KuntresCategory | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim();
    return KUNTRES_ITEMS.filter((item) => {
      const matchesCategory = !category || item.category === category;
      const matchesQuery =
        !normalizedQuery ||
        item.title.includes(normalizedQuery) ||
        item.author.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-8">
      <SearchBar value={query} onChange={setQuery} />
      <FilterButtons active={category} onChange={setCategory} />
      <KuntresGrid items={filteredItems} />
    </div>
  );
}
