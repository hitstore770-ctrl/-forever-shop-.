Here's the complete App Shell with production-grade micro-interactions:

```tsx
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
  useAnimationControls,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  MoreHorizontal,
  Info,
  Home,
  Calendar,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

/* ================================================================== */
/*  1. SMOOTH SCROLL PROVIDER                                          */
/*  Heavy "buttery" scroll simulated by translating the content        */
/*  wrapper with a critically-damped spring that lags behind the       */
/*  native scroll position. A spacer div preserves real scrollbar      */
/*  height so useScroll() and anchor links keep working natively.      */
/* ================================================================== */
function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Raw native scroll value
  const rawY = useMotionValue(0);

  // The "heavy" spring — low stiffness + high damping = weighty glide
  const smoothY = useSpring(rawY, {
    stiffness: 90,
    damping: 26,
    mass: 0.9,
    restDelta: 0.001,
  });

  /* --- Measure content height into the spacer (ResizeObserver) --- */
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => setContentHeight(el.getBoundingClientRect().height);
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* --- Sync native scroll → motion value (rAF throttled) --- */
  useEffect(() => {
    // Respect accessibility preference: bail out of smoothing entirely
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (prefersReduced) {
          rawY.set(y);
          smoothY.jump(y);
        } else {
          rawY.set(y);
        }
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rawY, smoothY]);

  return (
    <>
      {/* Fixed viewport-locked stage holding the transformed content */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          ref={contentRef}
          style={{ y: useNegative(smoothY), willChange: "transform" }}
        >
          {children}
        </motion.div>
      </div>

      {/* Spacer that generates the real scrollbar */}
      <div style={{ height: contentHeight }} aria-hidden="true" />
    </>
  );
}

/* Helper: invert a MotionValue (scroll down → move content up) */
function useNegative(mv: ReturnType<typeof useSpring>) {
  const out = useMotionValue(0);
  useMotionValueEvent(mv, "change", (v) => out.set(-v));
  return out;
}

/* ================================================================== */
/*  2. BOTTOM DOCK                                                     */
/* ================================================================== */
type DockItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  accent?: boolean;
  external?: boolean;
};

// NOTE: Array order is visual RIGHT → LEFT because the dock is inside dir="rtl".
const DOCK_ITEMS: DockItem[] = [
  { label: "עוד טיפה", icon: MoreHorizontal, href: "#more" },
  { label: "מה קורה פה", icon: Info, href: "#about" },
  { label: "בית", icon: Home, href: "#home", active: true },
  { label: "ההתוועדות הקרובה", icon: Calendar, href: "#event" },
  {
    label: "חנות",
    icon: ShoppingBag,
    href: "https://swiwgi-zu.myshopify.com/",
    accent: true,
    external: true,
  },
];

const dockContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.35 },
  },
};

const dockItemVariants: Variants = {
  hidden: { y: 90, opacity: 0, scale: 0.6 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 22, mass: 0.7 },
  },
};

function BottomDock() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.nav
      dir="rtl"
      aria-label="ניווט ראשי"
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30, delay: 0.15 }}
      className="fixed bottom-0 left-0 w-full z-50 backdrop-blur-md bg-slate-50/90 border-t-[3px] border-slate-950 rounded-none"
    >
      {/* Accent hairline */}
      <div className="absolute top-0 right-0 h-[3px] w-1/3 bg-amber-700" />

      <motion.ul
        variants={dockContainer}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl items-end justify-between gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:gap-2 sm:px-6"
      >
        {DOCK_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = !!item.active;
          const isHot = hovered === i;

          return (
            <motion.li
              key={item.label}
              variants={dockItemVariants}
              className="flex-1"
            >
              <motion.a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-current={isActive ? "page" : undefined}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                whileTap={{ scale: 0.85 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                className={[
                  "group relative flex flex-col items-center justify-end gap-1 rounded-none border-2 px-1.5 py-2 outline-none transition-colors duration-200 sm:px-3",
                  "focus-visible:ring-4 focus-visible:ring-amber-700/40",
                  isActive
                    ? "border-slate-950 bg-slate-950 shadow-[4px_4px_0px_0px_#B45309]"
                    : "border-transparent hover:border-slate-950",
                  !isActive && isHot ? "bg-slate-950" : "",
                ].join(" ")}
              >
                {/* Brutalist active accent mark */}
                {isActive && (
                  <motion.span
                    layoutId="dock-active-mark"
                    className="absolute -top-[3px] right-0 left-0 h-[6px] bg-amber-700"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  strokeWidth={isActive ? 3 : 2.5}
                  className={[
                    "shrink-0 transition-all duration-200",
                    isActive ? "h-8 w-8 sm:h-9 sm:w-9" : "h-5 w-5 sm:h-6 sm:w-6",
                    isActive
                      ? "text-amber-700"
                      : item.accent
                      ? isHot
                        ? "text-amber-500"
                        : "text-amber-700"
                      : isHot
                      ? "text-slate-50"
                      : "text-slate-950/60",
                  ].join(" ")}
                />

                <span
                  className={[
                    "whitespace-nowrap text-center font-black leading-none tracking-tight transition-all duration-200",
                    isActive
                      ? "text-[10px] text-slate-50 sm:text-xs"
                      : "text-[9px] sm:text-[11px]",
                    isActive
                      ? ""
                      : item.accent
                      ? isHot
                        ? "text-amber-500"
                        : "text-amber-700"
                      : isHot
                      ? "text-slate-50"
                      : "text-slate-950/60",
                  ].join(" ")}
                >
                  {item.label}
                </span>

                {/* Underline sweep on hover (non-active only) */}
                {!isActive && (
                  <motion.span
                    initial={false}
                    animate={{ scaleX: isHot ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{ originX: 1 }}
                    className={`absolute bottom-0 right-0 left-0 h-[3px] ${
                      item.accent ? "bg-amber-700" : "bg-amber-700"
                    }`}
                  />
                )}
              </motion.a>
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.nav>
  );
}

/* ================================================================== */
/*  3. FLOATING MASCOT                                                 */
/* ================================================================== */
function FloatingMascot() {
  const { scrollY } = useScroll();
  const [facing, setFacing] = useState<1 | -1>(1);
  const [imgFailed, setImgFailed] = useState(false);
  const lastScroll = useRef(0);
  const jumpControls = useAnimationControls();
  const isJumping = useRef(false);

  /* --- B. Scroll direction tracker --- */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScroll.current;
    if (Math.abs(delta) < 2) return; // dead-zone kills jitter
    setFacing(delta > 0 ? 1 : -1);
    lastScroll.current = latest;
  });

  /* --- C. Tap → jump + rotate --- */
  const handleJump = useCallback(async () => {
    if (isJumping.current) return;
    isJumping.current = true;

    await jumpControls.start({
      y: [0, -40, -34, 0],
      rotate: [0, 10, -4, 0],
      scale: [1, 1.06, 0.96, 1],
      transition: {
        duration: 0.62,
        times: [0, 0.35, 0.62, 1],
        ease: [0.22, 1, 0.36, 1],
      },
    });

    isJumping.current = false;
  }, [jumpControls]);

  return (
    <motion.div
      initial={{ x: -140, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.6 }}
      className="fixed bottom-24 left-4 z-40 select-none"
    >
      {/* Layer 1: TAP JUMP (imperative controls) */}
      <motion.div animate={jumpControls} style={{ transformOrigin: "50% 100%" }}>
        {/* Layer 2: IDLE BOB (infinite loop, never interrupted) */}
        <motion.div
          animate={{ y: [0, -9, 0] }}
          transition={{
            duration: 1.15,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          {/* Layer 3: DIRECTION FLIP */}
          <motion.div
            animate={{ scaleX: facing }}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            {!imgFailed ? (
              <motion.img
                src="/mascot.png"
                alt="Mascot"
                draggable={false}
                onError={() => setImgFailed(true)}
                onTap={handleJump}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.92 }}
                className="w-32 h-auto cursor-pointer rounded-none"
                style={{
                  filter: "drop-shadow(5px 7px 0px rgba(2,6,23,0.28))",
                }}
              />
            ) : (
              /* Brutalist fallback block */
              <motion.button
                onTap={handleJump}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Mascot"
                className="grid h-32 w-32 place-items-center rounded-none border-4 border-slate-950 bg-amber-700 shadow-[6px_6px_0px_0px_#020617]"
              >
                <span className="text-5xl font-black text-slate-950">ב״ה</span>
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hard-edged ground shadow */}
      <motion.div
        animate={{ scaleX: [1, 0.82, 1], opacity: [0.22, 0.12, 0.22] }}
        transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mt-1 h-[6px] w-20 bg-slate-950"
      />
    </motion.div>
  );
}

/* ================================================================== */
/*  4. MAIN CONTENT (temporary scroll test rig)                        */
/* ================================================================== */
function MainContent() {
  return (
    <main
      id="home"
      className="relative min-h-[300vh] w-full bg-[#F8FAFC] pb-40"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(2,6,23,0.09) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(2,6,23,0.09) 1px, transparent 1px),
          linear-gradient(to right, rgba(2,6,23,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(2,6,23,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "120px 120px, 120px 120px, 24px 24px, 24px 24px",
      }}
    >
      {/* Top brutalist rule */}
      <div className="h-[10px] w-full border-b-4 border-slate-950 bg-amber-700" />

      <section className="px-5 pt-16 sm:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-6 inline-block rounded-none border-2 border-slate-950 bg-slate-50 px-3 py-1 text-[11px] font-black tracking-[0.25em] text-slate-950 shadow-[4px_4px_0px_0px_#020617]"
        >
          ב״ה · ישיבה · ירושלים
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            delay: 0.3,
          }}
          className="max-w-[18ch] text-[13vw] font-black leading-[0.85] tracking-tighter text-slate-950 sm:text-[9vw] lg:text-[7vw]"
        >
          גלוש למטה
          <br />
          <span className="text-amber-700">כדי לראות</span>
          <br />
          את הקסם
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.75, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 1 }}
          className="mt-10 h-[6px] w-full max-w-2xl bg-slate-950"
        />
      </section>

      {/* Scroll test markers */}
      <div className="mt-32 space-y-40 px-5 sm:px-10 lg:px-16">
        {[
          { n: "01", t: "בדוק את התנופה של הגלילה" },
          { n: "02", t: "גלול למעלה — המסקוט מתהפך" },
          { n: "03", t: "לחץ על המסקוט — הוא קופץ" },
        ].map((block, i) => (
          <motion.div
            key={block.n}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="flex flex-col gap-4 border-t-4 border-b-4 border-slate-950 bg-slate-50 p-6 shadow-[8px_8px_0px_0px_#020617] sm:flex-row sm:items-center sm:gap-8 sm:p-10"
          >
            <span className="text-6xl font-black leading-none text-amber-700 sm:text-8xl">
              {block.n}
            </span>
            <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
              {block.t}
            </h2>
          </motion.div>
        ))}
      </div>

      {/* Bottom sentinel */}
      <div className="mt-48 border-t-4 border-slate-950 bg-slate-950 px-5 py-16 sm:px-10 lg:px-16">
        <p className="text-3xl font-black tracking-tight text-slate-50 sm:text-5xl">
          סוף אזור הבדיקה <span className="text-amber-700">·</span> Shell Ready
        </p>
      </div>
    </main>
  );
}

/* ================================================================== */
/*  PAGE — APP SHELL                                                   */
/* ================================================================== */
export default function Page() {
  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen bg-[#F8FAFC] text-slate-950 antialiased selection:bg-amber-700 selection:text-slate-50"
    >
      <SmoothScrollProvider>
        <MainContent />
      </SmoothScrollProvider>

      <FloatingMascot />
      <BottomDock />
    </div>
  );
}
```

