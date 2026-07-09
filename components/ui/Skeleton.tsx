// Base skeleton block — a pulsing placeholder. Compose these to mirror the
// shape of content that's still loading. Pure presentational (no hooks), so
// it works in Server Components and Suspense fallbacks alike.
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-navy-900/10 ${className}`} aria-hidden="true" />;
}
