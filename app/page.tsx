"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import {
  MapPin,
  Home,
  ShoppingBag,
  Sparkles,
  Plus,
  ArrowLeft,
  Send,
  Check,
  ChevronsDown,
  type LucideIcon,
} from "lucide-react";

/* ==================================================================
   FONTS — add to app/layout.tsx <head>:

   <link
     href="https://fonts.googleapis.com/css2?family=Bona+Nova+SC:wght@400;700&family=Assistant:wght@300;400;600;700;800&display=swap"
     rel="stylesheet"
   />
================================================================== */
const FONT_HEAD = "'Bona Nova SC', 'Bona Nova', serif";
const FONT_BODY = "'Assistant', 'Heebo', system-ui, sans-serif";

/* Gold system */
const GOLD = {
  light: "#F3DFA6",
  base: "#D4AF37",
  deep: "#B8912B",
  dark: "#8A6B1F",
  ink: "#3B2F14",
};
const GOLD_GRADIENT =
  "linear-gradient(135deg, #F3DFA6 0%, #D4AF37 45%, #B8912B 100%)";
const GOLD_GRADIENT_SOFT =
  "linear-gradient(135deg, #FBF3DC 0%, #F3DFA6 100%)";

/* NEW — Deep midnight navy, noticeably darker than the logo blue.
   Used for large central elements only (cards, form wrapper). */
const NAVY = {
  base: "#0A1428", // deep midnight
  soft: "#122040", // raised surface
  line: "#1E3357", // hairline borders
  text: "#E8EEF9", // on-navy body text
  mute: "#8FA3C4", // on-navy muted text
};
const NAVY_GRADIENT =
  "linear-gradient(150deg, #0A1428 0%, #122040 55%, #0A1428 100%)";

/* Gentle shared motion language */
const EASE = [0.22, 0.61, 0.36, 1] as const;
const SOFT = { duration: 1.1, ease: EASE };
const SOFT_SLOW = { duration: 1.4, ease: EASE };
/* Spring used for the WhatsApp → dock morph */
const MORPH = { type: "spring" as const, stiffness: 170, damping: 26, mass: 0.9 };

/* ==================================================================
   SMOOTH SCROLL — light touch, auto-off on touch / reduced motion
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
        <motion.div
          ref={contentRef}
          style={{ y: translateY, willChange: "transform" }}
        >
          {children}
        </motion.div>
      </div>
      <div style={{ height }} aria-hidden="true" />
    </>
  );
}

/* ==================================================================
   FAST SCROLL — 0.5s eased window scroll (used by Skip button)
================================================================== */
function fastScrollTo(targetY: number, duration = 500) {
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 4) return;
  const t0 = performance.now();

  // easeInOutCubic
  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (now: number) => {
    const p = Math.min((now - t0) / duration, 1);
    window.scrollTo(0, startY + delta * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ==================================================================
   ACTIVE SECTION + DOCKED STATE
================================================================== */
type SectionKey = "hero" | "tracks" | "faq" | "form";

function useScrollState() {
  const [section, setSection] = useState<SectionKey>("hero");
  const [docked, setDocked] = useState(false);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next: SectionKey =
      p < 0.34 ? "hero" : p < 0.6 ? "tracks" : p < 0.82 ? "faq" : "form";
    setSection((prev) => (prev === next ? prev : next));

    // Morph trigger: WhatsApp docks into the nav near the bottom
    const isDocked = p > 0.9;
    setDocked((prev) => (prev === isDocked ? prev : isDocked));
  });

  return { section, docked };
}

/* ==================================================================
   AMBIENT FLOATERS
================================================================== */
const AMBIENT: Record<SectionKey, string[]> = {
  hero: ["✦", "✧", "◆"],
  tracks: ["✧", "✦", "❖"],
  faq: ["◇", "✦", "✧"],
  form: ["✦", "❖", "✧"],
};
const FLOAT_POS = [
  { top: "16%", right: "7%", size: 28, dur: 16 },
  { top: "46%", left: "6%", size: 19, dur: 20 },
  { top: "74%", right: "12%", size: 23, dur: 18 },
];