---

## Engineering Notes

### `SmoothScrollProvider` — the "heavy glide"
This is a **transform-based lerp** (the same technique Locomotive/Lenis use), implemented purely in Framer Motion:

- A hidden **spacer div** matches the content height, so the native scrollbar, `useScroll()`, and `#anchor` links all keep working — nothing is faked away.
- Content lives in a `fixed inset-0` stage and is translated by a `useSpring` that **lags** the raw `window.scrollY`.
- Tuning: `stiffness: 90, damping: 26, mass: 0.9` → critically damped, no overshoot wobble, but a distinctly weighty settle. Raise `mass` to `1.4` for even more inertia; raise `stiffness` to `180` to tighten it up.
- `ResizeObserver` keeps the spacer accurate when content reflows (fonts loading, images, accordions).
- **A11y:** `prefers-reduced-motion` short-circuits the spring via `smoothY.jump()`, giving instant 1:1 scroll.

### `BottomDock`
- Array order is **visual right→left** because the `<nav>` inherits `dir="rtl"` — no `flex-row-reverse` hack needed, which keeps keyboard tab order matching visual order.
- **Two-stage entrance:** the bar itself springs up first (`delay: 0.15`), then `staggerChildren: 0.08` pops each item — reads as one intentional gesture rather than five random ones.
- Active "בית" item gets: `h-9 w-9` icon vs `h-6 w-6`, a solid `bg-slate-950` plate with a `shadow-[4px_4px_0px_0px_#B45309]` gold offset, and a **6px gold accent bar** bleeding over the top border via `layoutId` — so when you wire up real routing, the mark will physically slide between items.
- `whileTap={{ scale: 0.85 }}` + `whileHover={{ y: -6 }}` on a stiff spring (`500/18`) gives that snappy tactile "click."
- Shop link carries `target="_blank"` + `rel="noopener noreferrer"` and is locked to `text-amber-700`.
- `pb-[max(0.5rem,env(safe-area-inset-bottom))]` prevents the iPhone home-bar from eating the labels.

