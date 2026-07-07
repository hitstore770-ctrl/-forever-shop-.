// Shared skeleton wrapper for section pages so every route looks consistent
// until its real content is built out. Not meant to survive into later phases —
// each page will replace this with its own layout.
export default function PagePlaceholder({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 sm:text-4xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-navy-700/70">{description}</p>}
      {children}
    </div>
  );
}
