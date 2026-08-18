"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useInView,
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
  Plus,
  ArrowLeft,
  Send,
  Check,
  type LucideIcon,
} from "lucide-react";

/* ================================================================== */
/*  SMOOTH SCROLL PROVIDER                                             */
/*  Heavy "buttery" scroll simulated by translating the content         */
/*  wrapper with a critically-damped spring that lags behind the        */
/*  native scroll position. A spacer div preserves real scrollbar       */
/*  height so useScroll() and anchor links keep working natively.       */
/* ================================================================== */

/* Helper: invert a MotionValue (scroll down → move content up) */
function useNegative(mv: ReturnType<typeof useSpring>) {
  const out = useMotionValue(0);
  useMotionValueEvent(mv, "change", (v) => out.set(-v));
  return out;
}

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

  const translateY = useNegative(smoothY);

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
        rawY.set(y);
        if (prefersReduced) smoothY.jump(y);
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
        <motion.div ref={contentRef} style={{ y: translateY, willChange: "transform" }}>
          {children}
        </motion.div>
      </div>

      {/* Spacer that generates the real scrollbar */}
      <div style={{ height: contentHeight }} aria-hidden="true" />
    </>
  );
}

/* ================================================================== */
/*  BOTTOM DOCK                                                        */
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
            <motion.li key={item.label} variants={dockItemVariants} className="flex-1">
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
                    className="absolute bottom-0 right-0 left-0 h-[3px] bg-amber-700"
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
/*  FLOATING MASCOT                                                    */
/* ================================================================== */
function FloatingMascot() {
  const { scrollY } = useScroll();
  const [facing, setFacing] = useState<1 | -1>(1);
  const [imgFailed, setImgFailed] = useState(false);
  const lastScroll = useRef(0);
  const jumpControls = useAnimationControls();
  const isJumping = useRef(false);

  /* --- Scroll direction tracker --- */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastScroll.current;
    if (Math.abs(delta) < 2) return; // dead-zone kills jitter
    setFacing(delta > 0 ? 1 : -1);
    lastScroll.current = latest;
  });

  /* --- Tap → jump + rotate --- */
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
        {/* Layer 2: IDLE BOB (infinite declarative loop) */}
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
                style={{ filter: "drop-shadow(5px 7px 0px rgba(2,6,23,0.28))" }}
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
/*  SHARED: Staggered word-split text                                  */
/* ================================================================== */
const wordContainer: Variants = {
  hidden: {},
  show: (delay: number = 0) => ({
    transition: { staggerChildren: 0.055, delayChildren: delay },
  }),
};

const wordItem: Variants = {
  hidden: { y: "115%", opacity: 0, rotate: 3 },
  show: {
    y: "0%",
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.7 },
  },
};