### `FloatingMascot` — the 3-layer transform stack
This is the critical architectural decision. Bobbing, flipping, and jumping all write to `transform`, so putting them on one element makes them **fight and cancel out**. Solution — three nested wrappers, each owning exactly one property:

| Layer | Owns | Driver |
|---|---|---|
| Outer | `y`, `rotate`, `scale` (jump) | `useAnimationControls()` — imperative |
| Middle | `y` (idle bob) | Infinite declarative loop |
| Inner | `scaleX` (facing) | `useState` from scroll delta |

- **Direction flip** uses a `Math.abs(delta) < 2` dead-zone; without it, sub-pixel scroll noise makes the mascot strobe.
- **Jump** is guarded by an `isJumping` ref so mashing the mascot can't stack keyframes into a broken pose. `transformOrigin: "50% 100%"` makes it pivot from the feet, so the 10° tilt looks like a real leap instead of a spin.
- **Ground shadow** is a hard-edged `6px` slab that squashes in sync with the bob (same `1.15s` duration) — sells the weight, stays brutalist (zero blur).
- Graceful fallback: if `/mascot.png` 404s, `onError` swaps in a bordered gold `ב״ה` block with a hard shadow, and it stays fully interactive.

### Z-index ladder
`BottomDock` at `z-50` → `FloatingMascot` at `z-40` → content below. The mascot at `bottom-24` sits just above the dock without ever overlapping the tap targets.

