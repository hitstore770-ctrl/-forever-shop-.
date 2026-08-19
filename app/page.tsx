"use client";

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
  AnimatePresence,
  LayoutGroup,
  Variants,
} from "framer-motion";
import Lenis from "lenis";

export default function Home() {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  // ---- Reverse WhatsApp Morph: tracks bottom AND scroll direction ----
  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollPosition = currentY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 120;

      const nearBottom = scrollPosition >= documentHeight - threshold;
      const scrollingUp = currentY < lastY;

      if (nearBottom) {
        setIsAtBottom(true);
      } else if (scrollingUp || currentY < documentHeight - threshold - 200) {
        setIsAtBottom(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LayoutGroup>
      <main
        dir="rtl"
        className="relative w-full select-none-strict"
        style={{ overscrollBehaviorY: "none" }}
      >
        <NoiseOverlay />
        <CustomCursor />
        <ScrollProgressBar />
        <FloatingLogo />
        <HeroSection />
        <SectionDivider />
        <MarqueeSection />
        <BentoGridSection />
        <FaqSection />
        <RegistrationSection />
        <Footer />
        <WhatsAppFloatingButton isAtBottom={isAtBottom} />
        <BottomDock isAtBottom={isAtBottom} />
      </main>
    </LayoutGroup>
  );
}

/* ---------------------------------------------
   NOISE TEXTURE OVERLAY
--------------------------------------------- */
function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}

/* ---------------------------------------------
   SVG SECTION DIVIDER (Cream -> Navy wave transition)
--------------------------------------------- */
function SectionDivider() {
  return (
    <div
      className="relative w-full leading-[0]"
      style={{ marginTop: "-2px" }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-[70px] md:h-[110px]"
        style={{ display: "block" }}
      >
        <path
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,48 L1440,120 L0,120 Z"
          fill="var(--color-navy)"
        />
      </svg>
    </div>
  );
}

/* ---------------------------------------------
   CUSTOM CURSOR (Desktop only)
--------------------------------------------- */
function subscribeToDesktopMediaQuery(onChange: () => void) {
  const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getDesktopMediaQuerySnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function CustomCursor() {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktopMediaQuery,
    getDesktopMediaQuerySnapshot,
    () => false,
  );
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 260, damping: 22, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 260, damping: 22, mass: 0.4 });

  // FIX: useMotionTemplate moved to top level (was inside conditional JSX before)
  const ringXPx = useMotionTemplate`calc(${ringX}px - 11px)`;
  const ringYPx = useMotionTemplate`calc(${ringY}px - 11px)`;

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX - 5);
      dotY.set(e.clientY - 5);
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, select, textarea"
      );
      setIsPointer(!!interactive);
    };

    const handleLeave = () => setIsVisible(false);

    if (isDesktop) {
      window.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseleave", handleLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMove);
      // FIX: added missing cleanup for mouseleave listener
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [dotX, dotY, isDesktop]);

  if (!isDesktop) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="custom-cursor"
            style={{ x: dotX, y: dotY }}
            animate={{ scale: isPointer ? 1.8 : 1 }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="custom-cursor-ring"
            style={{
              x: ringXPx,
              y: ringYPx,
            }}
            animate={{
              scale: isPointer ? 1.4 : 1,
              borderColor: isPointer
                ? "rgba(201,162,75,0.6)"
                : "rgba(15,37,69,0.35)",
            }}
            transition={{ duration: 0.25 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------
   SCROLL PROGRESS BAR
--------------------------------------------- */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    mass: 0.2,
  });

  return (
    <motion.div
      className="fixed top-0 right-0 h-full z-[110] pointer-events-none"
      style={{ width: "2px" }}
    >
      <motion.div
        className="motion-optimized"
        style={{
          scaleY,
          transformOrigin: "top",
          width: "2px",
          height: "100%",
          background:
            "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
        }}
      />
    </motion.div>
  );
}

