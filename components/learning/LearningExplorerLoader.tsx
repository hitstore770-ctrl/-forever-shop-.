import LearningExplorer from "@/components/learning/LearningExplorer";
import { getKuntresim } from "@/lib/learning-data";

// Async server component that owns the Firestore read. Isolating the await
// here (rather than in the page) lets the page wrap just this piece in a
// Suspense boundary — so the hero renders instantly and only the explorer
// area shows a skeleton while the Kuntresim load.
export default async function LearningExplorerLoader() {
  const items = await getKuntresim();
  return <LearningExplorer items={items} />;
}