**Ready for Part 2** — drop your content sections inside `<MainContent>` (or replace it entirely) and the shell will handle the rest. One thing to flag ahead of time: because content is inside a `fixed` stage, any `position: sticky` children won't work — for Part 2's sticky/pinned sections, tell me and I'll swap in a scroll-progress-driven pinning approach instead.    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-center pointer-events-none select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-3 bg-slate-50 border-4 border-slate-950 px-4 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative"
          >
            <p className="text-slate-950 font-bold text-sm whitespace-nowrap">
              המקום שלך לגדול. בוא נדבר.
            </p>
            {/* Little triangle pointer */}
            <div className="absolute -bottom-[14px] left-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-slate-950" />
            <div className="absolute -bottom-[9px] left-[34px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-slate-50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot with bobbing (walking) animation */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        style={{
          filter: "drop-shadow(4px 6px 0px rgba(0,0,0,0.4))",
        }}
      >
        <motion.div
          animate={{ scaleX: direction === "down" ? 1 : -1 }}
          transition={{ duration: 0.3 }}
        >
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/mascot.png"
              alt="מסקוט הישיבה"
              className="w-20 h-20 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-20 h-20 bg-slate-950 border-4 border-amber-700 flex items-center justify-center">
              <User className="w-10 h-10 text-amber-700" strokeWidth={2.5} />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KINETIC MARQUEE                                                    */