/* ---------------------------------------------
   FLOATING GOLDEN PARTICLES
--------------------------------------------- */
function seededValue(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function FloatingParticles({ count = 14 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: 4 + seededValue(i, 1) * 10,
      left: seededValue(i, 2) * 100,
      top: seededValue(i, 3) * 100,
      duration: 18 + seededValue(i, 4) * 22,
      delay: seededValue(i, 5) * 6,
      driftX: (seededValue(i, 6) - 0.5) * 60,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            left: p.left + "%",
            top: p.top + "%",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.driftX, 0],
            opacity: [0.15, 0.5, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------
   CONTEXTUAL FLOATING EMOJI
--------------------------------------------- */
function FloatingEmoji({
  emoji,
  top,
  left,
  size = 40,
  duration = 8,
  opacity = 0.12,
}: {
  emoji: string;
  top: string;
  left: string;
  size?: number;
  duration?: number;
  opacity?: number;
}) {
  return (
    <motion.div
      className="floating-emoji"
      style={{
        top,
        left,
        fontSize: size + "px",
        opacity,
      }}
      animate={{
        y: [0, -18, 0],
        rotate: [0, 6, 0, -6, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    >
      {emoji}
    </motion.div>
  );
}

/* ---------------------------------------------
   TEXT REVEAL
--------------------------------------------- */
type RevealTag = "div" | "h1" | "h2" | "h3" | "span";

function RevealText({
  children,
  as = "div",
  delay = 0,
  className = "",
  style = {},
  viewportOnce = true,
  useInView = true,
}: {
  children: React.ReactNode;
  as?: RevealTag;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  viewportOnce?: boolean;
  useInView?: boolean;
}) {
  // FIX: proper typed motion component selection instead of unsafe `as as "div"` cast
  const MotionTag = motion[as] as React.ElementType;

  const initialProps = useInView
    ? { initial: "hidden", whileInView: "show", viewport: { once: viewportOnce } }
    : { initial: "hidden", animate: "show" };

  return (
    <div className={className} style={{ overflow: "hidden", ...style }}>
      <MotionTag
        className="motion-optimized"
        variants={{
          hidden: { y: "110%" },
          show: {
            y: "0%",
            transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
          },
        }}
        {...initialProps}
      >
        {children}
      </MotionTag>
    </div>
  );
}

/* ---------------------------------------------
   FLOATING TOP-LEFT LOGO
--------------------------------------------- */
function FloatingLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      draggable="false"
      className="fixed top-5 left-5 z-[100] flex items-center gap-3 px-4 py-2 rounded-2xl no-select-card select-none-strict"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(255, 255, 255, 0.25)",
        boxShadow: "0 4px 24px rgba(15, 37, 69, 0.15)",
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--color-navy)",
          border: "1.5px solid var(--color-gold)",
        }}
      >
        <span
          className="text-sm"
          style={{
            color: "var(--color-gold-light)",
            fontFamily: "var(--font-assistant), sans-serif",
          }}
        >
          מ
        </span>
      </div>
      <div className="logo-text text-xs" style={{ color: "var(--color-navy)" }}>
        <div style={{ lineHeight: 1 }}>ישיבת</div>
        <div style={{ lineHeight: 1 }}>המלך</div>
        <div style={{ lineHeight: 1 }}>המשיח</div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------
   TYPEWRITER COMPONENT
--------------------------------------------- */
function Typewriter() {
  const [displayText, setDisplayText] = useState("");
  const wordsRef = useRef(["מבוססת", "מבוקשת"]);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    let charIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const currentWord =
        wordsRef.current[wordIndexRef.current % wordsRef.current.length];

      if (!isDeleting) {
        charIndex++;
        setDisplayText(currentWord.slice(0, charIndex));

        if (charIndex === currentWord.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 2000);
          return;
        }
        timeoutId = setTimeout(tick, 110);
      } else {
        charIndex--;
        setDisplayText(currentWord.slice(0, charIndex));

        if (charIndex === 0) {
          isDeleting = false;
          wordIndexRef.current++;
          timeoutId = setTimeout(tick, 400);
          return;
        }
        timeoutId = setTimeout(tick, 60);
      }
    };

    timeoutId = setTimeout(tick, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <span
      className="inline-flex items-center"
      style={{ color: "var(--color-gold-light)", fontWeight: 700 }}
    >
      {displayText}
      <span
        className="inline-block w-[2px] h-[1em] ml-1"
        style={{
          background: "var(--color-gold-light)",
          animation: "blink 0.9s steps(1) infinite",
        }}
      />
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}

/* ---------------------------------------------
   MAGNETIC BUTTON
--------------------------------------------- */
function MagneticButton({
  children,
  className = "",
  style = {},
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.3 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      draggable="false"
      aria-label={ariaLabel}
      style={{ x: springX, y: springY, ...style }}
      className={"motion-optimized min-hitbox " + className}
    >
      {children}
    </motion.button>
  );
}

/* ---------------------------------------------
   HERO SECTION
--------------------------------------------- */
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.75]);

  const blurAmount = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const videoBackdropFilter = useTransform(
    blurAmount,
    (v) => "blur(" + v + "px)"
  );

  const textScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        height: "180vh",
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(201,162,75,0.18) 0%, rgba(201,162,75,0) 60%), var(--color-navy-deep)",
      }}
    >
      <div className="sticky top-0 min-h-[100dvh] h-[100dvh] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 motion-optimized"
          style={{
            y: glowY,
            background:
              "radial-gradient(circle at 50% 40%, rgba(228,201,118,0.25) 0%, rgba(228,201,118,0) 55%)",
          }}
        />

        <motion.video
          ref={videoRef}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          draggable="false"
          poster="/hero-poster.png"
          style={{
            scale,
            backdropFilter: videoBackdropFilter,
            WebkitBackdropFilter: videoBackdropFilter,
          }}
          className="absolute inset-0 w-full h-full object-cover no-select-card select-none-strict z-[1] motion-optimized"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>

        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{ background: "rgba(10, 26, 51, 0.1)" }}
        />

        <motion.div
          className="absolute inset-0 z-[2] motion-optimized"
          style={{
            opacity: overlayOpacity,
            background:
              "linear-gradient(180deg, rgba(10,26,51,0.55) 0%, rgba(10,26,51,0.75) 100%)",
          }}
        />

        <motion.div
          style={{ opacity, scale: textScale }}
          className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 text-center select-none-strict motion-optimized"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="mb-5 px-5 py-2 rounded-full text-sm md:text-base"
            style={{
              color: "var(--color-gold-light)",
              border: "1px solid rgba(228, 201, 118, 0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              textShadow: "0 1px 6px rgba(10,26,51,0.6)",
            }}
          >
            לבחורים בגילאי 20–35 | בלב ירושלים
          </motion.div>

          <RevealText
            as="h1"
            delay={0.5}
            useInView={false}
            className="text-white font-bold max-w-4xl fluid-h1 leading-tight md:leading-tight tracking-tight"
            style={{
              fontFamily: "var(--font-assistant), sans-serif",
              textShadow:
                "0 2px 18px rgba(10,26,51,0.75), 0 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים
          </RevealText>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
            className="mt-6 text-lg md:text-2xl text-white/90 max-w-2xl"
            style={{ textShadow: "0 1px 10px rgba(10,26,51,0.65)" }}
          >
            ללמוד בסבבה, עם חבר&apos;ה טוב. ישיבה{" "}
            <Typewriter /> בלב ירושלים.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <MagneticButton
              ariaLabel="הרשם עכשיו"
              className="px-8 py-3 rounded-xl text-base md:text-lg font-semibold"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-navy-deep)",
              }}
            >
              [ הרשם עכשיו ]
            </MagneticButton>
            <MagneticButton
              ariaLabel="מה מתאים לך"
              className="px-8 py-3 rounded-xl text-base md:text-lg font-semibold border"
              style={{
                borderColor: "rgba(255,255,255,0.6)",
                color: "#ffffff",
                background: "transparent",
              }}
            >
              [ מה מתאים לך? ]
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.button
          onClick={toggleMute}
          type="button"
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          aria-label={isMuted ? "הפעל קול" : "השתק קול"}
          className="absolute bottom-8 right-6 z-20 min-hitbox rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          {isMuted ? <MuteIcon /> : <UnmuteIcon />}
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          aria-hidden="true"
        >
          <div
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
            style={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--color-gold-light)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4z" fill="#ffffff" />
      <path
        d="M17 8l5 8M22 8l-5 8"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UnmuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 9v6h4l5 5V4L8 9H4z" fill="#ffffff" />
      <path
        d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------------------------------------------
   MARQUEE SECTION
