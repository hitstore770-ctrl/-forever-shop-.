```tsx
"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
  useTransform,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import {
  MapPin,
  Home,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Plus,
  ArrowLeft,
  Send,
  Check,
  Play,
  type LucideIcon,
} from "lucide-react";

/* ==================================================================
   FONTS
   Add to app/layout.tsx <head> (or use next/font):

   <link
     href="https://fonts.googleapis.com/css2?family=Bona+Nova+SC:wght@400;700&family=Assistant:wght@300;400;600;700;800&display=swap"
     rel="stylesheet"
   />
================================================================== */

const FONT_HEAD = "'Bona Nova SC', 'Bona Nova', serif";
const FONT_BODY = "'Assistant', 'Heebo', system-ui, sans-serif";

/* Gold system — replaces all navy / brown / red */
const GOLD = {
  light: "#F3DFA6",
  base: "#D4AF37",
  deep: "#B8912B",
  dark: "#8A6B1F",
  ink: "#3B2F14", // warm dark for text, never navy
};

const GOLD_GRADIENT = "linear-gradient(135deg, #F3DFA6 0%, #D4AF37 45%, #B8912B 100%)";
const GOLD_GRADIENT_SOFT = "linear-gradient(135deg, #FBF3DC 0%, #F3DFA6 100%)";

/* Gentle shared easing + timing */
const EASE = [0.22, 0.61, 0.36, 1] as const;
const SOFT = { duration: 1.1, ease: EASE };
const SOFT_SLOW = { duration: 1.4, ease: EASE };

/* ==================================================================
   SMOOTH SCROLL — light-touch, never blocks fast scrolling
================================================================== */
function useNegative(mv: ReturnType<typeof useSpring>) {
  const out = useMotionValue(0);
  useMotionValueEvent(mv, "change", (v) => out.set(-v));
  return out;
}

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);

  const rawY = useMotionValue(0);
  // Much lighter than before: high stiffness, low mass = responsive, no drag
  const smoothY = useSpring(rawY, {
    stiffness: 260,
    damping: 40,
    mass: 0.35,
    restDelta: 0.5,
  });
  const translateY = useNegative(smoothY);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    // Disable transform-scroll on touch + reduced-motion → native, zero friction
    setEnabled(!reduced && !touch);
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        rawY.set(window.scrollY);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, rawY]);

  if (!enabled) return <>{children}</>;

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <motion.div ref={contentRef} style={{ y: translateY, willChange: "transform" }}>
          {children}
        </motion.div>
      </div>
      <div style={{ height }} aria-hidden="true" />
    </>
  );
}

/* ==================================================================
   ACTIVE SECTION TRACKER (drives ambient elements)
================================================================== */
type SectionKey = "hero" | "tracks" | "faq" | "form";

function useActiveSection(): SectionKey {
  const [active, setActive] = useState<SectionKey>("hero");
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next: SectionKey =
      p < 0.24 ? "hero" : p < 0.55 ? "tracks" : p < 0.8 ? "faq" : "form";
    setActive((prev) => (prev === next ? prev : next));
  });

  return active;
}

/* ==================================================================
   AMBIENT FLOATERS — subtle, section-aware, zero clutter
================================================================== */
const AMBIENT: Record<SectionKey, string[]> = {
  hero: ["✦", "✧", "◆"],
  tracks: ["✧", "✦", "❖"],
  faq: ["◇", "✦", "✧"],
  form: ["✦", "❖", "✧"],
};

const FLOAT_POS = [
  { top: "14%", right: "7%", size: 30, dur: 15 },
  { top: "42%", left: "6%", size: 20, dur: 19 },
  { top: "72%", right: "13%", size: 24, dur: 17 },
];

function AmbientFloaters({ section }: { section: SectionKey }) {
  const glyphs = AMBIENT[section];
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="wait">
        <motion.div key={section} className="absolute inset-0">
          {FLOAT_POS.map((p, i) => (
            <motion.span
              key={section + "-" + i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 0.2,
                scale: 1,
                y: [0, -18, 0],
                x: [0, i % 2 ? 9 : -9, 0],
              }}
              exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE } }}
              transition={{
                opacity: { duration: 1.6, ease: EASE },
                scale: { duration: 1.6, ease: EASE },
                y: { duration: p.dur, repeat: Infinity, ease: "easeInOut" },
                x: { duration: p.dur * 1.3, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                position: "absolute",
                top: p.top,
                left: (p as any).left,
                right: (p as any).right,
                fontSize: p.size,
                color: GOLD.base,
              }}
            >
              {glyphs[i % glyphs.length]}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ==================================================================
   TOP HEADER — stacked logo lockup
================================================================== */
function TopHeader() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SOFT, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className="transition-all duration-700"
        style={{
          background: solid ? "rgba(255,254,250,0.82)" : "rgba(255,254,250,0)",
          backdropFilter: solid ? "blur(18px) saturate(150%)" : "none",
          borderBottom: solid ? `1px solid ${GOLD.base}33` : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-9">
          {/* Logo lockup */}
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center sm:h-14 sm:w-14"
              style={{ background: GOLD_GRADIENT, boxShadow: `0 6px 20px ${GOLD.base}40` }}
            >
              <span
                className="text-xl text-white sm:text-2xl"
                style={{ fontFamily: FONT_HEAD }}
              >
                מ
              </span>
            </div>

            {/* Stacked, line by line */}
            <div
              className="flex flex-col leading-[0.94]"
              style={{ fontFamily: FONT_HEAD, color: GOLD.ink }}
            >
              {["ישיבת", "המלך", "המשיח"].map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.09 }}
                  className="text-[15px] tracking-tight sm:text-lg"
                  style={i === 2 ? { color: GOLD.deep } : undefined}
                >
                  {line}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.a
            href="#form"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="hidden px-6 py-2.5 text-sm text-white sm:block"
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 700,
              background: GOLD_GRADIENT,
              boxShadow: `0 6px 22px ${GOLD.base}45`,
            }}
          >
            הרשמה
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}

/* ==================================================================
   BOTTOM DOCK — 4 items
================================================================== */
type DockItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
  external?: boolean;
};

const DOCK_ITEMS: DockItem[] = [
  { label: "מה קורה פה", icon: MapPin, href: "#tracks" },
  { label: "בית", icon: Home, href: "#hero", active: true },
  { label: "ייעוץ", icon: MessageCircle, href: "#form" },
  {
    label: "חנות",
    icon: ShoppingBag,
    href: "https://swiwgi-zu.myshopify.com/",
    external: true,
  },
];

function BottomDock() {
  const [hot, setHot] = useState<number | null>(null);

  return (
    <motion.nav
      dir="rtl"
      aria-label="ניווט ראשי"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SOFT_SLOW, delay: 0.35 }}
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        background: "rgba(255,254,250,0.86)",
        backdropFilter: "blur(22px) saturate(160%)",
        borderTop: `1px solid ${GOLD.base}33`,
        boxShadow: "0 -8px 34px rgba(59,47,20,0.07)",
      }}
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 sm:gap-3 sm:px-8">
        {DOCK_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const on = !!item.active;
          const lit = hot === i;

          return (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.07 }}
              className="flex-1"
            >
              <motion.a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-current={on ? "page" : undefined}
                onHoverStart={() => setHot(i)}
                onHoverEnd={() => setHot(null)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="relative flex flex-col items-center gap-1.5 px-1 py-2 outline-none"
              >
                {on && (
                  <motion.span
                    layoutId="dock-mark"
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute -top-2.5 h-[2px] w-8"
                    style={{ background: GOLD_GRADIENT }}
                  />
                )}

                <div
                  className="grid place-items-center transition-all duration-500"
                  style={{
                    width: on ? 40 : 34,
                    height: on ? 40 : 34,
                    background: on ? GOLD_GRADIENT : lit ? `${GOLD.base}18` : "transparent",
                    boxShadow: on ? `0 6px 18px ${GOLD.base}45` : "none",
                  }}
                >
                  <Icon
                    strokeWidth={on ? 2.2 : 1.8}
                    style={{ color: on ? "#fff" : lit ? GOLD.deep : `${GOLD.ink}80` }}
                    className="transition-all duration-500"
                    width={on ? 21 : 19}
                    height={on ? 21 : 19}
                  />
                </div>

                <span
                  className="whitespace-nowrap text-[10px] transition-colors duration-500 sm:text-[11px]"
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: on ? 700 : 500,
                    color: on ? GOLD.deep : lit ? GOLD.deep : `${GOLD.ink}70`,
                  }}
                >
                  {item.label}
                </span>
              </motion.a>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
}

/* ==================================================================
   FLOATING WHATSAPP — follows scroll, docks above the menu
================================================================== */
function FloatingWhatsApp() {
  const { scrollY } = useScroll();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setReady(y > 180));

  const y = useSpring(0, { stiffness: 90, damping: 22, mass: 0.5 });
  useMotionValueEvent(scrollY, "change", () => y.set(0));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.9 }}
      transition={{ ...SOFT, delay: ready ? 0 : 0 }}
      style={{ y, pointerEvents: ready ? "auto" : "none" }}
      className="fixed bottom-[86px] left-4 z-40 flex items-center gap-2.5 sm:bottom-[92px] sm:left-7"
    >
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="hidden px-3.5 py-2 text-xs sm:block"
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 600,
              color: GOLD.ink,
              background: "rgba(255,254,250,0.92)",
              backdropFilter: "blur(14px)",
              border: `1px solid ${GOLD.base}40`,
              boxShadow: "0 8px 26px rgba(59,47,20,0.09)",
            }}
          >
            נדבר? אנחנו כאן
          </motion.span>
        )}
      </AnimatePresence>

      <motion.a
        href="https://wa.me/972500000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="שיחה בוואטסאפ"
        onHoverStart={() => setOpen(true)}
        onHoverEnd={() => setOpen(false)}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative grid h-[52px] w-[52px] place-items-center sm:h-14 sm:w-14"
        style={{ background: GOLD_GRADIENT, boxShadow: `0 10px 30px ${GOLD.base}55` }}
      >
        {/* soft breathing halo */}
        <motion.span
          animate={{ scale: [1, 1.28, 1], opacity: [0.32, 0, 0.32] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ border: `1px solid ${GOLD.base}` }}
        />
        <svg viewBox="0 0 24 24" fill="#fff" className="h-6 w-6 sm:h-7 sm:w-7">
          <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.06 4.49.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
        </svg>
      </motion.a>
    </motion.div>
  );
}

/* ==================================================================
   SHARED — gentle reveal
================================================================== */
function Reveal({
  children,
  delay = 0,
  y = 14,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GoldRule({ delay = 0, w = "100%" }: { delay?: number; w?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: EASE, delay }}
      style={{ originX: 1, width: w, height: 1, background: GOLD_GRADIENT }}
    />
  );
}

function SectionLabel({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal>
        <span
          className="text-[11px] tracking-[0.32em]"
          style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.deep }}
        >
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          className="mt-3 text-[30px] leading-[1.14] sm:text-5xl lg:text-[56px]"
          style={{ fontFamily: FONT_HEAD, color: GOLD.ink }}
        >
          {title}
        </h2>
      </Reveal>
      <div className="mt-6">
        <GoldRule delay={0.2} w="88px" />
      </div>
    </div>
  );
}

/* ==================================================================
   VERTICAL VIDEO 9:16 — CMS-ready
================================================================== */
type WeeklyVideo = {
  src?: string;
  poster?: string;
  caption?: string;
};

function VerticalVideo({ video }: { video?: WeeklyVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
      className="relative mx-auto w-full max-w-[240px] sm:max-w-[268px]"
    >
      {/* soft gold glow */}
      <div
        className="pointer-events-none absolute -inset-3 blur-2xl"
        style={{ background: `${GOLD.base}22` }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "9 / 16",
          border: `1px solid ${GOLD.base}4D`,
          background: GOLD_GRADIENT_SOFT,
          boxShadow: "0 22px 60px rgba(59,47,20,0.14)",
        }}
      >
        {video?.src ? (
          <video
            ref={ref}
            src={video.src}
            poster={video.poster}
            playsInline
            muted
            loop
            onClick={toggle}
            className="h-full w-full cursor-pointer object-cover"
          />
        ) : (
          <button
            onClick={toggle}
            className="flex h-full w-full flex-col items-center justify-center gap-4"
            style={{ background: GOLD_GRADIENT_SOFT }}
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              className="grid h-14 w-14 place-items-center"
              style={{ background: GOLD_GRADIENT, boxShadow: `0 8px 24px ${GOLD.base}55` }}
            >
              <Play fill="#fff" strokeWidth={0} className="h-5 w-5 translate-x-[1px]" />
            </motion.span>
            <span
              className="px-6 text-center text-[11px] leading-relaxed"
              style={{ fontFamily: FONT_BODY, fontWeight: 600, color: GOLD.dark }}
            >
              העדכון השבועי
            </span>
          </button>
        )}

        {/* Live chip */}
        <div
          className="absolute right-3 top-3 flex items-center gap-1.5 px-2.5 py-1"
          style={{
            background: "rgba(255,254,250,0.9)",
            backdropFilter: "blur(10px)",
            border: `1px solid ${GOLD.base}40`,
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5"
            style={{ background: GOLD.base }}
          />
          <span
            className="text-[9px] tracking-[0.16em]"
            style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.deep }}
          >
            השבוע
          </span>
        </div>
      </div>

      <p
        className="mt-3 text-center text-[11px]"
        style={{ fontFamily: FONT_BODY, color: `${GOLD.ink}80` }}
      >
        {video?.caption ?? "מתעדכן כל שבוע"}
      </p>
    </motion.div>
  );
}

/* ==================================================================
   HERO — no blur, gentle fade, video beside headline
================================================================== */
function HeroSection({ video }: { video?: WeeklyVideo }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // gentle only — no scale punch, no blur
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const words = "העתיד שלך מתחיל כאן".split(" ");

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-[100svh] items-center px-5 pb-36 pt-28 sm:px-10 sm:pt-32 lg:px-16"
    >
      <motion.div style={{ opacity, y }} className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
              className="mb-7 inline-flex items-center gap-2.5 px-4 py-2"
              style={{
                background: "rgba(255,254,250,0.7)",
                backdropFilter: "blur(14px)",
                border: `1px solid ${GOLD.base}3D`,
              }}
            >
              <span className="h-1 w-1" style={{ background: GOLD.base }} />
              <span
                className="text-[10px] tracking-[0.2em] sm:text-[11px]"
                style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.deep }}
              >
                שנת הלימודים ה'תשפ״ז · ירושלים
              </span>
            </motion.div>

            <h1
              className="text-[13vw] leading-[0.98] sm:text-[68px] lg:text-[82px]"
              style={{ fontFamily: FONT_HEAD, color: GOLD.ink }}
            >
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.28 + i * 0.1 }}
                  className="inline-block"
                  style={
                    i >= 2
                      ? {
                          background: GOLD_GRADIENT,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }
                      : undefined
                  }
                >
                  {w}&nbsp;
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: EASE, delay: 0.7 }}
              style={{
                originX: 1,
                height: 1,
                width: "72%",
                maxWidth: 420,
                background: GOLD_GRADIENT,
                margin: "28px 0",
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.8 }}
              className="max-w-[42ch] text-base leading-[1.85] sm:text-lg"
              style={{ fontFamily: FONT_BODY, fontWeight: 400, color: `${GOLD.ink}B3` }}
            >
              מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים. בלב ירושלים.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.95 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <motion.a
                href="#form"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="group inline-flex items-center gap-3 px-8 py-4 text-white sm:px-10"
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 700,
                  fontSize: 16,
                  background: GOLD_GRADIENT,
                  boxShadow: `0 12px 34px ${GOLD.base}4D`,
                }}
              >
                להרשמה לישיבה
                <ArrowLeft
                  strokeWidth={2.2}
                  className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
                />
              </motion.a>

              <motion.a
                href="#tracks"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="inline-flex items-center gap-2 px-7 py-4"
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  fontSize: 15,
                  color: GOLD.deep,
                  background: "rgba(255,254,250,0.6)",
                  backdropFilter: "blur(14px)",
                  border: `1px solid ${GOLD.base}3D`,
                }}
              >
                המסלולים
              </motion.a>
            </motion.div>
          </div>

          {/* Video */}
          <VerticalVideo video={video} />
        </div>
      </motion.div>
    </section>
  );
}

/* ==================================================================
   MARQUEES — slow, quiet
================================================================== */
function MarqueeBand({
  text,
  reverse = false,
  duration = 44,
  filled = false,
}: {
  text: string;
  reverse?: boolean;
  duration?: number;
  filled?: boolean;
}) {
  const line = text.repeat(6);
  return (
    <div
      className="w-full overflow-hidden py-4 sm:py-5"
      style={{
        background: filled ? GOLD_GRADIENT : "transparent",
        borderTop: `1px solid ${GOLD.base}30`,
        borderBottom: `1px solid ${GOLD.base}30`,
      }}
    >
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((k) => (
          <span
            key={k}
            className="px-2 text-lg sm:text-2xl lg:text-[28px]"
            style={{
              fontFamily: FONT_HEAD,
              color: filled ? "#fff" : GOLD.deep,
              opacity: filled ? 0.95 : 0.55,
            }}
          >
            {line}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ScrollMarquees() {
  return (
    <div className="relative z-10">
      <MarqueeBand text="ללמוד בלב ירושלים – ולהשפיע על לב ירושלים · " duration={52} />
      <MarqueeBand
        text="מסלול אישי · ליווי חסידי · הכנה לחיים · "
        reverse
        duration={44}
        filled
      />
    </div>
  );
}

/* ==================================================================
   TRACK CARDS — glassmorphism, soft shadow, no 3D tilt
================================================================== */
type Track = { num: string; title: string; body: string };

const TRACKS: Track[] = [
  {
    num: "01",
    title: "המסלול הלימודי המלא – שנתיים",
    body: "לימוד תורה וחסידות, עבודת ה', סדר יום ישיבתי, ליווי אישי והכנה מעשית ורוחנית להמשך החיים.",
  },
  {
    num: "02",
    title: "חצי יום לימוד וחצי יום עבודה – 3 שנים",
    body: "שילוב בין עבודה למסגרת ישיבתית. שילוב בין גשמיות לרוחניות.",
  },
  {
    num: "03",
    title: "המסלול האקסטרני",
    body: "לבחורים שמעוניינים ללמוד בישיבה אך להמשיך להתגורר בבית. חברותות קבועות והשתתפות בחיי החברה.",
  },
  {
    num: "04",
    title: "מסלול השלוחים",
    body: "בחורים למדנים שהגיעו מ־770. ליווי אישי ולימוד עם הבחורים.",
  },
];

function TrackCard({ track, i }: { track: Track; i: number }) {
  const [hot, setHot] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: EASE, delay: (i % 2) * 0.08 }}
      onHoverStart={() => setHot(true)}
      onHoverEnd={() => setHot(false)}
      whileHover={{ y: -5 }}
      className="group relative h-full overflow-hidden p-7 sm:p-9"
      style={{
        background: hot ? "rgba(255,254,250,0.9)" : "rgba(255,254,250,0.62)",
        backdropFilter: "blur(20px) saturate(150%)",
        border: `1px solid ${hot ? GOLD.base + "66" : GOLD.base + "2E"}`,
        boxShadow: hot
          ? "0 22px 56px rgba(59,47,20,0.12)"
          : "0 8px 26px rgba(59,47,20,0.05)",
        transition: "background 0.7s ease, border-color 0.7s ease, box-shadow 0.7s ease",
      }}
    >
      {/* top gold sweep */}
      <motion.div
        animate={{ scaleX: hot ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: GOLD_GRADIENT, originX: 1 }}
      />

      <div className="flex items-start justify-between gap-4">
        <span
          className="text-[38px] leading-none sm:text-[46px]"
          style={{
            fontFamily: FONT_HEAD,
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {track.num}
        </span>
        <motion.span
          animate={{ width: hot ? 40 : 22, opacity: hot ? 1 : 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-4 h-[1px] shrink-0"
          style={{ background: GOLD_GRADIENT }}
        />
      </div>

      <h3
        className="mt-6 text-[21px] leading-[1.28] sm:text-[26px]"
        style={{ fontFamily: FONT_HEAD, color: GOLD.ink }}
      >
        {track.title}
      </h3>

      <p
        className="mt-4 text-[14px] leading-[1.9] sm:text-[15px]"
        style={{ fontFamily: FONT_BODY, fontWeight: 400, color: `${GOLD.ink}A6` }}
      >
        {track.body}
      </p>
    </motion.div>
  );
}

function TracksSection() {
  return (
    <section id="tracks" className="relative z-10 px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionLabel kicker="המסלולים" title="דרך אישית לכל בחור" />
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          {TRACKS.map((t, i) => (
            <TrackCard key={t.num} track={t} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FAQ — gentle, glass panel
================================================================== */
const FAQS = [
  {
    q: "הקמפוס והפנימייה",
    a: "פנימייה מרווחת, חדרים ממוזגים, מיטה וארון אישי. מקווה טהרה משופץ בקמפוס.",
  },
  { q: "שלוש ארוחות ביום", a: "טבח צמוד במקום. ארוחות מוגשות באופן מסודר." },
  {
    q: "החיים החסידיים",
    a: "לימוד חסידות, התוועדויות, שבתות משותפות וקשר עם משפיעים.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 px-5 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <SectionLabel kicker="שאלות ותשובות" title="מה שחשוב לדעת" />

        <div
          style={{
            background: "rgba(255,254,250,0.62)",
            backdropFilter: "blur(20px) saturate(150%)",
            border: `1px solid ${GOLD.base}2E`,
            boxShadow: "0 12px 40px rgba(59,47,20,0.06)",
          }}
        >
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, ease: EASE, delay: i * 0.06 }}
                style={{
                  borderBottom:
                    i !== FAQS.length - 1 ? `1px solid ${GOLD.base}24` : "none",
                }}
              >
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-5 px-6 py-6 text-right outline-none transition-colors duration-500 sm:px-9 sm:py-7"
                  style={{ background: on ? `${GOLD.light}2E` : "transparent" }}
                >
                  <span
                    className="text-[19px] leading-tight sm:text-[25px]"
                    style={{ fontFamily: FONT_HEAD, color: on ? GOLD.deep : GOLD.ink }}
                  >
                    {f.q}
                  </span>

                  <motion.span
                    animate={{ rotate: on ? 45 : 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="grid h-9 w-9 shrink-0 place-items-center"
                    style={{
                      background: on ? GOLD_GRADIENT : `${GOLD.base}14`,
                      border: `1px solid ${GOLD.base}${on ? "00" : "33"}`,
                    }}
                  >
                    <Plus
                      strokeWidth={2}
                      className="h-4 w-4"
                      style={{ color: on ? "#fff" : GOLD.deep }}
                    />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.7, ease: EASE },
                        opacity: { duration: 0.55, ease: EASE },
                      }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 pb-7 text-[15px] leading-[1.95] sm:px-9 sm:pb-8 sm:text-base"
                        style={{
                          fontFamily: FONT_BODY,
                          fontWeight: 400,
                          color: `${GOLD.ink}A6`,
                          maxWidth: "62ch",
                        }}
                      >
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FORM — refined glass inputs
================================================================== */
function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  delay = 0,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  delay?: number;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="mb-2.5 block text-[11px] tracking-[0.16em] transition-colors duration-500"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          color: focus ? GOLD.deep : `${GOLD.ink}70`,
        }}
      >
        {label}
      </label>

      <input
        id={id}
        name={id}Here is the remaining code, continuing exactly from where the `FAQS` array was cut off:

```tsx
    a: "לימוד חסידות, התוועדויות, שבתות משותפות וקשר עם משפיעים.",
  },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 px-5 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <SectionLabel kicker="שאלות ותשובות" title="מה שחשוב לדעת" />

        <div
          className="overflow-hidden"
          style={{
            background: NAVY_GRADIENT,
            border: `1px solid ${NAVY.line}`,
            boxShadow: "0 18px 50px rgba(10,20,40,0.22)",
          }}
        >
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.1, ease: EASE, delay: i * 0.06 }}
                style={{
                  borderBottom:
                    i !== FAQS.length - 1 ? `1px solid ${NAVY.line}` : "none",
                }}
              >
                <button
                  onClick={() => setOpen(on ? null : i)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-5 px-6 py-6 text-right outline-none transition-colors duration-500 sm:px-9 sm:py-7"
                  style={{ background: on ? "rgba(212,175,55,0.07)" : "transparent" }}
                >
                  <span
                    className="text-[19px] leading-tight transition-colors duration-500 sm:text-[25px]"
                    style={{
                      fontFamily: FONT_HEAD,
                      color: on ? GOLD.light : NAVY.text,
                    }}
                  >
                    {f.q}
                  </span>

                  <motion.span
                    animate={{ rotate: on ? 45 : 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="grid h-9 w-9 shrink-0 place-items-center"
                    style={{
                      background: on ? GOLD_GRADIENT : "rgba(212,175,55,0.1)",
                      border: `1px solid ${on ? "transparent" : GOLD.base + "3D"}`,
                    }}
                  >
                    <Plus
                      strokeWidth={2}
                      className="h-4 w-4"
                      style={{ color: on ? "#fff" : GOLD.base }}
                    />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.7, ease: EASE },
                        opacity: { duration: 0.55, ease: EASE },
                      }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 pb-7 text-[15px] leading-[1.95] sm:px-9 sm:pb-8 sm:text-base"
                        style={{
                          fontFamily: FONT_BODY,
                          fontWeight: 400,
                          color: NAVY.mute,
                          maxWidth: "62ch",
                        }}
                      >
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FORM — deep navy wrapper, glass inputs
================================================================== */
function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  delay = 0,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "numeric" | "tel";
  delay?: number;
}) {
  const [focus, setFocus] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE, delay }}
      className="relative"
    >
      <label
        htmlFor={id}
        className="mb-2.5 block text-[11px] tracking-[0.16em] transition-colors duration-500"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          color: focus ? GOLD.base : NAVY.mute,
        }}
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        required
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="w-full px-4 py-3.5 outline-none sm:px-5 sm:py-4"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 17,
          color: NAVY.text,
          caretColor: GOLD.base,
          background: focus ? "rgba(255,254,250,0.09)" : "rgba(255,254,250,0.05)",
          backdropFilter: "blur(14px)",
          border: `1px solid ${focus ? GOLD.base + "80" : NAVY.line}`,
          boxShadow: focus
            ? `0 8px 26px rgba(212,175,55,0.14)`
            : "0 4px 16px rgba(10,20,40,0.14)",
          transition:
            "background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease",
        }}
      />

      <motion.div
        initial={false}
        animate={{ scaleX: focus ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{ background: GOLD_GRADIENT, originX: 1 }}
      />
    </motion.div>
  );
}

