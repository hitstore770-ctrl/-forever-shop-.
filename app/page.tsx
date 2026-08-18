"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
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
  Play,
  type LucideIcon,
} from "lucide-react";

/* ==================================================================
   FONTS - add to app/layout.tsx head:

   <link
     href="https://fonts.googleapis.com/css2?family=Bona+Nova+SC:wght@400;700&family=Assistant:wght@200;300;400;600;700;800&display=swap"
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

/* Page surface - lighter dark blue */
const BG = {
  page: "#1E293B",
  pageSoft: "#243349",
  line: "#33425C",
  text: "#F1F5F9",
  mute: "#A3B2C9",
};

/* Clean card surfaces */
const CARD = {
  solid: "#FFFFFF",
  glass: "rgba(255,255,255,0.94)",
  glassLine: "rgba(255,255,255,0.65)",
};

/* Pre-built color strings - no template literals anywhere */
const GOLD_A12 = "rgba(212,175,55,0.12)";
const GOLD_A18 = "rgba(212,175,55,0.18)";
const GOLD_A24 = "rgba(212,175,55,0.24)";
const GOLD_A30 = "rgba(212,175,55,0.30)";
const GOLD_A40 = "rgba(212,175,55,0.40)";
const GOLD_A60 = "rgba(212,175,55,0.60)";
const GOLD_LIGHT_A50 = "rgba(243,223,166,0.50)";

const BORDER_GOLD_SOFT = "1px solid rgba(212,175,55,0.18)";
const BORDER_GOLD_MED = "1px solid rgba(212,175,55,0.30)";
const BORDER_GOLD_STRONG = "1px solid rgba(212,175,55,0.40)";
const BORDER_TRANSPARENT = "1px solid transparent";
const BORDER_CARD_LINE = "1px solid rgba(255,255,255,0.65)";
const BORDER_GOLD_CARD = "1px solid rgba(212,175,55,0.40)";
const BORDER_SLATE = "1px solid #E2E8F0";
const BORDER_INPUT = "1px solid #E2E8F0";
const BORDER_INPUT_FOCUS = "1px solid rgba(212,175,55,0.60)";

const SHADOW_GOLD_SM = "0 6px 20px rgba(212,175,55,0.25)";
const SHADOW_GOLD_MD = "0 10px 28px rgba(212,175,55,0.40)";
const SHADOW_GOLD_LG = "0 14px 38px rgba(212,175,55,0.30)";
const SHADOW_GOLD_FLOAT = "0 12px 34px rgba(212,175,55,0.40)";
const SHADOW_GOLD_PLAY = "0 10px 30px rgba(212,175,55,0.35)";
const SHADOW_INPUT_FOCUS = "0 8px 26px rgba(212,175,55,0.18)";

const EASE = [0.22, 0.61, 0.36, 1] as const;
const SOFT = { duration: 1.1, ease: EASE };
const SOFT_SLOW = { duration: 1.4, ease: EASE };
const MORPH = {
  type: "spring" as const,
  stiffness: 170,
  damping: 26,
  mass: 0.9,
};

/* Radius scale */
const R = { card: 12, sm: 10, pill: 999 };

/* ==================================================================
   SMOOTH SCROLL
================================================================== */
function useNegative(mv: ReturnType<typeof useSpring>) {
  const out = useMotionValue(0);
  useMotionValueEvent(mv, "change", function (v) {
    out.set(-v);
  });
  return out;
}