/* ------------------------------------------------------------------ */
function KineticMarquee() {
  const text = "ללמוד בלב ירושלים – ולהשפיע על לב ירושלים • ";
  const repeated = text.repeat(8);

  return (
    <div className="w-full overflow-hidden bg-slate-950 border-y-4 border-slate-950 py-6">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <span className="text-3xl md:text-5xl font-black text-slate-50 px-4 tracking-tight">
          {repeated}
        </span>
        <span className="text-3xl md:text-5xl font-black text-slate-50 px-4 tracking-tight">
          {repeated}
        </span>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCROLL TRIGGERED TYPOGRAPHY                                        */
/* ------------------------------------------------------------------ */
function ScrollTypography() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.2"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section
      ref={ref}
      className="min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-16 py-32 bg-slate-50"
    >
      <motion.h2
        style={{ opacity, y }}
        className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-950 text-center leading-tight max-w-5xl"
      >
        לא כל בחור צריך להשתלב באותה תבנית.
      </motion.h2>
      <motion.p
        style={{ opacity, y }}
        className="mt-8 text-lg md:text-2xl text-slate-700 text-center max-w-3xl font-medium"
      >
        כל בחור מגיע עם הרקע, היכולות והצרכים שלו, ולכן המטרה היא להתאים עבורו
        את הדרך שתאפשר לו להתקדם בצורה הטובה ביותר.
      </motion.p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  BRUTALIST BENTO GRID — 4 TRACKS                                    */
/* ------------------------------------------------------------------ */
const tracks = [
  {
    title: "המסלול הלימודי המלא – שנתיים",
    desc: "לימוד תורה וחסידות, עבודת ה', סדר יום ישיבתי, ליווי אישי והכנה מעשית ורוחנית להמשך החיים.",
  },
  {
    title: "מסלול חצי יום לימוד וחצי יום עבודה – שלוש שנים",
    desc: "שילוב בין עבודה לבין מסגרת ישיבתית. שילוב נכון בין גשמיות לרוחניות.",
  },
  {
    title: "המסלול האקסטרני",
    desc: "לבחורים שמעוניינים ללמוד בישיבה אך להמשיך להתגורר בבית. חברותות קבועות והשתתפות בחיי החברה והאווירה החסידית.",
  },
  {
    title: "מסלול השלוחים",
    desc: "בחורים למדנים שהגיעו מ־770. עיקר תפקידם בישיבה הוא הליווי האישי והלימוד עם הבחורים.",
  },
];

function SharpGrid() {
  return (
    <section className="px-6 md:px-16 py-32 bg-slate-50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-black text-slate-950 mb-16 text-center"
      >
        המסלולים בישיבה
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-4 border-slate-950">
        {tracks.map((track, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              backgroundColor: "#020617",
            }}
            className={`group p-8 md:p-12 border-slate-950 flex flex-col justify-between min-h-[280px] transition-colors duration-300
              ${i % 2 === 0 ? "md:border-l-4" : ""}
              ${i < 2 ? "border-b-4" : ""}
            `}
          >
            <div>
              <span className="text-amber-700 font-black text-5xl block mb-4 group-hover:text-amber-500 transition-colors">
                0{i + 1}
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-slate-950 group-hover:text-slate-50 mb-4 transition-colors">
                {track.title}
              </h3>
              <p className="text-slate-700 group-hover:text-slate-300 font-medium leading-relaxed transition-colors">
                {track.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  BRUTALIST FAQ ACCORDION                                            */
/* ------------------------------------------------------------------ */
const faqs = [
  {
    q: "הקמפוס והפנימייה",
    a: "פנימייה מרווחת. החדרים ממוזגים, ולכל בחור יש מיטה אישית וארון אישי. בתוך הקמפוס נמצא מקווה טהרה חדש ומשופץ.",
  },
  {
    q: "שלוש ארוחות ביום",
    a: "בישיבה יש טבח צמוד העובד במקום, והארוחות מוכנות עבור הבחורים באופן מסודר.",
  },
  {
    q: "החיים החסידיים בישיבה",
    a: "לימוד חסידות, התוועדויות, שבתות משותפות, קשר עם משפיעים, וחיים עם ענייני גאולה ומשיח.",
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="px-6 md:px-16 py-32 bg-slate-50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-5xl font-black text-slate-950 mb-16 text-center"
      >
        שאלות ותשובות
      </motion.h2>
      <div className="max-w-4xl mx-auto border-4 border-slate-950">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`border-slate-950 ${
                i !== faqs.length - 1 ? "border-b-4" : ""
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-6 p-6 md:p-8 text-right bg-slate-50 hover:bg-slate-950 group transition-colors duration-300"
              >
                <span className="text-xl md:text-3xl font-black text-slate-950 group-hover:text-slate-50 transition-colors">
                  {faq.q}
                </span>
                <span className="shrink-0 w-10 h-10 md:w-12 md:h-12 border-4 border-slate-950 group-hover:border-amber-700 flex items-center justify-center bg-amber-700 group-hover:bg-slate-50 transition-colors">
                  {isOpen ? (
                    <Minus
                      className="w-5 h-5 md:w-6 md:h-6 text-slate-50 group-hover:text-slate-950"
                      strokeWidth={3}
                    />
                  ) : (
                    <Plus
                      className="w-5 h-5 md:w-6 md:h-6 text-slate-50 group-hover:text-slate-950"
                      strokeWidth={3}
                    />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden bg-slate-950"
                  >
                    <div className="p-6 md:p-8 border-t-4 border-amber-700">
                      <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FOOTER FORM                                                        */
/* ------------------------------------------------------------------ */
function FooterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    track: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to your API / Google Sheet / CRM
    console.log("FORM SUBMIT:", form);
    setSubmitted(true);
  };

  const fields = [
    { name: "name", label: "שם מלא", type: "text" },
    { name: "age", label: "גיל", type: "text" },
    { name: "phone", label: "מספר טלפון", type: "tel" },
    { name: "track", label: "המסלול שמעניין אותך", type: "text" },
  ];

  return (
    <footer
      id="contact"
      className="bg-slate-950 px-6 md:px-16 py-32 border-t-4 border-slate-950"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-50 leading-tight mb-4"
        >
          המקום שלך לגדול,
          <br />
          <span className="text-amber-700">להתקדם ולבנות</span>
          <br />
          את העתיד שלך.
        </motion.h2>

        <div className="w-32 h-2 bg-amber-700 my-12" />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10"
            >
              {fields.map((field, i) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative group"
                >
                  <label
                    htmlFor={field.name}
                    className="block text-amber-700 text-sm font-black tracking-widest uppercase mb-3"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    className="w-full bg-transparent rounded-none border-0 border-b-4 border-slate-700 focus:border-amber-700 text-slate-50 text-xl md:text-2xl font-bold py-3 outline-none transition-colors duration-300 placeholder:text-slate-700"
                    placeholder="..."
                  />
                </motion.div>
              ))}

              <div className="md:col-span-2 pt-6">
                <motion.button
                  type="submit"
                  whileHover={{ x: -6, y: -6 }}
                  whileTap={{ x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="group inline-flex items-center gap-4 bg-amber-700 text-slate-950 rounded-none border-4 border-amber-700 px-10 py-5 text-xl md:text-2xl font-black shadow-[8px_8px_0px_0px_#f8fafc] hover:bg-slate-50 hover:border-slate-50 transition-colors duration-200"
                >
                  <span>[ שליחת פרטים ]</span>
                  <ArrowLeft
                    className="w-6 h-6 group-hover:-translate-x-2 transition-transform"
                    strokeWidth={3}
                  />
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border-4 border-amber-700 p-10 md:p-16"
            >
              <h3 className="text-3xl md:text-5xl font-black text-slate-50 mb-4">
                הפרטים נשלחו בהצלחה!
              </h3>
              <p className="text-slate-400 text-lg md:text-xl font-medium">
                ניצור איתך קשר בהקדם. תודה שפנית אלינו.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-32 pt-10 border-t-4 border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 font-bold text-sm tracking-wide">
            ישיבה בלב ירושלים © {new Date().getFullYear()}
          </p>
          <p className="text-amber-700 font-black text-sm tracking-wide text-center">
            יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד!
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  HERO                                                               */
/* ------------------------------------------------------------------ */
function BrutalHero() {
  const scrollToForm = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative h-screen min-h-[700px] w-full bg-slate-50 flex flex-col justify-between overflow-hidden border-b-4 border-slate-950">
      {/* Decorative brutalist grid lines */}
      <div className="pointer-events-none absolute inset-0 hidden md:grid grid-cols-4">
        <div className="border-l-2 border-slate-950/5" />
        <div className="border-l-2 border-slate-950/5" />
        <div className="border-l-2 border-slate-950/5" />
        <div className="border-l-2 border-slate-950/5" />
      </div>

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full border-b-2 border-slate-950 py-3 px-6 md:px-16"
      >
        <p className="text-xs md:text-sm font-black tracking-widest text-slate-950 text-center">
          יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד!
        </p>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-16"
      >
        <motion.div variants={item} className="overflow-hidden">
          <h1 className="text-[15vw] md:text-[11vw] lg:text-[9.5vw] leading-[0.85] font-black text-slate-950 tracking-tighter">
            העתיד שלך
            <br />
            <span className="text-amber-700">מתחיל כאן</span>
          </h1>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 md:mt-14 max-w-2xl border-r-4 border-amber-700 pr-6"
        >
          <p className="text-lg md:text-2xl text-slate-700 font-bold leading-relaxed">
            מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים.
            <br className="hidden md:block" /> בלב ירושלים.
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-12">
          <motion.button
            onClick={scrollToForm}
            whileHover={{ x: -6, y: -6 }}
            whileTap={{ x: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-3 bg-slate-950 text-slate-50 rounded-none border-4 border-slate-950 px-8 md:px-10 py-4 md:py-5 text-lg md:text-2xl font-black shadow-[8px_8px_0px_0px_#b45309] hover:bg-amber-700 hover:border-amber-700 hover:text-slate-950 transition-colors duration-200"
          >
            [ להרשמה לישיבה ]
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom meta bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="relative z-10 w-full border-t-2 border-slate-950 py-4 px-6 md:px-16 flex items-center justify-between"
      >
        <span className="text-xs md:text-sm font-black tracking-widest text-slate-950">
          ירושלים · ישיבה חסידית
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs md:text-sm font-black tracking-widest text-amber-700"
        >
          גלול למטה ↓
        </motion.span>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */
export default function Page() {
  return (
    <main
      dir="rtl"
      className="bg-slate-50 text-slate-950 antialiased selection:bg-amber-700 selection:text-slate-50"
    >
      <BrutalHero />
      <KineticMarquee />
      <ScrollTypography />
      <SharpGrid />
      <KineticMarquee />
      <FAQAccordion />
      <FooterForm />
      <FloatingMascot />
    </main>
  );
                        }