function FormSection() {
  const [form, setForm] = useState({ name: "", age: "", phone: "" });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to your API route / CRM
    console.log("[YESHIVA_FORM]", form);
    setSent(true);
  };

  return (
    <section id="form" className="relative z-10 px-5 pb-44 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden p-7 sm:p-12 lg:p-16"
          style={{
            background: NAVY_GRADIENT,
            border: `1px solid ${NAVY.line}`,
            boxShadow: "0 28px 76px rgba(10,20,40,0.3)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{ background: GOLD_GRADIENT }}
          />

          <div
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 blur-[100px]"
            style={{ background: `${GOLD.base}26` }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 blur-[110px]"
            style={{ background: `${GOLD.light}1A` }}
          />

          <Reveal>
            <span
              className="relative text-[11px] tracking-[0.32em]"
              style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.base }}
            >
              הרשמה
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              className="relative mt-4 max-w-[20ch] text-[30px] leading-[1.16] sm:text-5xl lg:text-[54px]"
              style={{ fontFamily: FONT_HEAD, color: NAVY.text }}
            >
              המקום שלך לגדול,{" "}
              <span
                style={{
                  background: GOLD_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                להתקדם ולבנות
              </span>{" "}
              את העתיד שלך.
            </h2>
          </Reveal>

          <div className="relative my-10 sm:my-12">
            <GoldRule delay={0.2} w="100%" />
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={submit}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative"
              >
                <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-3">
                  <Field
                    id="name"
                    label="שם מלא"
                    value={form.name}
                    onChange={set("name")}
                    delay={0}
                  />
                  <Field
                    id="age"
                    label="גיל"
                    value={form.age}
                    onChange={set("age")}
                    inputMode="numeric"
                    delay={0.08}
                  />
                  <Field
                    id="phone"
                    label="מספר טלפון"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    delay={0.16}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.24 }}
                  className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <motion.button
                    type="submit"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="group inline-flex w-full items-center justify-center gap-3 px-10 py-4 text-white sm:w-auto sm:px-14"
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      fontSize: 16,
                      background: GOLD_GRADIENT,
                      boxShadow: `0 14px 38px ${GOLD.base}4D`,
                    }}
                  >
                    שליחת פרטים
                    <Send
                      strokeWidth={2.2}
                      className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
                    />
                  </motion.button>

                  <p
                    className="max-w-[30ch] text-[12px] leading-relaxed"
                    style={{ fontFamily: FONT_BODY, color: NAVY.mute }}
                  >
                    הפרטים נשמרים בסודיות. נחזור אליך בהקדם.
                  </p>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:gap-8 sm:p-12"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: `1px solid ${GOLD.base}4D`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
                  className="grid h-16 w-16 shrink-0 place-items-center sm:h-[74px] sm:w-[74px]"
                  style={{
                    background: GOLD_GRADIENT,
                    boxShadow: `0 12px 32px ${GOLD.base}4D`,
                  }}
                >
                  <Check strokeWidth={2.4} className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                </motion.div>

                <div>
                  <h3
                    className="text-[24px] leading-tight sm:text-[34px]"
                    style={{ fontFamily: FONT_HEAD, color: NAVY.text }}
                  >
                    הפרטים נשלחו בהצלחה
                  </h3>
                  <p
                    className="mt-2 text-[14px] leading-relaxed sm:text-base"
                    style={{ fontFamily: FONT_BODY, color: NAVY.mute }}
                  >
                    ניצור איתך קשר בקרוב. תודה שפנית אלינו.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Single quiet line — NOT a footer, no logo / links / layout */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mt-12 text-center text-[11px] tracking-[0.22em]"
          style={{ fontFamily: FONT_BODY, fontWeight: 600, color: `${GOLD.ink}59` }}
        >
          יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד
        </motion.p>
      </div>
    </section>
  );
}

