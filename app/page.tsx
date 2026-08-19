"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function Home() {
  return (
    <main dir="rtl" className="relative w-full">
      <FloatingLogo />
      <HeroSection />
    </main>
  );
}

/* ---------------------------------------------
   FLOATING TOP-LEFT LOGO (Glassmorphism)
--------------------------------------------- */
function FloatingLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-5 left-5 z-[100] flex items-center gap-3 px-4 py-2 rounded-2xl"
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
          style={{ color: "var(--color-gold-light)", fontFamily: "Bona Nova S, serif" }}
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
      const currentWord = wordsRef.current[wordIndexRef.current % wordsRef.current.length];

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
   HERO SECTION
--------------------------------------------- */
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll physics: pin for a portion, then release.
  // Fast scroll gets a fast (0.5s-feel) transform via spring-less linear mapping
  // but framer's scroll progress is already tied to native fast scroll,
  // so the pin naturally "bypasses" quickly when the user scrolls fast.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.75]);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* VIDEO BACKGROUND */}
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          style={{ scale }}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </motion.video>

        {/* DARK OVERLAY FOR CONTRAST */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: overlayOpacity,
            background: "linear-gradient(180deg, rgba(10,26,51,0.55) 0%, rgba(10,26,51,0.75) 100%)",
          }}
        />

        {/* CONTENT */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mb-5 px-5 py-2 rounded-full text-sm md:text-base"
            style={{
              color: "var(--color-gold-light)",
              border: "1px solid rgba(228, 201, 118, 0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
            }}
          >
            לבחורים בגילאי 20–35 | בלב ירושלים
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white font-bold max-w-4xl text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-tight"
            style={{ fontFamily: "Bona Nova S, serif" }}
          >
            מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-6 text-lg md:text-2xl text-white/90 max-w-2xl"
          >
            ללמוד בסבבה, עם חבר&apos;ה טוב. ישיבה{" "}
            <Typewriter /> בלב ירושלים.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              className="px-8 py-3 rounded-xl text-base md:text-lg font-semibold transition-transform hover:scale-105"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-navy-deep)",
              }}
            >
              [ הרשם עכשיו ]
            </button>
            <button
              className="px-8 py-3 rounded-xl text-base md:text-lg font-semibold border transition-all hover:bg-white/10"
              style={{
                borderColor: "rgba(255,255,255,0.6)",
                color: "#ffffff",
                background: "transparent",
              }}
            >
              [ מה מתאים לך? ]
            </button>
          </motion.div>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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