function SmoothScrollProvider(props: { children: React.ReactNode }) {
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

  useEffect(function () {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    setEnabled(!reduced && !touch);
  }, []);

  useEffect(function () {
    const el = contentRef.current;
    if (!el) return;
    const measure = function () {
      setHeight(el.getBoundingClientRect().height);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return function () {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(
    function () {
      if (!enabled) return;
      let frame = 0;
      const onScroll = function () {
        if (frame) return;
        frame = requestAnimationFrame(function () {
          rawY.set(window.scrollY);
          frame = 0;
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return function () {
        window.removeEventListener("scroll", onScroll);
        if (frame) cancelAnimationFrame(frame);
      };
    },
    [enabled, rawY]
  );

  if (!enabled) return <>{props.children}</>;

  return (
    <>
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          ref={contentRef}
          style={{ y: translateY, willChange: "transform" }}
        >
          {props.children}
        </motion.div>
      </div>
      <div style={{ height: height }} aria-hidden="true" />
    </>
  );
}

/* ==================================================================
   FAST SCROLL HELPER
================================================================== */
function fastScrollTo(targetY: number, duration?: number) {
  const dur = duration || 500;
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 4) return;
  const t0 = performance.now();
  const ease = function (t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };
  const step = function (now: number) {
    const p = Math.min((now - t0) / dur, 1);
    window.scrollTo(0, startY + delta * ease(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ==================================================================
   SCROLL STATE
================================================================== */
type SectionKey = "hero" | "tracks" | "faq" | "form";

function useScrollState() {
  const [section, setSection] = useState<SectionKey>("hero");
  const [docked, setDocked] = useState(false);
  const scrollInfo = useScroll();

  useMotionValueEvent(scrollInfo.scrollYProgress, "change", function (p) {
    let next: SectionKey = "form";
    if (p < 0.28) next = "hero";
    else if (p < 0.58) next = "tracks";
    else if (p < 0.82) next = "faq";

    setSection(function (prev) {
      return prev === next ? prev : next;
    });

    const isDocked = p > 0.88;
    setDocked(function (prev) {
      return prev === isDocked ? prev : isDocked;
    });
  });

  return { section: section, docked: docked };
}

/* ==================================================================
   AMBIENT FLOATERS
================================================================== */
const AMBIENT: Record<SectionKey, string[]> = {
  hero: ["\u2726", "\u2727", "\u25C6"],
  tracks: ["\u2727", "\u2726", "\u2756"],
  faq: ["\u25C7", "\u2726", "\u2727"],
  form: ["\u2726", "\u2756", "\u2727"],
};

const FLOAT_POS = [
  { top: "16%", right: "7%", left: undefined, size: 26, dur: 16 },
  { top: "46%", right: undefined, left: "6%", size: 18, dur: 20 },
  { top: "74%", right: "12%", left: undefined, size: 22, dur: 18 },
];

function AmbientFloaters(props: { section: SectionKey }) {
  const glyphs = AMBIENT[props.section];
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        <motion.div key={props.section} className="absolute inset-0">
          {FLOAT_POS.map(function (p, i) {
            return (
              <motion.span
                key={props.section + "-" + i}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 0.16,
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
                  left: p.left,
                  right: p.right,
                  fontSize: p.size,
                  color: GOLD.base,
                }}
              >
                {glyphs[i % glyphs.length]}
              </motion.span>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ==================================================================
   TOP HEADER - tall stacked light-weight logo lockup
================================================================== */
const LOGO_LINES = ["\u05D9\u05E9\u05D9\u05D1\u05EA", "\u05D4\u05DE\u05DC\u05DA", "\u05D4\u05DE\u05E9\u05D9\u05D7"];

function TopHeader() {
  const scrollInfo = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollInfo.scrollY, "change", function (y) {
    setSolid(y > 40);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className="transition-all duration-700"
        style={{
          background: solid ? "rgba(30,41,59,0.86)" : "rgba(30,41,59,0)",
          backdropFilter: solid ? "blur(18px) saturate(140%)" : "none",
          borderBottom: solid ? BORDER_GOLD_SOFT : BORDER_TRANSPARENT,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-9">
          <div className="flex items-stretch gap-3">
            <div
              className="grid shrink-0 place-items-center"
              style={{
                width: 62,
                height: 62,
                borderRadius: R.sm,
                background: GOLD_GRADIENT,
                boxShadow: SHADOW_GOLD_SM,
              }}
            >
              <span className="text-2xl text-white" style={{ fontFamily: FONT_HEAD }}>
                {"\u05DE"}
              </span>
            </div>

            <div
              className="flex flex-col justify-between py-px"
              style={{ height: 62 }}
            >
              {LOGO_LINES.map(function (line, i) {
                return (
                  <motion.span
                    key={line}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.25 + i * 0.09,
                    }}
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 300,
                      fontSize: 16,
                      lineHeight: 1,
                      letterSpacing: "0.06em",
                      color: i === 2 ? GOLD.base : BG.text,
                    }}
                  >
                    {line}
                  </motion.span>
                );
              })}
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
              borderRadius: R.sm,
              background: GOLD_GRADIENT,
              boxShadow: SHADOW_GOLD_SM,
            }}
          >
            {"\u05D4\u05E8\u05E9\u05DE\u05D4"}
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}

/* ==================================================================
   WHATSAPP GLYPH
================================================================== */
const WA_HREF = "https://wa.me/972500000000";

const WA_PATH =
  "M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.06 4.49.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.75-.71 2-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z";

function WhatsAppGlyph(props: { color: string; size: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={props.color}
      style={{ width: props.size, height: props.size }}
      aria-hidden="true"
    >
      <path d={WA_PATH} />
    </svg>
  );
}

/* ==================================================================
   FLOATING WHATSAPP - GOLD, morphs into dock slot 1
================================================================== */
function FloatingWhatsApp(props: { docked: boolean }) {
  const [hot, setHot] = useState(false);

  return (
    <AnimatePresence>
      {!props.docked && (
        <motion.div
          className="fixed left-4 z-[60] sm:left-7"
          style={{ bottom: 108 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2.5">
            <motion.a
              layoutId="wa-morph"
              transition={MORPH}
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              onHoverStart={function () {
                setHot(true);
              }}
              onHoverEnd={function () {
                setHot(false);
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative grid place-items-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: R.pill,
                background: GOLD_GRADIENT,
                boxShadow: SHADOW_GOLD_FLOAT,
              }}
            >
              <motion.span
                layoutId="wa-morph-icon"
                transition={MORPH}
                className="grid place-items-center"
              >
                <WhatsAppGlyph color="#FFFFFF" size={26} />
              </motion.span>

              <motion.span
                animate={{ scale: [1, 1.3, 1], opacity: [0.32, 0, 0.32] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
                style={{
                  borderRadius: R.pill,
                  border: "1px solid " + GOLD.base,
                }}
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
                    borderRadius: R.sm,
                    color: BG.text,
                    background: "rgba(36,51,73,0.94)",
                    backdropFilter: "blur(14px)",
                    border: BORDER_GOLD_STRONG,
                    boxShadow: "0 8px 26px rgba(0,0,0,0.3)",
                  }}
                >
                  {"\u05E0\u05D3\u05D1\u05E8? \u05D0\u05E0\u05D7\u05E0\u05D5 \u05DB\u05D0\u05DF"}
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
   BOTTOM DOCK - fixed bottom-0 w-full z-50
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
  {
    key: "wa",
    label: "\u05D9\u05D9\u05E2\u05D5\u05E5",
    href: WA_HREF,
    external: true,
    isWA: true,
  },
  {
    key: "loc",
    label: "\u05DE\u05D4 \u05E7\u05D5\u05E8\u05D4 \u05E4\u05D4",
    icon: MapPin,
    href: "#tracks",
  },
  {
    key: "home",
    label: "\u05D1\u05D9\u05EA",
    icon: Home,
    href: "#hero",
    center: true,
  },
  {
    key: "act",
    label: "\u05DE\u05D4\u05E4\u05E2\u05D9\u05DC\u05D5\u05EA",
    icon: Sparkles,
    href: "#faq",
  },
  {
    key: "shop",
    label: "\u05D7\u05E0\u05D5\u05EA",
    icon: ShoppingBag,
    href: "https://swiwgi-zu.myshopify.com/",
    external: true,
  },
];

function BottomDock(props: { docked: boolean }) {
  const [hot, setHot] = useState<string | null>(null);

  return (
    <motion.nav
      dir="rtl"
      aria-label="Main navigation"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
      className="fixed bottom-0 left-0 w-full z-50"
      style={{
        background: "rgba(36,51,73,0.92)",
        backdropFilter: "blur(22px) saturate(150%)",
        borderTop: BORDER_GOLD_SOFT,
        boxShadow: "0 -8px 34px rgba(0,0,0,0.28)",
      }}
    >
      <ul className="mx-auto flex max-w-3xl items-end justify-between gap-1 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 sm:gap-2 sm:px-8">
        {DOCK.map(function (item, i) {
          const Icon = item.icon;
          const lit = hot === item.key;

          if (item.isWA) {
            return (
              <li key={item.key} className="flex-1">
                <div className="relative flex flex-col items-center gap-1.5 px-1 py-2">
                  {props.docked ? (
                    <motion.a
                      layoutId="wa-morph"
                      transition={MORPH}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      onHoverStart={function () {
                        setHot(item.key);
                      }}
                      onHoverEnd={function () {
                        setHot(null);
                      }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      className="grid place-items-center"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: R.sm,
                        background: lit ? GOLD_A24 : "transparent",
                        boxShadow: "none",
                      }}
                    >
                      <motion.span
                        layoutId="wa-morph-icon"
                        transition={MORPH}
                        className="grid place-items-center"
                      >
                        <WhatsAppGlyph
                          color={lit ? GOLD.base : BG.mute}
                          size={19}
                        />
                      </motion.span>
                    </motion.a>
                  ) : (
                    <div style={{ width: 34, height: 34 }} aria-hidden="true" />
                  )}

                  <motion.span
                    animate={{ opacity: props.docked ? 1 : 0.3 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="whitespace-nowrap text-[10px] sm:text-[11px]"
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      color: lit ? GOLD.base : BG.mute,
                    }}
                  >
                    {item.label}
                  </motion.span>
                </div>
              </li>
            );
          }

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
                  onHoverStart={function () {
                    setHot(item.key);
                  }}
                  onHoverEnd={function () {
                    setHot(null);
                  }}
                  onClick={function (e) {
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
                      borderRadius: R.pill,
                      background: GOLD_GRADIENT,
                      boxShadow: SHADOW_GOLD_MD,
                      border: "3px solid rgba(36,51,73,0.95)",
                    }}
                  >
                    {Icon ? (
                      <Icon
                        strokeWidth={2.2}
                        width={23}
                        height={23}
                        color="#ffffff"
                      />
                    ) : null}
                  </span>
                  <span
                    className="whitespace-nowrap text-[10px] sm:text-[11px]"
                    style={{
                      fontFamily: FONT_BODY,
                      fontWeight: 700,
                      color: GOLD.base,
                    }}
                  >
                    {item.label}
                  </span>
                </motion.a>
              </motion.li>
            );
          }

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
                onHoverStart={function () {
                  setHot(item.key);
                }}
                onHoverEnd={function () {
                  setHot(null);
                }}
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
                    borderRadius: R.sm,
                    background: lit ? GOLD_A24 : "transparent",
                  }}
                >
                  {Icon ? (
                    <Icon
                      strokeWidth={1.9}
                      width={19}
                      height={19}
                      color={lit ? GOLD.base : BG.mute}
                    />
                  ) : null}
                </span>
                <span
                  className="whitespace-nowrap text-[10px] transition-colors duration-500 sm:text-[11px]"
                  style={{
                    fontFamily: FONT_BODY,
                    fontWeight: 500,
                    color: lit ? GOLD.base : BG.mute,
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
function Reveal(props: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: props.y === undefined ? 14 : props.y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.2, ease: EASE, delay: props.delay || 0 }}
      className={props.className || ""}
    >
      {props.children}
    </motion.div>
  );
}

function GoldRule(props: { delay?: number; w?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: EASE, delay: props.delay || 0 }}
      style={{
        originX: 1,
        width: props.w || "100%",
        height: 1,
        background: GOLD_GRADIENT,
      }}
    />
  );
}

function SectionLabel(props: { kicker: string; title: string }) {
  return (
    <div className="mb-12 sm:mb-16">
      <Reveal>
        <span
          className="text-[11px] tracking-[0.32em]"
          style={{ fontFamily: FONT_BODY, fontWeight: 700, color: GOLD.base }}
        >
          {props.kicker}
        </span>
      </Reveal>
      <Reveal delay={0.1}>
        <h2
          className="mt-3 text-[30px] leading-[1.14] sm:text-5xl lg:text-[56px]"
          style={{ fontFamily: FONT_HEAD, color: BG.text }}
        >
          {props.title}
        </h2>
      </Reveal>
      <div className="mt-6">
        <GoldRule delay={0.2} w="88px" />
      </div>
    </div>
  );
}

/* ==================================================================
   HERO - single clean 9:16 vertical video placeholder
================================================================== */
type WeeklyVideo = { src?: string; poster?: string; caption?: string };

function HeroSection(props: { video?: WeeklyVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(function () {
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

  const hasSrc = !!(props.video && props.video.src);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-32 pt-28 sm:px-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        className="relative w-full max-w-[300px] sm:max-w-[340px]"
      >
        <div
          className="pointer-events-none absolute -inset-5 blur-3xl"
          style={{ background: GOLD_A12, borderRadius: R.card }}
        />

        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: "9 / 16",
            borderRadius: R.card,
            border: BORDER_GOLD_CARD,
            background: BG.pageSoft,
            boxShadow: "0 28px 70px rgba(0,0,0,0.42)",
          }}
        >
          {hasSrc ? (
            <video
              ref={ref}
              src={props.video ? props.video.src : undefined}
              poster={props.video ? props.video.poster : undefined}
              playsInline
              muted
              loop
              onClick={toggle}
              className="h-full w-full cursor-pointer object-cover"
            />
          ) : (
            <button
              onClick={toggle}
              className="flex h-full w-full flex-col items-center justify-center gap-5"
              style={{
                background:
                  "linear-gradient(160deg, #243349 0%, #1E293B 60%, #243349 100%)",
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="grid place-items-center"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: R.pill,
                  background: GOLD_GRADIENT,
                  boxShadow: SHADOW_GOLD_PLAY,
                }}
              >
                <Play
                  fill="#ffffff"
                  strokeWidth={0}
                  className="h-6 w-6 translate-x-px"
                />
              </motion.span>
              <span
                className="px-8 text-center text-[12px] leading-relaxed"
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  color: GOLD.light,
                }}
              >
                {"\u05D4\u05E2\u05D3\u05DB\u05D5\u05DF \u05D4\u05E9\u05D1\u05D5\u05E2\u05D9"}
              </span>
            </button>
          )}

          <div
            className="absolute right-3 top-3 flex items-center gap-1.5 px-2.5 py-1"
            style={{
              borderRadius: R.sm,
              background: "rgba(30,41,59,0.82)",
              backdropFilter: "blur(10px)",
              border: BORDER_GOLD_STRONG,
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                width: 6,
                height: 6,
                borderRadius: R.pill,
                background: GOLD.base,
              }}
            />
            <span
              className="text-[9px] tracking-[0.16em]"
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 700,
                color: GOLD.light,
              }}
            >
              {"\u05D4\u05E9\u05D1\u05D5\u05E2"}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.a
        href="#form"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.3, ease: EASE, delay: 0.55 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        className="group mt-10 inline-flex items-center gap-3 px-9 py-4 text-white sm:px-11"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 16,
          borderRadius: R.sm,
          background: GOLD_GRADIENT,
          boxShadow: SHADOW_GOLD_LG,
        }}
      >
        {"\u05DC\u05D4\u05E8\u05E9\u05DE\u05D4 \u05DC\u05D9\u05E9\u05D9\u05D1\u05D4"}
        <ArrowLeft
          strokeWidth={2.2}
          className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
        />
      </motion.a>
    </section>
  );
}
/

/* ==================================================================
   MARQUEES
================================================================== */
function MarqueeBand(props: {
  text: string;
  reverse?: boolean;
  duration?: number;
  filled?: boolean;
}) {
  const line = props.text.repeat(6);
  const dur = props.duration || 48;
  const xFrom = props.reverse ? "-50%" : "0%";
  const xTo = props.reverse ? "0%" : "-50%";

  return (
    <div
      className="w-full overflow-hidden py-4 sm:py-5"
      style={{
        background: props.filled ? GOLD_GRADIENT : "transparent",
        borderTop: BORDER_GOLD_SOFT,
        borderBottom: BORDER_GOLD_SOFT,
      }}
    >
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: [xFrom, xTo] }}
        transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map(function (k) {
          return (
            <span
              key={k}
              className="px-2 text-lg sm:text-2xl lg:text-[28px]"
              style={{
                fontFamily: FONT_HEAD,
                color: props.filled ? "#1E293B" : GOLD.light,
                opacity: props.filled ? 0.92 : 0.6,
              }}
            >
              {line}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

const MARQ_1 =
  "\u05DC\u05DC\u05DE\u05D5\u05D3 \u05D1\u05DC\u05D1 \u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD \u2013 \u05D5\u05DC\u05D4\u05E9\u05E4\u05D9\u05E2 \u05E2\u05DC \u05DC\u05D1 \u05D9\u05E8\u05D5\u05E9\u05DC\u05D9\u05DD \u00B7 ";
const MARQ_2 =
  "\u05DE\u05E1\u05DC\u05D5\u05DC \u05D0\u05D9\u05E9\u05D9 \u00B7 \u05DC\u05D9\u05D5\u05D5\u05D9 \u05D7\u05E1\u05D9\u05D3\u05D9 \u00B7 \u05D4\u05DB\u05E0\u05D4 \u05DC\u05D7\u05D9\u05D9\u05DD \u00B7 ";

function ScrollMarquees() {
  return (
    <div className="relative z-10">
      <MarqueeBand text={MARQ_1} duration={54} />
      <MarqueeBand text={MARQ_2} reverse duration={46} filled />
    </div>
  );
}

/* ==================================================================
   BENTO GRID - clean white cards, rounded corners
================================================================== */
type Track = { num: string; title: string; body: string };

const TRACKS: Track[] = [
  {
    num: "01",
    title:
      "\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05DC\u05D9\u05DE\u05D5\u05D3\u05D9 \u05D4\u05DE\u05DC\u05D0 \u2013 \u05E9\u05E0\u05EA\u05D9\u05D9\u05DD",
    body:
      "\u05DC\u05D9\u05DE\u05D5\u05D3 \u05EA\u05D5\u05E8\u05D4 \u05D5\u05D7\u05E1\u05D9\u05D3\u05D5\u05EA, \u05E2\u05D1\u05D5\u05D3\u05EA \u05D4', \u05E1\u05D3\u05E8 \u05D9\u05D5\u05DD \u05D9\u05E9\u05D9\u05D1\u05EA\u05D9, \u05DC\u05D9\u05D5\u05D5\u05D9 \u05D0\u05D9\u05E9\u05D9 \u05D5\u05D4\u05DB\u05E0\u05D4 \u05DE\u05E2\u05E9\u05D9\u05EA \u05D5\u05E8\u05D5\u05D7\u05E0\u05D9\u05EA \u05DC\u05D4\u05DE\u05E9\u05DA \u05D4\u05D7\u05D9\u05D9\u05DD.",
  },
  {
    num: "02",
    title:
      "\u05D7\u05E6\u05D9 \u05D9\u05D5\u05DD \u05DC\u05D9\u05DE\u05D5\u05D3 \u05D5\u05D7\u05E6\u05D9 \u05D9\u05D5\u05DD \u05E2\u05D1\u05D5\u05D3\u05D4 \u2013 3 \u05E9\u05E0\u05D9\u05DD",
    body:
      "\u05E9\u05D9\u05DC\u05D5\u05D1 \u05D1\u05D9\u05DF \u05E2\u05D1\u05D5\u05D3\u05D4 \u05DC\u05DE\u05E1\u05D2\u05E8\u05EA \u05D9\u05E9\u05D9\u05D1\u05EA\u05D9\u05EA. \u05E9\u05D9\u05DC\u05D5\u05D1 \u05D1\u05D9\u05DF \u05D2\u05E9\u05DE\u05D9\u05D5\u05EA \u05DC\u05E8\u05D5\u05D7\u05E0\u05D9\u05D5\u05EA.",
  },
  {
    num: "03",
    title:
      "\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05D0\u05E7\u05E1\u05D8\u05E8\u05E0\u05D9",
    body:
      "\u05DC\u05D1\u05D7\u05D5\u05E8\u05D9\u05DD \u05E9\u05DE\u05E2\u05D5\u05E0\u05D9\u05D9\u05E0\u05D9\u05DD \u05DC\u05DC\u05DE\u05D5\u05D3 \u05D1\u05D9\u05E9\u05D9\u05D1\u05D4 \u05D0\u05DA \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05DC\u05D4\u05EA\u05D2\u05D5\u05E8\u05E8 \u05D1\u05D1\u05D9\u05EA. \u05D7\u05D1\u05E8\u05D5\u05EA\u05D5\u05EA \u05E7\u05D1\u05D5\u05E2\u05D5\u05EA \u05D5\u05D4\u05E9\u05EA\u05EA\u05E4\u05D5\u05EA \u05D1\u05D7\u05D9\u05D9 \u05D4\u05D7\u05D1\u05E8\u05D4.",
  },
  {
    num: "04",
    title:
      "\u05DE\u05E1\u05DC\u05D5\u05DC \u05D4\u05E9\u05DC\u05D5\u05D7\u05D9\u05DD",
    body:
      "\u05D1\u05D7\u05D5\u05E8\u05D9\u05DD \u05DC\u05DE\u05D3\u05E0\u05D9\u05DD \u05E9\u05D4\u05D2\u05D9\u05E2\u05D5 \u05DE\u05BE770. \u05DC\u05D9\u05D5\u05D5\u05D9 \u05D0\u05D9\u05E9\u05D9 \u05D5\u05DC\u05D9\u05DE\u05D5\u05D3 \u05E2\u05DD \u05D4\u05D1\u05D7\u05D5\u05E8\u05D9\u05DD.",
  },
];

function TrackCard(props: { track: Track; i: number }) {
  const [hot, setHot] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}transition={{ duration: 1.2, ease: EASE, delay: (props.i % 2) * 0.08 }}
      onHoverStart={function () {
        setHot(true);
      }}
      onHoverEnd={function () {
        setHot(false);
      }}
      whileHover={{ y: -5 }}
      className="group relative h-full overflow-hidden p-7 sm:p-9"
      style={{
        borderRadius: R.card,
        background: hot ? CARD.solid : CARD.glass,
        border: hot ? BORDER_GOLD_CARD : BORDER_CARD_LINE,
        boxShadow: hot
          ? "0 26px 60px rgba(0,0,0,0.34)"
          : "0 10px 30px rgba(0,0,0,0.2)",
        transition:
          "background 0.7s ease, border-color 0.7s ease, box-shadow 0.7s ease",
      }}
    >
      <motion.div
        animate={{ scaleX: hot ? 1 : 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="absolute inset-x-0 top-0 h-[3px]"
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
          {props.track.num}
        </span>
        <motion.span
          animate={{ width: hot ? 40 : 22, opacity: hot ? 1 : 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-4 h-px shrink-0"
          style={{ background: GOLD_GRADIENT }}
        />
      </div>

      <h3
        className="mt-6 text-[21px] leading-[1.28] sm:text-[26px]"
        style={{ fontFamily: FONT_HEAD, color: "#1E293B" }}
      >
        {props.track.title}
      </h3>

      <p
        className="mt-4 text-[14px] leading-[1.9] sm:text-[15px]"
        style={{ fontFamily: FONT_BODY, fontWeight: 400, color: "#475569" }}
      >
        {props.track.body}
      </p>
    </motion.div>
  );
}

const TRACKS_KICKER = "\u05D4\u05DE\u05E1\u05DC\u05D5\u05DC\u05D9\u05DD";
const TRACKS_TITLE =
  "\u05D3\u05E8\u05DA \u05D0\u05D9\u05E9\u05D9\u05EA \u05DC\u05DB\u05DC \u05D1\u05D7\u05D5\u05E8";

function TracksSection() {
  return (
    <section
      id="tracks"
      className="relative z-10 px-5 py-24 sm:px-10 sm:py-32 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel kicker={TRACKS_KICKER} title={TRACKS_TITLE} />
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          {TRACKS.map(function (t, i) {
            return <TrackCard key={t.num} track={t} i={i} />;
          })}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   FAQ - clean card panel
================================================================== */
const FAQS = [
  {
    q: "\u05D4\u05E7\u05DE\u05E4\u05D5\u05E1 \u05D5\u05D4\u05E4\u05E0\u05D9\u05DE\u05D9\u05D9\u05D4",
    a:
      "\u05E4\u05E0\u05D9\u05DE\u05D9\u05D9\u05D4 \u05DE\u05E8\u05D5\u05D5\u05D7\u05EA, \u05D7\u05D3\u05E8\u05D9\u05DD \u05DE\u05DE\u05D5\u05D6\u05D2\u05D9\u05DD, \u05DE\u05D9\u05D8\u05D4 \u05D5\u05D0\u05E8\u05D5\u05DF \u05D0\u05D9\u05E9\u05D9. \u05DE\u05E7\u05D5\u05D5\u05D4 \u05D8\u05D4\u05E8\u05D4 \u05DE\u05E9\u05D5\u05E4\u05E6 \u05D1\u05E7\u05DE\u05E4\u05D5\u05E1.",
  },
  {
    q: "\u05E9\u05DC\u05D5\u05E9 \u05D0\u05E8\u05D5\u05D7\u05D5\u05EA \u05D1\u05D9\u05D5\u05DD",
    a:
      "\u05D8\u05D1\u05D7 \u05E6\u05DE\u05D5\u05D3 \u05D1\u05DE\u05E7\u05D5\u05DD. \u05D0\u05E8\u05D5\u05D7\u05D5\u05EA \u05DE\u05D5\u05D2\u05E9\u05D5\u05EA \u05D1\u05D0\u05D5\u05E4\u05DF \u05DE\u05E1\u05D5\u05D3\u05E8.",
  },
  {
    q: "\u05D4\u05D7\u05D9\u05D9\u05DD \u05D4\u05D7\u05E1\u05D9\u05D3\u05D9\u05D9\u05DD",
    a:
      "\u05DC\u05D9\u05DE\u05D5\u05D3 \u05D7\u05E1\u05D9\u05D3\u05D5\u05EA, \u05D4\u05EA\u05D5\u05D5\u05E2\u05D3\u05D5\u05D9\u05D5\u05EA, \u05E9\u05D1\u05EA\u05D5\u05EA \u05DE\u05E9\u05D5\u05EA\u05E4\u05D5\u05EA \u05D5\u05E7\u05E9\u05E8 \u05E2\u05DD \u05DE\u05E9\u05E4\u05D9\u05E2\u05D9\u05DD.",
  },
];

const FAQ_KICKER =
  "\u05E9\u05D0\u05DC\u05D5\u05EA \u05D5\u05EA\u05E9\u05D5\u05D1\u05D5\u05EA";
const FAQ_TITLE =
  "\u05DE\u05D4 \u05E9\u05D7\u05E9\u05D5\u05D1 \u05DC\u05D3\u05E2\u05EA";

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative z-10 px-5 pb-24 sm:px-10 sm:pb-32 lg:px-16"
    >
      <div className="mx-auto max-w-4xl">
        <SectionLabel kicker={FAQ_KICKER} title={FAQ_TITLE} />

        <div
          className="overflow-hidden"
          style={{
            borderRadius: R.card,
            background: CARD.glass,
            border: BORDER_CARD_LINE,
            boxShadow: "0 18px 50px rgba(0,0,0,0.24)",
          }}
        >
          {FAQS.map(function (f, i) {
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
                    i !== FAQS.length - 1 ? BORDER_SLATE : "none",
                }}
              >
                <button
                  onClick={function () {
                    setOpen(on ? null : i);
                  }}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-5 px-6 py-6 text-right outline-none transition-colors duration-500 sm:px-9 sm:py-7"
                  style={{ background: on ? GOLD_A12 : "transparent" }}
                >
                  <span
                    className="text-[19px] leading-tight transition-colors duration-500 sm:text-[25px]"
                    style={{
                      fontFamily: FONT_HEAD,
                      color: on ? GOLD.dark : "#1E293B",
                    }}
                  >
                    {f.q}
                  </span>

                  <motion.span
                    animate={{ rotate: on ? 45 : 0 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="grid h-9 w-9 shrink-0 place-items-center"
                    style={{
                      borderRadius: R.sm,
                      background: on ? GOLD_GRADIENT : GOLD_A12,
                      border: on ? BORDER_TRANSPARENT : BORDER_GOLD_STRONG,
                    }}
                  >
                    <Plus
                      strokeWidth={2}
                      className="h-4 w-4"
                      style={{ color: on ? "#ffffff" : GOLD.deep }}
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
                          color: "#475569",
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
   FORM - clean card wrapper
================================================================== */
function Field(props: {
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
      transition={{ duration: 1.1, ease: EASE, delay: props.delay || 0 }}
      className="relative"
    >
      <label
        htmlFor={props.id}
        className="mb-2.5 block text-[11px] tracking-[0.16em] transition-colors duration-500"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 700,
          color: focus ? GOLD.deep : "#64748B",
        }}
      >
        {props.label}
      </label>

      <input
        id={props.id}
        name={props.id}
        type={props.type || "text"}
        inputMode={props.inputMode}
        required
        autoComplete="off"
        value={props.value}
        onChange={function (e) {
          props.onChange(e.target.value);
        }}
        onFocus={function () {
          setFocus(true);
        }}
        onBlur={function () {
          setFocus(false);
        }}
        className="w-full px-4 py-3.5 outline-none sm:px-5 sm:py-4"
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 17,
          color: "#1E293B",
          caretColor: GOLD.base,
          borderRadius: R.sm,
          background: focus ? "#FFFFFF" : "#F8FAFC",
          border: focus ? BORDER_INPUT_FOCUS : BORDER_INPUT,
          boxShadow: focus ? SHADOW_INPUT_FOCUS : "0 2px 10px rgba(0,0,0,0.04)",
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

const FORM_KICKER = "\u05D4\u05E8\u05E9\u05DE\u05D4";
const FORM_H_1 = "\u05D4\u05DE\u05E7\u05D5\u05DD \u05E9\u05DC\u05DA \u05DC\u05D2\u05D3\u05D5\u05DC, ";
const FORM_H_GOLD =
  "\u05DC\u05D4\u05EA\u05E7\u05D3\u05DD \u05D5\u05DC\u05D1\u05E0\u05D5\u05EA";
const FORM_H_2 =
  " \u05D0\u05EA \u05D4\u05E2\u05EA\u05D9\u05D3 \u05E9\u05DC\u05DA.";
const LBL_NAME = "\u05E9\u05DD \u05DE\u05DC\u05D0";
const LBL_AGE = "\u05D2\u05D9\u05DC";
const LBL_PHONE = "\u05DE\u05E1\u05E4\u05E8 \u05D8\u05DC\u05E4\u05D5\u05DF";
const BTN_SEND =
  "\u05E9\u05DC\u05D9\u05D7\u05EA \u05E4\u05E8\u05D8\u05D9\u05DD";
const NOTE_PRIVACY =
  "\u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05E0\u05E9\u05DE\u05E8\u05D9\u05DD \u05D1\u05E1\u05D5\u05D3\u05D9\u05D5\u05EA. \u05E0\u05D7\u05D6\u05D5\u05E8 \u05D0\u05DC\u05D9\u05DA \u05D1\u05D4\u05E7\u05D3\u05DD.";
const SENT_TITLE =
  "\u05D4\u05E4\u05E8\u05D8\u05D9\u05DD \u05E0\u05E9\u05DC\u05D7\u05D5 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4";
const SENT_BODY =
  "\u05E0\u05D9\u05E6\u05D5\u05E8 \u05D0\u05D9\u05EA\u05DA \u05E7\u05E9\u05E8 \u05D1\u05E7\u05E8\u05D5\u05D1. \u05EA\u05D5\u05D3\u05D4 \u05E9\u05E4\u05E0\u05D9\u05EA \u05D0\u05DC\u05D9\u05E0\u05D5.";
const SIGN_OFF =
  "\u05D9\u05D7\u05D9 \u05D0\u05D3\u05D5\u05E0\u05D9\u05E0\u05D5 \u05DE\u05D5\u05E8\u05D9\u05E0\u05D5 \u05D5\u05E8\u05D1\u05D9\u05E0\u05D5 \u05DE\u05DC\u05DA \u05D4\u05DE\u05E9\u05D9\u05D7 \u05DC\u05E2\u05D5\u05DC\u05DD \u05D5\u05E2\u05D3";

function FormSection() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const submit = function (e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to your API route / CRM
    console.log("FORM", { name: name, age: age, phone: phone });
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
            border: BORDER_CARD_LINE,
            boxShadow: "0 28px 76px rgba(0,0,0,0.32)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[3px]"
            style={{ background: GOLD_GRADIENT }}
          />

          <div
            className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 blur-[100px]"
            style={{ background: GOLD_A18 }}
          />

          <Reveal>
            <span
              className="relative text-[11px] tracking-[0.32em]"
              style={{
                fontFamily: FONT_BODY,
                fontWeight: 700,
                color: GOLD.deep,
              }}
            >
              {FORM_KICKER}
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              className="relative mt-4 max-w-[20ch] text-[30px] leading-[1.16] sm:text-5xl lg:text-[54px]"
              style={{ fontFamily: FONT_HEAD, color: "#1E293B" }}
            >
              {FORM_H_1}
              <span
                style={{
                  background: GOLD_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {FORM_H_GOLD}
              </span>
              {FORM_H_2}
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
                    label={LBL_NAME}
                    value={name}
                    onChange={setName}
                    delay={0}
                  />
                  <Field
                    id="age"
                    label={LBL_AGE}
                    value={age}
                    onChange={setAge}
                    inputMode="numeric"
                    delay={0.08}
                  />
                  <Field
                    id="phone"
                    label={LBL_PHONE}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={setPhone}
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
                      boxShadow: SHADOW_GOLD_LG,
                    }}
                  >
                    {BTN_SEND}
                    <Send
                      strokeWidth={2.2}
                      className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1"
                    />
                  </motion.button>

                  <p
                    className="max-w-[30ch] text-[12px] leading-relaxed"
                    style={{ fontFamily: FONT_BODY, color: "#64748B" }}
                  >
                    {NOTE_PRIVACY}
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
                  background: GOLD_A12,
                  border: BORDER_GOLD_STRONG,
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
                    boxShadow: SHADOW_GOLD_MD,
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
                    {SENT_TITLE}
                  </h3>
                  <p
                    className="mt-2 text-[14px] leading-relaxed sm:text-base"
                    style={{ fontFamily: FONT_BODY, color: "#475569" }}
                  >
                    {SENT_BODY}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          className="mt-12 text-center text-[11px] tracking-[0.22em]"
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            color: GOLD_LIGHT_A50,
          }}
        >
          {SIGN_OFF}
        </motion.p>
      </div>
    </section>
  );
}

/* ==================================================================
   MAIN CONTENT
================================================================== */
function MainContent(props: { video?: WeeklyVideo }) {
  return (
    <main className="relative w-full" style={{ background: BG.page }}>
      <HeroSection video={props.video} />
      <ScrollMarquees />
      <TracksSection />
      <FAQSection />
      <FormSection />
    </main>
  );
}

/* ==================================================================
   GLOBAL CSS - built with concatenation, zero backticks
================================================================== */
const GLOBAL_CSS =
  "html, body { background: " +
  BG.page +
  "; } " +
  "::selection { background: rgba(212,175,55,0.25); color: #1E293B; } " +
  "input::placeholder { color: #94A3B8; } " +
  "@media (prefers-reduced-motion: reduce) { *, *::before, *::after { " +
  "animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }";

/* ==================================================================
   PAGE - BottomDock is the last element. Nothing below it.
================================================================== */
export default function Page() {
  const state = useScrollState();

  const weeklyVideo: WeeklyVideo = useMemo(function () {
    return {
      // src: "/videos/hero.mp4",
      // poster: "/videos/hero-poster.jpg",
      caption: "weekly",
    };
  }, []);

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen antialiased"
      style={{ fontFamily: FONT_BODY, color: BG.text, background: BG.page }}
    >
      <style>{GLOBAL_CSS}</style>

      <AmbientFloaters section={state.section} />
      <TopHeader />

      <SmoothScrollProvider>
        <MainContent video={weeklyVideo} />
      </SmoothScrollProvider>

      <LayoutGroup>
        <FloatingWhatsApp docked={state.docked} />
        <BottomDock docked={state.docked} />
      </LayoutGroup>
    </div>
  );
                }