/* ==================================================================
   MAIN CONTENT — hero (navy) → clean cream body. No footer.
================================================================== */
function MainContent({ video }: { video?: WeeklyVideo }) {
  return (
    <main className="relative w-full" style={{ background: "#FFFEFA" }}>
      <HeroSection video={video} />

      <div
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, #FFFEFA 0%, #FDFBF4 40%, #FBF7EC 74%, #FFFEFA 100%)",
        }}
      >
        <ScrollMarquees />
        <TracksSection />
        <FAQSection />
        <FormSection />
      </div>
    </main>
  );
}

/* ==================================================================
   PAGE — BottomDock is the absolute last element. Nothing below it.
================================================================== */
export default function Page() {
  const { section, docked } = useScrollState();

  // CMS hook-up point
  const weeklyVideo: WeeklyVideo | undefined = useMemo(
    () => ({
      // src: "/videos/hero.mp4",
      // poster: "/videos/hero-poster.jpg",
      caption: "מתעדכן כל שבוע",
    }),
    []
  );

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen antialiased"
      style={{ fontFamily: FONT_BODY, color: GOLD.ink, background: "#FFFEFA" }}
    >
      <style>{`
        ::selection { background: ${GOLD.base}40; color: ${GOLD.ink}; }
        input::placeholder { color: ${NAVY.mute}80; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <AmbientFloaters section={section} />
      <TopHeader />

      <SmoothScrollProvider>
        <MainContent video={weeklyVideo} />
      </SmoothScrollProvider>

      {/* LayoutGroup enables the WhatsApp → dock morph via shared layoutId */}
      <LayoutGroup>
        <FloatingWhatsApp docked={docked} />
        <BottomDock docked={docked} />
      </LayoutGroup>
    </div>
  );
}
```

---

## ✅ Complete. Stitch order:

`PART 1` (imports → `HeroSection`) → `PART 2 block A` (`MarqueeBand` → `FAQS` array) → `PART 2 block B` (this message).

---

### Notes on the five requests

**#1 — Pinned video hero + Skip**
`min-h-[300vh]` track with a `sticky top-0 h-[100svh]` stage inside. `scrollYProgress` (offset `start start → end end`) drives the scrim opacity and copy fade; the stage releases in the last 12%. The Skip button computes `window.scrollY + rect.bottom - innerHeight` and hands it to `fastScrollTo(target, 500)` — a `requestAnimationFrame` loop with `easeInOutCubic`, so it lands exactly past the track in 0.5s. The button itself fades out by 25% progress so it doesn't linger.

> ⚠️ One thing to verify: `fastScrollTo` drives the **native** `window.scrollY`, which the `SmoothScrollProvider` spring then follows. On desktop you'll see a ~150ms tail as the spring catches up — it reads as intentional easing. If you want it perfectly exact, tell me and I'll expose a `jump()` escape hatch on the provider.

**#2 — Footer nuked**
No `<footer>`, no logo block, no link columns, no bottom layout. The only thing after `FormSection`'s form is one centered `<p>` line inside the same section. In `Page`, `BottomDock` is the final JSX node.

**#3 — The morph**
`layoutId="wa-morph"` (plus `layoutId="wa-morph-icon"` for the glyph) is shared between `FloatingWhatsApp` and dock slot 1. Both sit inside `<LayoutGroup>`. Because only one mounts at a time (`docked` from `scrollYProgress > 0.9`), Framer Motion FLIP-animates it across the viewport — 56px gold circle with glow → 34px transparent rounded square with a muted icon. Slot 1 holds a `34×34` reserved spacer while undocked, so nothing shifts. Dock order is exactly ייעוץ · מה קורה פה · **בית** (gold circle, `marginTop: -22` so it breaches the bar) · מהפעילות · חנות.

**#4 — Deep navy**
New `NAVY` token at `#0A1428` — deliberately darker and cooler than a logo blue. Applied to the hero backdrop, all four track cards, the FAQ panel, and the form wrapper. Cream `#FFFEFA` stays as the page background, so the navy blocks read as floating slabs.

**Before deploy:** swap `972500000000` in `WA_HREF` for the real number, and uncomment `src`/`poster` in `weeklyVideo` once your footage exists.CRITICAL CORRECTIONS - Follow these instructions precisely. The user is frustrated with bugs from the last output. We are fixing `page.tsx`:

1. Background & Cards: Change the global page background to a slightly lighter dark-blue (e.g., `#1e293b` or `bg-slate-800`). The Bento boxes (cards) themselves must be clean (e.g., white or slight glassmorphism) with slightly rounded corners (`rounded-[10px]` or `rounded-xl`).
2. Hero Section Fix: Remove the duplicated text. Replace the Hero entirely with a clean 9:16 vertical video placeholder component.
3. Bottom Dock & WhatsApp Fix: 
   - The Bottom Dock must be `fixed bottom-0 w-full z-50` (strictly sticking to the bottom, not floating above it). 
   - Delete the static green WhatsApp icon. 
   - Make the floating WhatsApp button GOLD. 
   - Use Framer Motion's `layoutId` so that when the user scrolls to the bottom, the floating Gold button seamlessly morphs directly into the very first slot of the bottom dock.
4. Logo Typography: The text next to the logo ("ישיבת / המלך / המשיח") must be stacked, tall, match the logo's height, use a thinner/lighter font weight (`font-light`), and have slight line spacing to look premium.

TOKEN LIMIT STRATEGY:
Output the ENTIRE updated `page.tsx`. You MUST split the code into EXACTLY TWO distinct code blocks. 
- Block 1: Imports, Constants, Dock, Floating WhatsApp, Hero.
- Block 2: Marquee, BentoGrid, Form, and `export default Page`.
Do not hallucinate. Do not add conversational filler.<label
        htmlFor={id}
        className="mb-2.5 block text-[11px] tracking-[0.16em] transition-colors duration-500"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          color: focus ? GOLD.deep : "#64748B",
        }}
      >
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        required
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className="w-full px-4 py-3.5 outline-none sm:px-5 sm:py-4"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 17,
          color: "#1E293B",
          caretColor: GOLD.base,
          borderRadius: R.sm,
          background: focus ? "#FFFFFF" : "#F8FAFC",
          border: `1px solid ${focus ? GOLD.base + "99" : "#E2E8F0"}`,
          boxShadow: focus
            ? `0 8px 26px rgba(212,175,55,0.18)`
            : "0 2px 10px rgba(0,0,0,0.04)",
          transition:
            "background 0.6s ease, border-color 0.6s ease, box-shadow 0.6s ease",
        }}
      />

      <motion.div
        initial={false}
        animate={{ scaleX: focus ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute bottom-0 inset-x-0 h-[2px]"
        style={{ background: GOLD_GRADIENT, originX: 1, borderRadius: R.pill }}
      />
    </motion.div>
  );
}