function SplitWords({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const MotionTag = motion(Tag as any);
  return (
    <MotionTag
      variants={wordContainer}
      custom={delay}
      initial="hidden"
      animate="show"
      className={className}
      aria-label={text}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom pb-[0.08em]"
        >
          <motion.span variants={wordItem} className={`inline-block ${wordClassName}`}>
            {word}
            {"\u00A0"}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ================================================================== */
/*  SHARED: Section heading with brutalist index rule                  */
/* ================================================================== */
function SectionLabel({ index, title }: { index: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className="mb-12 sm:mb-16">
      <div className="flex items-center gap-4">
        <span className="border-2 border-slate-950 bg-slate-950 px-2 py-1 text-[11px] font-black tracking-[0.2em] text-amber-700">
          {index}
        </span>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 1 }}
          className="h-[3px] flex-1 bg-slate-950"
        />
      </div>
      <h2 className="mt-5 text-3xl font-black leading-[0.95] tracking-tighter text-slate-950 sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </div>
  );
}

/* ================================================================== */
/*  HERO SECTION — scroll-driven pin + scale/fade exit                 */
/* ================================================================== */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);

  // Progress across the 200vh track: 0 = pinned at top, 1 = fully released
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Pin: translate the inner stage down as the track scrolls past
  const pinY = useTransform(scrollYProgress, [0, 1], ["0vh", "100vh"]);

  // Exit choreography
  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 0.82]);
  const opacity = useTransform(scrollYProgress, [0, 0.55, 0.8], [1, 1, 0]);
  const blurPx = useTransform(scrollYProgress, [0, 0.8], [0, 7]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section ref={ref} className="relative h-[200vh] w-full">
      <motion.div
        style={{ y: pinY }}
        className="absolute inset-x-0 top-0 h-screen overflow-hidden"
      >
        {/* Parallax grid backdrop */}
        <motion.div
          style={{
            y: gridY,
            backgroundImage: `
              linear-gradient(to right, rgba(2,6,23,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(2,6,23,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "88px 88px",
          }}
          className="pointer-events-none absolute inset-0 -z-10"
        />

        {/* Corner brackets */}
        <div className="pointer-events-none absolute right-5 top-24 h-16 w-16 border-r-4 border-t-4 border-slate-950 sm:right-10 lg:right-16" />
        <div className="pointer-events-none absolute bottom-40 left-5 h-16 w-16 border-b-4 border-l-4 border-amber-700 sm:left-10 lg:left-16" />

        <motion.div
          style={{ scale, opacity, filter, transformOrigin: "50% 42%" }}
          className="flex h-full flex-col justify-center px-5 pb-32 sm:px-10 lg:px-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 self-start border-2 border-slate-950 bg-[#F8FAFC] px-3 py-1.5 shadow-[4px_4px_0px_0px_#020617]"
          >
            <span className="text-[10px] font-black tracking-[0.18em] text-slate-950 sm:text-xs">
              [ שנת הלימודים ה'תשפ״ז • ירושלים ]
            </span>
          </motion.div>

          {/* H1 */}
          <h1 className="max-w-[16ch] text-[15vw] font-black leading-[0.82] tracking-tighter text-slate-950 sm:text-[10vw] lg:text-[8vw]">
            <SplitWords text="העתיד שלך" delay={0.3} className="block" />
            <SplitWords
              text="מתחיל כאן"
              delay={0.45}
              className="block"
              wordClassName="text-amber-700"
            />
          </h1>

          {/* Rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 1 }}
            className="my-8 h-[5px] w-full max-w-xl bg-slate-950"
          />

          {/* Subtitle */}
          <SplitWords
            as="p"
            text="מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים. בלב ירושלים."
            delay={0.75}
            className="max-w-[34ch] text-lg font-bold leading-snug text-slate-950/70 sm:text-2xl lg:max-w-[42ch]"
          />

          {/* Kinetic CTA */}
          <motion.a
            href="#form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, type: "spring", stiffness: 300, damping: 24 }}
            whileHover={{ y: -4, x: -4 }}
            whileTap={{ y: 0, x: 0, scale: 0.96 }}
            className="group mt-12 inline-flex w-fit items-center gap-3 border-[3px] border-slate-950 bg-slate-950 px-7 py-4 shadow-[4px_4px_0px_0px_#B45309] transition-[box-shadow,background-color] duration-200 hover:bg-amber-700 hover:shadow-[10px_10px_0px_0px_#020617] sm:px-10 sm:py-5"
          >
            <span className="text-lg font-black tracking-tight text-[#F8FAFC] group-hover:text-slate-950 sm:text-2xl">
              [ להרשמה לישיבה ]
            </span>
            <ArrowLeft
              strokeWidth={3}
              className="h-5 w-5 text-amber-700 transition-transform duration-200 group-hover:-translate-x-1.5 group-hover:text-slate-950 sm:h-7 sm:w-7"
            />
          </motion.a>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-36 right-5 flex items-center gap-3 sm:right-10 lg:right-16"
          >
            <span className="text-[10px] font-black tracking-[0.25em] text-slate-950/40">
              SCROLL
            </span>
            <motion.div
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ originY: 0 }}
              className="h-10 w-[3px] bg-amber-700"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/*  SCROLL MARQUEES                                                    */
/* ================================================================== */
function MarqueeBand({
  text,
  direction = "left",
  duration = 26,
  dark = false,
}: {
  text: string;
  direction?: "left" | "right";
  duration?: number;
  dark?: boolean;
}) {
  const repeated = text.repeat(6);
  const from = direction === "left" ? "0%" : "-50%";
  const to = direction === "left" ? "-50%" : "0%";

  return (
    <div
      className={`w-full overflow-hidden border-y-4 border-slate-950 py-4 sm:py-6 ${
        dark ? "bg-slate-950" : "bg-[#F8FAFC]"
      }`}
    >
      <motion.div
        className="flex w-max whitespace-nowrap"
        animate={{ x: [from, to] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((k) => (
          <span
            key={k}
            className={`px-2 text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl ${
              dark ? "text-[#F8FAFC]" : "text-slate-950"
            }`}
          >
            {repeated}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ScrollMarquees() {
  return (
    <div className="relative z-10 -mt-1">
      <MarqueeBand
        text="ללמוד בלב ירושלים – ולהשפיע על לב ירושלים • "
        direction="right"
        duration={30}
      />
      <MarqueeBand
        text="מסלול אישי • ליווי חסידי • הכנה לחיים • "
        direction="left"
        duration={22}
        dark
      />
    </div>
  );
}

/* ================================================================== */
/*  BENTO GRID — pointer-tracked 3D tilt                               */
/* ================================================================== */
type Track = { num: string; title: string; body: string };

const TRACKS: Track[] = [
  {
    num: "01",
    title: "המסלול הלימודי המלא – שנתיים",
    body: "לימוד תורה וחסידות, עבודת ה', סדר יום ישיבתי, ליווי אישי והכנה מעשית ורוחנית להמשך החיים.",
  },
  {
    num: "02",
    title: "מסלול חצי יום לימוד וחצי יום עבודה – 3 שנים",
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

function TiltCard({ track, index }: { track: Track; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springCfg = { stiffness: 260, damping: 20, mass: 0.6 };
  const rotateX = useSpring(rx, springCfg);
  const rotateY = useSpring(ry, springCfg);

  // Glare position
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareX = useSpring(gx, springCfg);
  const glareY = useSpring(gy, springCfg);
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX}% ${glareY}%, rgba(180,83,9,0.14), transparent 70%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    ry.set((px - 0.5) * 13);
    rx.set((0.5 - py) * 13);
    gx.set(px * 100);
    gy.set(py * 100);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 20,
        delay: (index % 2) * 0.09,
      }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onPointerCancel={reset}
        onTapStart={() => rx.set(-6)}
        onTap={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full min-h-[300px] cursor-pointer border-[3px] border-slate-950 bg-white p-6 shadow-[4px_4px_0px_0px_#020617] transition-shadow duration-300 hover:shadow-[10px_10px_0px_0px_#020617] sm:min-h-[340px] sm:p-9"
      >
        {/* Pointer glare */}
        <motion.div
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0"
        />

        {/* Corner tick */}
        <div className="absolute left-0 top-0 h-0 w-0 border-l-[26px] border-t-[26px] border-l-transparent border-t-amber-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div style={{ transform: "translateZ(46px)" }} className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <span className="text-5xl font-black leading-none tracking-tighter text-amber-700 sm:text-7xl">
              {track.num}
            </span>
            <span className="mt-2 h-[3px] w-10 shrink-0 bg-slate-950 transition-all duration-300 group-hover:w-20" />
          </div>

          <h3 className="mt-7 text-xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-3xl">
            {track.title}
          </h3>

          <p className="mt-4 text-sm font-semibold leading-relaxed text-slate-950/65 sm:text-base">
            {track.body}
          </p>

          <div className="mt-auto flex items-center gap-2 pt-7">
            <span className="text-[10px] font-black tracking-[0.22em] text-slate-950/50 transition-colors group-hover:text-amber-700">
              פרטים נוספים
            </span>
            <ArrowLeft
              strokeWidth={3}
              className="h-4 w-4 text-slate-950/50 transition-all duration-300 group-hover:-translate-x-1.5 group-hover:text-amber-700"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BentoGrid() {
  return (
    <section id="about" className="px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
      <SectionLabel index="01" title="המסלולים בישיבה" />
      <div className="grid grid-cols-1 gap-5 sm:gap-7 md:grid-cols-2">
        {TRACKS.map((t, i) => (
          <TiltCard key={t.num} track={t} index={i} />
        ))}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  FAQ ACCORDION                                                      */
/* ================================================================== */
const FAQS = [
  {
    q: "הקמפוס והפנימייה",
    a: "פנימייה מרווחת, חדרים ממוזגים, מיטה וארון אישי. מקווה טהרה משופץ בקמפוס.",
  },
  {
    q: "שלוש ארוחות ביום",
    a: "טבח צמוד במקום. ארוחות מוגשות באופן מסודר.",
  },
  {
    q: "החיים החסידיים",
    a: "לימוד חסידות, התוועדויות, שבתות משותפות וקשר עם משפיעים.",
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="more" className="px-5 pb-24 sm:px-10 sm:pb-32 lg:px-16">
      <SectionLabel index="02" title="שאלות נפוצות" />

      <div className="border-[3px] border-slate-950 bg-white shadow-[6px_6px_0px_0px_#020617]">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={i !== FAQS.length - 1 ? "border-b-[3px] border-slate-950" : ""}
            >
              <motion.button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                whileTap={{ scale: 0.985 }}
                className={`flex w-full items-center justify-between gap-5 p-5 text-right outline-none transition-colors duration-300 focus-visible:ring-4 focus-visible:ring-amber-700/40 sm:p-8 ${
                  isOpen ? "bg-slate-950" : "bg-white hover:bg-slate-950/[0.04]"
                }`}
              >
                <span
                  className={`text-lg font-black leading-tight tracking-tight transition-colors duration-300 sm:text-3xl ${
                    isOpen ? "text-[#F8FAFC]" : "text-slate-950"
                  }`}
                >
                  {faq.q}
                </span>

                {/* + rotates sharply to × */}
                <motion.span
                  animate={{
                    rotate: isOpen ? 135 : 0,
                    backgroundColor: isOpen ? "#B45309" : "#020617",
                  }}
                  transition={{ type: "spring", stiffness: 620, damping: 24 }}
                  className="grid h-9 w-9 shrink-0 place-items-center border-[3px] border-slate-950 sm:h-12 sm:w-12"
                >
                  <Plus strokeWidth={3.5} className="h-5 w-5 text-[#F8FAFC] sm:h-6 sm:w-6" />
                </motion.span>
              </motion.button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.28 },
                    }}
                    className="overflow-hidden bg-slate-950"
                  >
                    <div className="border-t-[3px] border-amber-700 p-5 sm:p-8">
                      <motion.p
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="max-w-[60ch] text-base font-semibold leading-relaxed text-[#F8FAFC]/75 sm:text-xl"
                      >
                        {faq.a}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ================================================================== */
/*  TERMINAL FORM — magnet-hover submit                                */
/* ================================================================== */
function MagnetButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 320, damping: 18, mass: 0.5 };
  const x = useSpring(mx, cfg);
  const y = useSpring(my, cfg);

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el || disabled) return;
    const r = el.getBoundingClientRect();
    // Pull toward pointer, capped at ±10px
    mx.set(Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * 0.32)));
    my.set(Math.max(-10, Math.min(10, (e.clientY - (r.top + r.height / 2)) * 0.32)));
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="submit"
      disabled={disabled}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.94 }}
      className="group relative flex w-full items-center justify-center gap-3 border-[3px] border-[#F8FAFC] bg-amber-700 px-8 py-5 shadow-[6px_6px_0px_0px_#F8FAFC] outline-none transition-[background-color,box-shadow] duration-200 hover:bg-[#F8FAFC] hover:shadow-[12px_12px_0px_0px_#B45309] focus-visible:ring-4 focus-visible:ring-amber-700/50 disabled:opacity-60 sm:w-auto sm:px-14"
    >
      <span className="text-lg font-black tracking-tight text-slate-950 sm:text-2xl">
        {children}
      </span>
      <Send
        strokeWidth={3}
        className="h-5 w-5 text-slate-950 transition-transform duration-200 group-hover:-translate-x-1.5 sm:h-6 sm:w-6"
      />
    </motion.button>
  );
}

function TerminalField({
  id,
  label,
  type = "text",
  value,
  onChange,
  index,
  inputMode,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  index: number;
  inputMode?: "text" | "numeric" | "tel";
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.09 }}
      className="relative"
    >
      <label
        htmlFor={id}
        className={`mb-2 flex items-center gap-2 text-[11px] font-black tracking-[0.2em] transition-colors duration-200 sm:text-xs ${
          focused ? "text-amber-700" : "text-[#F8FAFC]/50"
        }`}
      >
        <span className="text-amber-700">›</span>
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
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-none border-0 border-b-4 border-[#F8FAFC]/25 bg-transparent py-3 text-xl font-black text-[#F8FAFC] caret-amber-700 outline-none transition-colors duration-200 focus:border-amber-700 sm:text-3xl"
      />

      {/* Focus sweep underline */}
      <motion.div
        initial={false}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 1 }}
        className="absolute bottom-0 right-0 left-0 h-[4px] bg-amber-700"
      />
    </motion.div>
  );
}

function TerminalForm() {
  const [form, setForm] = useState({ name: "", age: "", phone: "" });
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to your API route / CRM
    console.log("[YESHIVA_FORM]", form);
    setSent(true);
  };

  return (
    <section id="form" className="px-5 pb-32 sm:px-10 lg:px-16">
      <div className="border-[3px] border-slate-950 bg-slate-950 shadow-[10px_10px_0px_0px_#B45309]">
        {/* Terminal chrome bar */}
        <div className="flex items-center justify-between border-b-[3px] border-[#F8FAFC]/20 px-5 py-3 sm:px-9">
          <span className="text-[10px] font-black tracking-[0.25em] text-amber-700">
            [ הרשמה_לישיבה ]
          </span>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeInOut",
                }}
                className="h-2.5 w-2.5 bg-amber-700"
              />
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-12 lg:p-16">
          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            className="max-w-[22ch] text-3xl font-black leading-[0.92] tracking-tighter text-[#F8FAFC] sm:text-6xl lg:text-7xl"
          >
            המקום שלך לגדול,{" "}
            <span className="text-amber-700">להתקדם ולבנות</span> את העתיד שלך.
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 1 }}
            className="my-10 h-[4px] w-full bg-[#F8FAFC]/20 sm:my-14"
          />

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                onSubmit={submit}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.3 }}
                className="space-y-10 sm:space-y-14"
              >
                <div className="grid grid-cols-1 gap-10 sm:gap-12 md:grid-cols-3">
                  <TerminalField
                    id="name"
                    label="שם מלא"
                    value={form.name}
                    onChange={set("name")}
                    index={0}
                  />
                  id="age"
                    label="גיל"
                    value={form.age}
                    onChange={set("age")}
                    index={1}
                    inputMode="numeric"
                  />
                  <TerminalField
                    id="phone"
                    label="מספר טלפון"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    index={2}
                  />
                </div>

                <div className="flex flex-col items-start gap-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <MagnetButton>[ שליחה ]</MagnetButton>
                  <p className="max-w-[30ch] text-[11px] font-bold leading-relaxed text-[#F8FAFC]/40 sm:text-xs">
                    הפרטים נשמרים בסודיות. נחזור אליך בהקדם.
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="flex flex-col items-start gap-6 border-[3px] border-amber-700 p-8 sm:flex-row sm:items-center sm:gap-8 sm:p-14"
              >
                <motion.div
                  initial={{ rotate: -25, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    delay: 0.12,
                    type: "spring",
                    stiffness: 380,
                    damping: 15,
                  }}
                  className="grid h-16 w-16 shrink-0 place-items-center border-[3px] border-[#F8FAFC] bg-amber-700 shadow-[5px_5px_0px_0px_#F8FAFC] sm:h-20 sm:w-20"
                >
                  <Check
                    strokeWidth={4}
                    className="h-8 w-8 text-slate-950 sm:h-10 sm:w-10"
                  />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight text-[#F8FAFC] sm:text-4xl">
                    הפרטים נשלחו בהצלחה
                  </h3>
                  <p className="mt-2 text-sm font-bold text-[#F8FAFC]/55 sm:text-lg">
                    ניצור איתך קשר בקרוב. תודה שפנית אלינו.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sign-off */}
      <div className="mt-16 flex flex-col items-center gap-4 border-t-4 border-slate-950 pt-10 sm:flex-row sm:justify-between">
        <p className="text-[11px] font-black tracking-[0.2em] text-slate-950/45">
          ישיבה • ירושלים © {new Date().getFullYear()}
        </p>
        <p className="text-center text-[11px] font-black tracking-[0.16em] text-amber-700">
          יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד!
        </p>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  MAIN CONTENT — assembled                                           */
/* ================================================================== */
function MainContent() {
  return (
    <main
      id="home"
      className="relative w-full bg-[#F8FAFC] pb-40"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(2,6,23,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(2,6,23,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top brutalist rule */}
      <div className="h-[10px] w-full border-b-4 border-slate-950 bg-amber-700" />

      <HeroSection />
      <ScrollMarquees />
      <BentoGrid />
      <FAQAccordion />
      <TerminalForm />
    </main>
  );
}

/* ================================================================== */
/*  PAGE — APP SHELL + CONTENT                                         */
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