function AmbientFloaters({ section }: { section: SectionKey }) {
  const glyphs = AMBIENT[section];
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        <motion.div key={section} className="absolute inset-0">
          {FLOAT_POS.map((p, i) => (
            <motion.span
              key={`${section}-${i}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.18,
                y: [0, -16, 0],
                x: [0, i % 2 ? 8 : -8, 0],
              }}
              exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE } }}
              transition={{
                opacity: { duration: 1.6, ease: EASE },
                y: { duration: p.dur, repeat: Infinity, ease: "easeInOut" },
                x: {
                  duration: p.dur * 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
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
          borderBottom: solid
            ? `1px solid ${GOLD.base}33`
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-9">
          <div className="flex items-center gap-3">
            <div
              className="grid h-12 w-12 place-items-center sm:h-14 sm:w-14"
              style={{
                background: GOLD_GRADIENT,
                boxShadow: `0 6px 20px ${GOLD.base}40`,
              }}
            >
              <span
                className="text-xl text-white sm:text-2xl"
                style={{ fontFamily: FONT_HEAD }}
              >
                מ
              </span>
            </div>

            <div
              className="flex flex-col leading-[0.94]"
              style={{ fontFamily: FONT_HEAD, color: GOLD.ink }}
            >
              {["ישיבת", "המלך", "המשיח"].map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: EASE,
                    delay: 0.25 + i * 0.09,
                  }}
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
   WHATSAPP GLYPH (shared by floating + docked states)
================================================================== */
const WA_HREF = "https://wa.me/972500000000";

function WhatsAppGlyph({ color, size }: { color: string; size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.06 4.49.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
    </svg>
  );
}

/* ==================================================================
   FLOATING WHATSAPP — mounts only while NOT docked.
   Shares layoutId="wa-morph" with dock slot 1.
================================================================== */
function FloatingWhatsApp({ docked }: { docked: boolean }) {
  const [hot, setHot] = useState(false);

  return (
    <AnimatePresence>
      {!docked && (
        <motion.div
          className="fixed left-4 z-[60] sm:left-7"
          style={{ bottom: 104 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2.5">
            {/* Morphing element */}
            <motion.a
              layoutId="wa-morph"
              transition={MORPH}
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ייעוץ בוואטסאפ"
              onHoverStart={() => setHot(true)}
              onHoverEnd={() => setHot(false)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative grid place-items-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 999,
                background: GOLD_GRADIENT,
                boxShadow: `0 12px 34px ${GOLD.base}59`,
              }}
            >
              <motion.span
                layoutId="wa-morph-icon"
                transition={MORPH}
                className="grid place-items-center"
              >
                <WhatsAppGlyph color="#ffffff" size={26} />
              </motion.span>

              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{ borderRadius: 999, border: `1px solid ${GOLD.base}` }}
              />
            </motion.a>

            <AnimatePresence>
              {hot && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="hidden whitespace-nowrap px-3.5 py-2 text-xs sm:block"
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: 600,
                    color: GOLD.ink,
                    background: "rgba(255,254,250,0.94)",
                    backdropFilter: "blur(14px)",
                    border: `1px solid ${GOLD.base}40`,
                    boxShadow: "0 8px 26px rgba(59,47,20,0.09)",
                  }}
                >
                  נדבר? אנחנו כאן
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ==================================================================
   BOTTOM DOCK — 5 slots, RTL order:
   ייעוץ · מה קורה פה · בית(gold circle) · מהפעילות · חנות
   Slot 1 receives the morphing WhatsApp element when docked.
================================================================== */
type DockEntry = {
  key: string;
  label: string;
  icon?: LucideIcon;
  href: string;
  external?: boolean;
  center?: boolean;
  isWA?: boolean;
};

const DOCK: DockEntry[] = [
  { key: "wa", label: "ייעוץ", href: WA_HREF, external: true, isWA: true },
  { key: "loc", label: "מה קורה פה", icon: MapPin, href: "#tracks" },
  { key: "home", label: "בית", icon: Home, href: "#hero", center: true },
  { key: "act", label: "מהפעילות", icon: Sparkles, href: "#faq" },
  {
    key: "shop",
    label: "חנות",
    icon: ShoppingBag,
    href: "https://swiwgi-zu.myshopify.com/",
    external: true,
  },
];

function BottomDock({ docked }: { docked: boolean }) {
  const [hot, setHot] = useState<string | null>(null);

  return (
    <motion.nav
      dir="rtl"
      aria-label="ניווט ראשי"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SOFT_SLOW, delay: 0.35 }}
      className="fixed inset-x-0 bottom-0 z-50"
      style={{
        background: "rgba(255,254,250,0.88)",
        backdropFilter: "blur(22px) saturate(160%)",
        borderTop: `1px solid ${GOLD.base}33`,
        boxShadow: "0 -8px 34px rgba(59,47,20,0.07)",
      }}
    >
      <ul className="mx-auto flex max-w-3xl items-end justify-between gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 sm:gap-2 sm:px-8">
        {DOCK.map((item, i) => {
          const Icon = item.icon;
          const lit = hot === item.key;

          /* ---- Slot 1: WhatsApp morph target ---- */
          if (item.isWA) {
            return (
              <li key={item.key} className="flex-1">
                <div className="relative flex flex-col items-center gap-1.5 px-1 py-2">
                  {docked ? (
                    <motion.a
                      layoutId="wa-morph"
                      transition={MORPH}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      onHoverStart={() => setHot(item.key)}
                      onHoverEnd={() => setHot(null)}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className="grid place-items-center"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        background: lit ? `${GOLD.base}1F` : "transparent",
                        boxShadow: "none",
                      }}
                    >
                      <motion.span
                        layoutId="wa-morph-icon"
                        transition={MORPH}
                        className="grid place-items-center"
                      >
                        <WhatsAppGlyph
                          color={lit ? GOLD.deep : `${GOLD.ink}85`}
                          size={19}
                        />
                      </motion.span>
                    </motion.a>
                  ) : (
                    /* Reserved space so nothing shifts before the morph */
                    <div style={{ width: 34, height: 34 }} aria-hidden="true" />
                  )}

                  <motion.span
                    animate={{ opacity: docked ? 1 : 0.35 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="whitespace-nowrap text-[10px] sm:text-[11px]"
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      color: lit ? GOLD.deep : `${GOLD.ink}70`,
                    }}
                  >
                    {item.label}
                  </motion.span>
                </div>
              </li>
            );
          }

          /* ---- Center: prominent gold circular Home ---- */
          if (item.center) {
            return (
              <motion.li
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.06 }}
                className="flex-1"
              >
                <motion.a
                  href={item.href}
                  aria-current="page"
                  onHoverStart={() => setHot(item.key)}
                  onHoverEnd={() => setHot(null)}
                  onClick={(e) => {
                    e.preventDefault();
                    fastScrollTo(0, 500);
                  }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="relative flex flex-col items-center gap-1.5 px-1"
                  style={{ marginTop: -22 }}
                >
                  <span
                    className="grid place-items-center"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 999,
                      background: GOLD_GRADIENT,
                      boxShadow: `0 10px 28px ${GOLD.base}66`,
                      border: "3px solid rgba(255,254,250,0.95)",
                    }}
                  >
                    {Icon && <Icon strokeWidth={2.2} width={23} height={23} color="#fff" />}
                  </span>
                  <span
                    className="whitespace-nowrap text-[10px] sm:text-[11px]"
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      color: GOLD.deep,
                    }}
                  >
                    {item.label}
                  </span>
                </motion.a>
              </motion.li>
            );
          }

          /* ---- Standard slots ---- */
          return (
            <motion.li
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 + i * 0.06 }}
              className="flex-1"
            >
              <motion.a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onHoverStart={() => setHot(item.key)}
                onHoverEnd={() => setHot(null)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex flex-col items-center gap-1.5 px-1 py-2 outline-none"
              >
                <span
                  className="grid place-items-center transition-all duration-500"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: lit ? `${GOLD.base}1F` : "transparent",
                  }}
                >
                  {Icon && (
                    <Icon
                      strokeWidth={1.9}
                      width={19}
                      height={19}
                      color={lit ? GOLD.deep : `${GOLD.ink}85`}
                    />
                  )}
                </span>
                <span
                  className="whitespace-nowrap text-[10px] transition-colors duration-500 sm:text-[11px]"
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    color: lit ? GOLD.deep : `${GOLD.ink}70`,
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
   SHARED REVEAL HELPERS
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

function SectionLabel({
  kicker,
  title,
  onDark = false,
}: {
  kicker: string;
  title: string;
  onDark?: boolean;
}) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal>
        <span
          className="text-[11px] tracking-[0.32em]"
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 700,
            color: onDark ? GOLD.base : GOLD.deep,
          }}
        >
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          className="mt-3 text-[30px] leading-[1.14] sm:text-5xl lg:text-[56px]"
          style={{ fontFamily: FONT_HEAD, color: onDark ? NAVY.text : GOLD.ink }}
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
   HERO — full-screen pinned video over a 300vh track + Skip button
================================================================== */
type WeeklyVideo = { src?: string; poster?: string; caption?: string };

function HeroSection({ video }: { video?: WeeklyVideo }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoEl = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* Pin the stage across the whole track, release at the very end */
  const pinY = useTransform(scrollYProgress, [0, 0.88, 1], ["0%", "0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55, 0.86], [1, 1, 0]);
  const overlayAlpha = useTransform(scrollYProgress, [0, 0.9], [0.52, 0.8]);
  const skipOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  /* Skip → jump past the track in 0.5s */
  const skip = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const target = window.scrollY + rect.bottom - window.innerHeight + 1;
    fastScrollTo(target, 500);
  }, []);

  const words = "העתיד שלך מתחיל כאן".split(" ");

  return (
    <section
      id="hero"
      ref={trackRef}
      className="relative min-h-[300vh] w-full"
      style={{ background: NAVY.base }}
    >
      {/* Pinned full-screen stage */}
      <motion.div
        style={{ y: pinY }}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
      >
        {/* Video / placeholder layer */}
        <div className="absolute inset-0">
          {video?.src ? (
            <video
              ref={videoEl}
              src={video.src}
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{ background: NAVY_GRADIENT }}
              aria-hidden="true"
            >
              {/* soft gold light pools — stands in for footage */}
              <motion.div
                animate={{ opacity: [0.24, 0.4, 0.24] }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-24 top-[8%] h-[420px] w-[420px] blur-[110px]"
                style={{ background: `${GOLD.base}55` }}
              />
              <motion.div
                animate={{ opacity: [0.18, 0.32, 0.18] }}
                transition={{
                  duration: 11,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
                className="absolute -left-20 bottom-[6%] h-[380px] w-[380px] blur-[110px]"
                style={{ background: `${GOLD.light}44` }}
              />
            </div>
          )}
        </div>

        {/* Readability scrim */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayAlpha,
            background:
              "linear-gradient(to top, rgba(10,20,40,0.96) 0%, rgba(10,20,40,0.55) 45%, rgba(10,20,40,0.7) 100%)",
          }}
        />

        {/* Hero copy */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center sm:px-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="mb-7 inline-flex items-center gap-2.5 px-4 py-2"
            style={{
              background: "rgba(255,254,250,0.08)",
              backdropFilter: "blur(14px)",
              border: `1px solid ${GOLD.base}4D`,
            }}
          >
            <span className="h-1 w-1" style={{ background: GOLD.base }} />
            <span
              className="text-[10px] tracking-[0.2em] sm:text-[11px]"
              style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.light }}
            >
              שנת הלימודים ה'תשפ״ז · ירושלים
            </span>
          </motion.div>

          <h1
            className="max-w-[14ch] text-[13vw] leading-[1] sm:text-[72px] lg:text-[92px]"
            style={{ fontFamily: FONT_HEAD, color: NAVY.text }}
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.32 + i * 0.1 }}
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

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.75 }}
            className="mt-7 max-w-[40ch] text-[15px] leading-[1.85] sm:text-lg"
            style={{ fontFamily: FONT_BODY, color: NAVY.mute }}
          >
            מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים. בלב ירושלים.
          </motion.p>

          <motion.a
            href="#form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.9 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="group mt-10 inline-flex items-center gap-3 px-9 py-4 text-white sm:px-11"
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 16,
              background: GOLD_GRADIENT,
              boxShadow: `0 14px 38px ${GOLD.base}59`,
            }}
          >
            להרשמה לישיבה
            <ArrowLeft
              strokeWidth={2.2}
              className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
            />
          </motion.a>
        </motion.div>

        {/* SKIP / FAST-FORWARD */}
        <motion.button
          onClick={skip}
          style={{ opacity: skipOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.3 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 px-5 py-2.5"
          aria-label="דלג על הסרטון"
          dir="rtl"
        >
          <span
            className="text-[11px] tracking-[0.18em]"
            style={{ fontFamily: FONT_BODY, fontWeight: 600, color: GOLD.light }}
          >
            דלג / גלול למטה
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="grid place-items-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: 999,
              border: `1px solid ${GOLD.base}66`,
              background: "rgba(255,254,250,0.07)",
              backdropFilter: "blur(10px)",
            }}
          >
            <ChevronsDown width={15} height={15} color={GOLD.light} strokeWidth={2} />
          </motion.span>
        </motion.button>
      </motion.div>
    </section>
  );
}

// --- END OF PART 1 ---// --- START OF PART 2 ---

/* ==================================================================
   MARQUEES
================================================================== */
function MarqueeBand({
  text,
  reverse = false,
  duration = 48,
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
      <MarqueeBand text="ללמוד בלב ירושלים – ולהשפיע על לב ירושלים · " duration={54} />
      <MarqueeBand
        text="מסלול אישי · ליווי חסידי · הכנה לחיים · "
        reverse
        duration={46}
        filled
      />
    </div>
  );
}
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
        background: NAVY_GRADIENT,
        border: `1px solid ${hot ? GOLD.base + "59" : NAVY.line}`,
        boxShadow: hot
          ? `0 26px 60px rgba(10,20,40,0.32), inset 0 1px 0 ${GOLD.base}1F`
          : "0 10px 30px rgba(10,20,40,0.18)",
        transition: "border-color 0.7s ease, box-shadow 0.7s ease",
      }}
    >
      <motion.div
        animate={{ scaleX: hot ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: GOLD_GRADIENT, originX: 1 }}
      />

      <div
        className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 blur-[90px] transition-opacity duration-700"
        style={{ background: `${GOLD.base}20`, opacity: hot ? 1 : 0.35 }}
      />

      <div className="relative flex items-start justify-between gap-4">
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
          animate={{ width: hot ? 40 : 22, opacity: hot ? 1 : 0.45 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-4 h-[1px] shrink-0"
          style={{ background: GOLD_GRADIENT }}
        />
      </div>

      <h3
        className="relative mt-6 text-[21px] leading-[1.28] sm:text-[26px]"
        style={{ fontFamily: FONT_HEAD, color: NAVY.text }}
      >
        {track.title}
      </h3>

      <p
        className="relative mt-4 text-[14px] leading-[1.9] sm:text-[15px]"
        style={{ fontFamily: FONT_BODY, fontWeight: 400, color: NAVY.mute }}
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
   FAQ — navy panel
================================================================== */
const FAQS = [
  {
    q: "הקמפוס והפנימייה",
    a: "פנימייה מרווחת, חדרים ממוזגים, מיטה וארון אישי. מקווה טהרה משופץ בקמפוס.",
  },
  { q: "שלוש ארוחות ביום", a: "טבח צמוד במקום. ארוחות מוגשות באופן מסודר." },
  {
    q: "החיים החסידיים",
a: "לימוד חסידות, התוועדויות משותפות וקשר עם משפיעים"
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