function FormSection() {
  const [form, setForm] = useState({ name: "", age: "", phone: "" });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to your API route / CRM
    console.log("[YESHIVA_FORM]", form);
    setSent(true);
  };

  return (
    <section id="form" className="relative z-10 px-5 pb-44 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div
          className="relative overflow-hidden p-7 sm:p-12 lg:p-16"
          style={{
            borderRadius: R.card,
            background: CARD.solid,
            border: `1px solid ${CARD.glassLine}`,
            boxShadow: "0 28px 76px rgba(0,0,0,0.32)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{ background: GOLD_GRADIENT }}
          />

          <div
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 blur-[100px]"
            style={{ background: `${GOLD.base}1A` }}
          />

          <Reveal>
            <span
              className="relative text-[11px] tracking-[0.32em]"
              style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.deep }}
            >
              הרשמה
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              className="relative mt-4 max-w-[20ch] text-[30px] leading-[1.16] sm:text-5xl lg:text-[54px]"
              style={{ fontFamily: FONT_HEAD, color: "#1E293B" }}
            >
              המקום שלך לגדול,{" "}
              <span
                style={{
                  background: GOLD_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                להתקדם ולבנות
              </span>{" "}
              את העתיד שלך.
            </h2>
          </Reveal>

          <div className="relative my-10 sm:my-12">
            <GoldRule delay={0.2} w="100%" />
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={submit}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative"
              >
                <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-3">
                  <Field
                    id="name"
                    label="שם מלא"
                    value={form.name}
                    onChange={set("name")}
                    delay={0}
                  />
                  <Field
                    id="age"
                    label="גיל"
                    value={form.age}
                    onChange={set("age")}
                    inputMode="numeric"
                    delay={0.08}
                  />
                  <Field
                    id="phone"
                    label="מספר טלפון"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    delay={0.16}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.24 }}
                  className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <motion.button
                    type="submit"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="group inline-flex w-full items-center justify-center gap-3 px-10 py-4 text-white sm:w-auto sm:px-14"
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      fontSize: 16,
                      borderRadius: R.sm,
                      background: GOLD_GRADIENT,
                      boxShadow: `0 14px 38px ${GOLD.base}4D`,
                    }}
                  >
                    שליחת פרטים
                    <Send
                      strokeWidth={2.2}
                      className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
                    />
                  </motion.button>

                  <p
                    className="max-w-[30ch] text-[12px] leading-relaxed"
                    style={{ fontFamily: FONT_BODY, color: "#64748B" }}
                  >
                    הפרטים נשמרים בסודיות. נחזור אליך בהקדם.
                  </p>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="relative flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:gap-8 sm:p-12"
                style={{
                  borderRadius: R.card,
                  background: "rgba(212,175,55,0.08)",
                  border: `1px solid ${GOLD.base}4D`,
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
                  className="grid h-16 w-16 shrink-0 place-items-center sm:h-[74px] sm:w-[74px]"
                  style={{
                    borderRadius: R.pill,
                    background: GOLD_GRADIENT,
                    boxShadow: `0 12px 32px ${GOLD.base}4D`,
                  }}
                >
                  <Check
                    strokeWidth={2.4}
                    className="h-7 w-7 text-white sm:h-8 sm:w-8"
                  />
                </motion.div>

                <div>
                  <h3
                    className="text-[24px] leading-tight sm:text-[34px]"
                    style={{ fontFamily: FONT_HEAD, color: "#1E293B" }}
                  >
                    הפרטים נשלחו בהצלחה
                  </h3>
                  <p
                    className="mt-2 text-[14px] leading-relaxed sm:text-base"
                    style={{ fontFamily: FONT_BODY, color: "#475569" }}
                  >
                    ניצור איתך קשר בקרוב. תודה שפנית אלינו.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Single quiet line — not a footer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mt-12 text-center text-[11px] tracking-[0.22em]"
          style={{ fontFamily: FONT_BODY, fontWeight: 600, color: `${GOLD.light}80` }}
        >
          יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד
        </motion.p>
      </div>
    </section>
  );
}