--------------------------------------------- */
function MarqueeSection() {
  const line1 =
    "ללמוד בלב ירושלים – ולהשפיע על לב ירושלים • להוביל ולהמריא • ";
  const line2 =
    "תורה, חסידות וכלים לחיים — עד להקמת בית יהודי חסידי • להתעלות ולהתקדם • ";

  return (
    <section
      className="relative w-full py-10 overflow-hidden select-none-strict"
      style={{ background: "var(--color-navy)" }}
    >
      <div className="relative flex overflow-hidden mb-4">
        <motion.div
          className="flex whitespace-nowrap motion-optimized"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-2xl md:text-4xl font-bold px-4 tracking-tight"
              style={{
                fontFamily: "var(--font-assistant), sans-serif",
                color: "var(--color-gold-light)",
              }}
            >
              {line1}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap motion-optimized"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-2xl md:text-4xl font-bold px-4 tracking-tight"
              style={{
                fontFamily: "var(--font-assistant), sans-serif",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {line2}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
const gridContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const BentoGridSection = React.memo(function BentoGridSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgParallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const cards = [
    {
      number: 1,
      title: "המסלול הלימודי המלא – שנתיים",
      desc: "לימוד תורה וחסידות, עבודת ה', סדר יום ישיבתי, ליווי אישי והכנה מעשית ורוחנית להמשך החיים.",
    },
    {
      number: 2,
      title: "חצי יום לימוד וחצי יום עבודה – 3 שנים",
      desc: "לשלב בין מסגרת ישיבתית משמעותית לחיים מעשיים. בניית אחריות אישית, יציבות והכנה לחיי נישואין.",
    },
    {
      number: 3,
      title: "המסלול האקסטרני",
      desc: "ללמוד בישיבה ולהמשיך להתגורר בבית. חברותות קבועות, השתתפות בהתוועדויות ובחיי החברה החסידית.",
    },
    {
      number: 4,
      title: "מסלול השלוחים",
      desc: "לימוד פרטני עם בחורים למדנים שהגיעו מ-770. ליווי אישי שעוזר להשתלב, להתקדם ולבנות הרגלי לימוד.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-6 md:px-12 overflow-hidden select-none-strict"
      style={{ background: "var(--color-cream)" }}
    >
      <motion.div
        style={{ y: bgParallaxY }}
        className="absolute inset-0 z-0 motion-optimized"
      >
        <FloatingParticles count={12} />
        <FloatingEmoji emoji="📖" top="12%" left="8%" size={54} duration={9} opacity={0.1} />
        <FloatingEmoji emoji="📚" top="70%" left="88%" size={44} duration={11} opacity={0.09} />
      </motion.div>

      <div className="relative z-10 max-w-6xl mx-auto text-center mb-10">
        <RevealText
          as="h2"
          className="fluid-h2 font-bold mb-6 tracking-tight"
          style={{ color: "var(--color-navy)" }}
        >
          מסלול שמתאים לרמה, ליכולות ולמטרות שלך.
        </RevealText>

        {/* Read Time Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-6"
          style={{
            background: "rgba(201,162,75,0.12)",
            color: "var(--color-navy)",
            border: "1px solid rgba(201,162,75,0.35)",
          }}
        >
          <span aria-hidden="true">⏱️</span>
          <span>קריאה של דקה</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{ color: "rgba(15, 37, 69, 0.75)" }}
        >
          צוות חינוכי מנוסה וליווי אישי לאורך הדרך. לימוד פרטני אחד על אחד עם
          בוגרי ישיבות חב״ד.
        </motion.p>
      </div>

      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {cards.map((card) => (
          <TiltCard key={card.number} card={card} />
        ))}
      </motion.div>
    </section>
  );
});

/* ---------------------------------------------
   ANIMATED NUMBER COUNTER
--------------------------------------------- */
function NumberCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  // FIX: replaced state-based hasStarted with a ref to avoid stale-closure issues
  const hasStartedRef = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          const duration = 1200;
          const startTime = performance.now();

          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = count < 10 ? "0" + count : String(count);

  return <span ref={ref}>{display}</span>;
}

/* ---------------------------------------------
   3D TILT CARD (Spring Physics + Spotlight)
--------------------------------------------- */
const TiltCard = React.memo(function TiltCard({
  card,
}: {
  card: { number: number; title: string; desc: string };
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotX = useMotionValue(-999);
  const spotY = useMotionValue(-999);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10, -10]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
    springConfig
  );

  const spotlightBackground = useMotionTemplate`radial-gradient(220px circle at ${spotX}px ${spotY}px, rgba(228,201,118,0.18), transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    spotX.set(e.clientX - rect.left);
    spotY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    spotX.set(-999);
    spotY.set(-999);
  };

  return (
    <motion.div variants={gridItemVariants} style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        draggable="false"
        tabIndex={0}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: "var(--color-navy)",
        }}
        className="relative rounded-[10px] p-8 md:p-10 min-h-[280px] flex flex-col justify-between cursor-pointer overflow-hidden no-select-card select-none-strict motion-optimized"
      >
        <div
          className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,75,0.15) 0%, transparent 70%)",
          }}
        />

        <motion.div
          className="absolute inset-0 pointer-events-none motion-optimized"
          style={{ background: spotlightBackground }}
        />

        <motion.div
          style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
          className="relative z-10"
        >
          <span
            className="text-5xl md:text-6xl font-bold block mb-6 tracking-tight"
            style={{ color: "var(--color-gold)", fontFamily: "var(--font-assistant), sans-serif" }}
          >
            <NumberCounter target={card.number} />
          </span>
          <h3
            className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-assistant), sans-serif" }}
          >
            {card.title}
          </h3>
          <p className="text-white/80 text-base md:text-lg leading-relaxed">
            {card.desc}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});
const faqContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const faqItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const FaqSection = React.memo(function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const containerParallaxY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const faqs = [
    {
      q: "איך נראית הפנימייה?",
      a: "פנימייה מרווחת, חדרים ממוזגים, מיטה וארון אישי לכל בחור ליצירת מקום נעים וביתי. ",
      highlight: "מקווה טהרה חדש ומשופץ",
      rest: " נמצא ממש בתוך הקמפוס.",
    },
    {
      q: "מה לגבי ארוחות?",
      a: "שלוש ארוחות מסודרות ביום. טבח צמוד מכין ארוחת בוקר עשירה, ו",
      highlight: "ארוחות צהריים וערב חמות ומבושלות",
      rest: ", כדי שתהיה פנוי באמת ללימוד.",
    },
    {
      q: "מה האווירה החברתית בישיבה?",
      a: "אווירה חסידית, חיה ונושמת. ",
      highlight: "התוועדויות, שבתות משותפות, יציאה למבצעים",
      rest: ", וקשר אישי בגובה העיניים עם הצוות והשלוחים.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 px-6 md:px-12 overflow-hidden select-none-strict"
      style={{ background: "var(--color-cream-blue)" }}
    >
      <span
        className="watermark-quote"
        style={{ top: "-2rem", right: "5%" }}
        aria-hidden="true"
      >
        &#8221;
      </span>

      <div className="absolute inset-0 z-0">
        <FloatingParticles count={10} />
        <FloatingEmoji emoji="❓" top="15%" left="85%" size={46} duration={8} opacity={0.1} />
        <FloatingEmoji emoji="🧭" top="75%" left="6%" size={50} duration={10} opacity={0.09} />
      </div>

      <motion.div
        style={{ y: containerParallaxY }}
        className="relative z-10 max-w-3xl mx-auto motion-optimized"
      >
        <RevealText
          as="h2"
          className="fluid-h2 font-bold text-center mb-16 tracking-tight"
          style={{ color: "var(--color-navy)" }}
        >
          מה שחשוב לדעת
        </RevealText>

        <motion.div
          variants={faqContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-5"
        >
          {faqs.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
});

function FaqItem({
  item,
  isOpen,
  onClick,
}: {
  item: { q: string; a: string; highlight: string; rest: string };
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={faqItemVariants}
      className="rounded-[10px] overflow-hidden no-select-card select-none-strict"
      style={{
        boxShadow: "0 8px 30px rgba(15, 37, 69, 0.1)",
      }}
    >
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        aria-label={"שאלה: " + item.q}
        aria-expanded={isOpen}
        className="w-full min-hitbox flex items-center justify-between gap-4 px-6 md:px-8 py-6 text-right"
        style={{ background: "var(--color-navy)" }}
      >
        <span
          className="text-lg md:text-xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-assistant), sans-serif" }}
        >
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          aria-hidden="true"
          className="flex-shrink-0 w-8 h-8 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-xl font-bold"
          style={{
            border: "1.5px solid var(--color-gold)",
            color: "var(--color-gold-light)",
          }}
        >
          +
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ background: "#ffffff" }}
          >
            <div className="px-6 md:px-8 py-6">
              <p
                className="drop-cap text-base md:text-lg leading-relaxed"
                style={{ color: "var(--color-navy)" }}
              >
                {item.a}
                <span className="gold-highlight">{item.highlight}</span>
                {item.rest}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------------------------------------
   CONFETTI BURST (Framer Motion)
--------------------------------------------- */
function ConfettiBurst() {
  const pieces = useMemo(() => {
    const colors = ["#c9a24b", "#e4c976", "#0f2545", "#ffffff", "#2e9e5b"];
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: (seededValue(i, 10) - 0.5) * 500,
      y: seededValue(i, 11) * -400 - 100,
      rotate: seededValue(i, 12) * 720 - 360,
      color: colors[Math.floor(seededValue(i, 13) * colors.length)],
      delay: seededValue(i, 14) * 0.3,
      duration: 1.2 + seededValue(i, 15) * 0.8,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="confetti-piece"
          style={{ background: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: [0, p.y, p.y + 300],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------
   THANK YOU SUCCESS COMPONENT
--------------------------------------------- */
function ThankYouState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative max-w-2xl mx-auto rounded-[10px] p-10 md:p-16 flex flex-col items-center text-center overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "0 10px 40px rgba(201, 162, 75, 0.25)",
        border: "1px solid rgba(201, 162, 75, 0.3)",
      }}
    >
      <ConfettiBurst />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#2e9e5b" }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M4 12.5L9.5 18L20 6.5"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          />
        </svg>
      </motion.div>
      <h3
        className="text-2xl md:text-3xl font-bold mb-3 tracking-tight"
        style={{ color: "var(--color-navy)", fontFamily: "var(--font-assistant), sans-serif" }}
      >
        תודה רבה!
      </h3>
      <p className="text-base md:text-lg" style={{ color: "rgba(15, 37, 69, 0.75)" }}>
        הפרטים שלך התקבלו בהצלחה. נציג הישיבה יחזור אליך בהקדם האפשרי.
      </p>
    </motion.div>
  );
}

/* ---------------------------------------------
   REGISTRATION SECTION (floating labels, validation,
   honeypot, localStorage draft, confetti success)
--------------------------------------------- */
function RegistrationSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    track: "",
    website: "", // honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneComplete, setPhoneComplete] = useState(false);

  const trackSelectRef = useRef<HTMLSelectElement>(null);
  const hasLoadedDraft = useRef(false);

  const tracks = [
    "המסלול הלימודי המלא – שנתיים",
    "חצי יום לימוד וחצי יום עבודה – 3 שנים",
    "המסלול האקסטרני",
    "מסלול השלוחים",
  ];

  // ---- Load draft from localStorage on mount ----
  useEffect(() => {
    if (hasLoadedDraft.current) return;
    hasLoadedDraft.current = true;
    try {
      const savedName = window.localStorage.getItem("draft_fullName");
      const savedPhone = window.localStorage.getItem("draft_phone");
      if (savedName || savedPhone) {
        window.setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            fullName: savedName || "",
            phone: savedPhone || "",
          }));
          if (savedPhone && savedPhone.replace(/\D/g, "").length === 10) {
            setPhoneComplete(true);
          }
        }, 0);
      }
    } catch {
      // localStorage unavailable, silently ignore
    }
  }, []);

  // ---- Save draft to localStorage as user types ----
  useEffect(() => {
    try {
      window.localStorage.setItem("draft_fullName", formData.fullName);
      window.localStorage.setItem("draft_phone", formData.phone);
    } catch {
      // localStorage unavailable, silently ignore
    }
  }, [formData.fullName, formData.phone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      const isValidPhone = /^\d{10}$/.test(digitsOnly);
      if (isValidPhone) {
        setPhoneComplete(true);
        setTimeout(() => {
          trackSelectRef.current?.focus();
        }, 350);
      } else {
        setPhoneComplete(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check - if filled, silently reject (bot)
    if (formData.website.trim() !== "") {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        window.localStorage.removeItem("draft_fullName");
        window.localStorage.removeItem("draft_phone");
      } catch {
        // ignore
      }
    }, 1800);
  };

  return (
    <section
      className="relative w-full py-24 md:py-32 px-6 md:px-12"
      style={{ background: "#fbf3df" }}
    >
      <div className="max-w-3xl mx-auto text-center mb-14">
        <RevealText
          as="h2"
          className="fluid-h2 font-bold mb-6 tracking-tight"
          style={{ color: "var(--color-navy)" }}
        >
          המקום שלך לפרוץ, להתקדם ולבנות את העתיד שלך.
        </RevealText>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-lg md:text-xl"
          style={{ color: "rgba(15, 37, 69, 0.8)" }}
        >
          השאר פרטים ונבדוק יחד איזה מסלול מתאים בדיוק עבורך.
        </motion.p>
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <ThankYouState key="thankyou" />
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto rounded-[10px] p-8 md:p-12 flex flex-col gap-6"
            style={{
              background: "#ffffff",
              boxShadow: "0 10px 40px rgba(201, 162, 75, 0.25)",
              border: "1px solid rgba(201, 162, 75, 0.3)",
            }}
          >
            {/* Honeypot field - hidden from real users, bots will fill it */}
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="honeypot-field"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <FloatingField
              label="שם מלא"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              required
            />
            <FloatingField
              label="גיל"
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
              required
            />
            <FloatingField
              label="מספר טלפון"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              required
              showCheck={phoneComplete}
            />

            <div className="flex flex-col gap-2">
              <label
                htmlFor="track-select"
                className="text-sm md:text-base font-semibold"
                style={{ color: "var(--color-navy)" }}
              >
                המסלול שמעניין אותך
              </label>
              <select
                id="track-select"
                ref={trackSelectRef}
                name="track"
                value={formData.track}
                onChange={handleChange}
                required
                aria-label="בחר מסלול לימוד"
                className="w-full min-hitbox px-4 py-3 rounded-lg text-[16px] outline-none transition-colors"
                style={{
                  border: "2px solid var(--color-gold)",
                  color: "var(--color-navy)",
                  background: "#fffdf7",
                }}
              >
                <option value="" disabled>
                  בחר מסלול
                </option>
                {tracks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
              aria-label="שלח פרטי הרשמה"
              className="mt-4 w-full min-hitbox py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] disabled:opacity-80"
              style={{
                background: "var(--color-navy)",
                color: "var(--color-gold-light)",
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="inline-block w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "var(--color-gold)",
                      borderTopColor: "transparent",
                    }}
                  />
                  שולח...
                </>
              ) : (
                "[ שלח פרטים ]"
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------------------------------------
   FLOATING LABEL FIELD (with validation checkmark)
--------------------------------------------- */
// FIX: tightened `type` to a safe union instead of a generic string
type FloatingFieldType = "text" | "number" | "tel" | "email";

function FloatingField({
  label,
  name,
  value,
  onChange,
  type,
  required,
  showCheck,
}: {
  label: string;
  name: string;
  value: string;
  // FIX: widened to accept both input and select change events,
  // matching how handleChange is actually used in RegistrationSection
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: FloatingFieldType;
  required?: boolean;
  showCheck?: boolean;
}) {
  const inputId = "field-" + name;
  const hasValue = value.trim().length > 0;

  return (
    <div className={"float-field" + (hasValue ? " has-value" : "")}>
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-label={label}
        autoComplete="off"
      />
      <label htmlFor={inputId}>{label}</label>

      <AnimatePresence>
        {showCheck && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#2e9e5b" }}
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <motion.path
                d="M4 12.5L9.5 18L20 6.5"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------
   FOOTER
--------------------------------------------- */
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full pt-14 pb-32 px-6 text-center flex flex-col items-center gap-3 select-none-strict"
      style={{ background: "var(--color-navy)" }}
    >
      <p
        className="text-base md:text-lg font-semibold tracking-tight"
        style={{ color: "#ffffff", fontFamily: "var(--font-assistant), sans-serif" }}
      >
        ישיבת המלך המשיח – ירושלים © 2026
      </p>
      <p
        className="text-sm md:text-base"
        style={{ color: "rgba(201, 162, 75, 0.65)" }}
      >
        יחי אדונינו מורינו ורבינו מלך המשיח לעולם ועד!
      </p>
    </motion.footer>
  );
}

/* ---------------------------------------------
   WHATSAPP FLOATING BUTTON (Reverse Shared Layout Magic)
--------------------------------------------- */
function WhatsAppFloatingButton({ isAtBottom }: { isAtBottom: boolean }) {
  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.a
          // TODO: replace with the real WhatsApp business number before production
          href="https://wa.me/972000000000"
          target="_blank"
          rel="noopener noreferrer"
          layoutId="whatsapp-morph"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          draggable="false"
          aria-label="צור קשר בוואטסאפ"
          className="fixed z-[90] min-hitbox flex items-center justify-center rounded-full no-select-card select-none-strict"
          style={{
            bottom: "6rem",
            right: "1.5rem",
            width: "58px",
            height: "58px",
            background: "var(--color-gold)",
            boxShadow: "0 6px 24px rgba(201, 162, 75, 0.5)",
          }}
        >
          <WhatsAppIcon color="var(--color-navy-deep)" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

function WhatsAppIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill={color}
      />
      <path
        d="M12.004 2.003c-5.514 0-9.997 4.483-9.997 9.997 0 1.763.463 3.483 1.343 4.997l-1.427 5.213 5.338-1.401a9.96 9.96 0 004.743 1.208h.004c5.514 0 9.997-4.483 9.997-9.997 0-2.671-1.04-5.182-2.929-7.071A9.937 9.937 0 0012.004 2.003zm5.877 15.869a8.28 8.28 0 01-5.877 2.433h-.003a8.317 8.317 0 01-4.242-1.16l-.304-.181-3.167.831.845-3.087-.198-.317a8.293 8.293 0 01-1.276-4.428c0-4.591 3.735-8.326 8.328-8.326a8.27 8.27 0 015.883 2.439 8.27 8.27 0 012.437 5.884 8.285 8.285 0 01-2.426 5.916z"
        fill={color}
      />
    </svg>
  );
}

/* ---------------------------------------------
   BOTTOM DOCK
--------------------------------------------- */
function BottomDock({ isAtBottom }: { isAtBottom: boolean }) {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 700);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4"
      aria-label="ניווט תחתון"
    >
      <div
        className="flex items-center gap-1 md:gap-2 px-4 py-3 rounded-3xl w-full max-w-md justify-between no-select-card select-none-strict"
        style={{
          background: "rgba(15, 37, 69, 0.55)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(15, 37, 69, 0.3)",
        }}
      >
        <DockItem label="ייעוץ" ariaLabel="ייעוץ אישי בוואטסאפ">
          <AnimatePresence>
            {isAtBottom && (
              <motion.div
                layoutId="whatsapp-morph"
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="w-9 h-9 flex items-center justify-center rounded-full"
              >
                <WhatsAppIcon color="#ffffff" />
              </motion.div>
            )}
          </AnimatePresence>
          {!isAtBottom && (
            <div className="w-9 h-9 flex items-center justify-center">
              <ChatIcon />
            </div>
          )}
        </DockItem>

        <DockItem label="לגלות עוד" ariaLabel="לגלות עוד תוכן">
          <motion.div
            animate={bounce ? { y: [0, -8, 0, -4, 0] } : { y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="w-9 h-9 flex items-center justify-center text-2xl"
            aria-hidden="true"
          >
            🧭
          </motion.div>
        </DockItem>

        <DockCenterItem />

        <DockItem label="מהפעילות" ariaLabel="פעילויות הישיבה">
          <div className="w-9 h-9 flex items-center justify-center">
            <ActivityIcon />
          </div>
        </DockItem>

        <DockItem label="חנות" ariaLabel="חנות הישיבה">
          <div className="w-9 h-9 flex items-center justify-center">
            <ShopIcon />
          </div>
        </DockItem>
      </div>
    </motion.nav>
  );
}

function DockItem({
  label,
  ariaLabel,
  children,
}: {
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 650);
  };

  return (
    <motion.button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
      className="relative flex flex-col items-center justify-center gap-1 flex-1 min-hitbox overflow-hidden rounded-2xl"
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="ripple-span"
          style={{ left: r.x - 30, top: r.y - 30, width: 60, height: 60 }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          aria-hidden="true"
        />
      ))}
      {children}
      <span
        className="text-[11px] font-medium"
        style={{ color: "rgba(255,255,255,0.85)" }}
      >
        {label}
      </span>
    </motion.button>
  );
}

function DockCenterItem() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const btnRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 650);
  };

  return (
    <div className="flex flex-col items-center gap-1 -mt-6">
      <motion.div
        ref={btnRef}
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          },
        }}
        role="button"
        aria-label="דף הבית"
        tabIndex={0}
        className="relative w-14 h-14 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center cursor-pointer overflow-hidden motion-optimized"
        style={{
          background: "var(--color-gold)",
          boxShadow: "0 6px 20px rgba(201, 162, 75, 0.6)",
          border: "3px solid var(--color-cream)",
        }}
      >
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="ripple-span"
            style={{
              left: r.x - 25,
              top: r.y - 25,
              width: 50,
              height: 50,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)",
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            aria-hidden="true"
          />
        ))}
        <HomeIcon color="var(--color-navy-deep)" />
      </motion.div>
      <span
        className="text-[11px] font-semibold"
        style={{ color: "var(--color-gold-light)" }}
      >
        בית
      </span>
    </div>
  );
}

/* ---------------------------------------------
   DOCK ICONS
--------------------------------------------- */
function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon({ color }: { color: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 11.5L12 4l9 7.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.5V19a1 1 0 001 1h11a1 1 0 001-1V9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 20v-5.5h5V20"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 12h-4l-3 9-6-18-3 9H2"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 9l1.5-5h15L21 9"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9h18v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9z"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 13a3 3 0 006 0" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
              }