/* ==================================================================
   MAIN CONTENT
================================================================== */
function MainContent({ video }: { video?: WeeklyVideo }) {
  return (
    <main className="relative w-full" style={{ background: BG.page }}>
      <HeroSection video={video} />
      <ScrollMarquees />
      <TracksSection />
      <FAQSection />
      <FormSection />
    </main>
  );
}

/* ==================================================================
   PAGE — BottomDock is the last element. Nothing below it.
================================================================== */
export default function Page() {
  const { section, docked } = useScrollState();

  // CMS hook-up point
  const weeklyVideo: WeeklyVideo | undefined = useMemo(
    () => ({
      // src: "/videos/hero.mp4",
      // poster: "/videos/hero-poster.jpg",
      caption: "מתעדכן כל שבוע",
    }),
    []
  );

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen antialiased"
      style={{ fontFamily: FONT_BODY, color: BG.text, background: BG.page }}
    >
      <style>{`
        html, body { background: ${BG.page}; }
        ::selection { background: ${GOLD.base}40; color: #1E293B; }
        input::placeholder { color: #94A3B8; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <AmbientFloaters section={section} />
      <TopHeader />

      <SmoothScrollProvider>
        <MainContent video={weeklyVideo} />
      </SmoothScrollProvider>

      {/* LayoutGroup enables the gold WhatsApp → dock slot-1 morph */}
      <LayoutGroup>
        <FloatingWhatsApp docked={docked} />
        <BottomDock docked={docked} />
      </LayoutGroup>
    </div>
  );
}
