"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Lenis from "lenis";

export default function Home() {
  const [isAtBottom, setIsAtBottom] = useState(false);

  // ---- Lenis Smooth Scroll (Global) ----
  useEffect(() => {
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
  }, []);

  // ---- Bottom detection for WhatsApp Morph ----
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const threshold = 120;
      setIsAtBottom(scrollPosition >= documentHeight - threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main dir="rtl" className="relative w-full">
      <ScrollProgressBar />
      <FloatingLogo />
      <HeroSection />
      <MarqueeSection />
      <BentoGridSection />
      <FaqSection />
      <RegistrationSection />
      <Footer />
      <WhatsAppFloatingButton isAtBottom={isAtBottom} />
      <BottomDock isAtBottom={isAtBottom} />
    </main>
  );
}

/* ---------------------------------------------
   SCROLL PROGRESS BAR (Gold, 2px, right edge)
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
        style={{
          scaleY,
          transformOrigin: "top",
          width: "2px",
          height: "100%",
          background: "linear-gradient(180deg, var(--color-gold-light), var(--color-gold))",
        }}
      />
    </motion.div>
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
      className="fixed top-5 left-5 z-[100] flex items-center gap-3 px-4 py-2 rounded-2xl no-select-card"
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
   HERO SECTION (video NOT in a card, full flow)
--------------------------------------------- */
function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.45, 0.75]);

  // Dynamic blur as the user scrolls past the hero video
  const blurValue = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const videoFilter = useTransform(blurValue, (v) => "blur(" + v + "px)");

  return (
    <section ref={sectionRef} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* VIDEO BACKGROUND - full screen, part of scroll flow, not a card */}
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          style={{ scale, filter: videoFilter }}
          className="absolute inset-0 w-full h-full object-cover no-select-card"
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

        {/* CONTENT - directly over video, no card wrapper */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 flex flex-col items-center justify-center h-full w-full px-6 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
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
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="text-white font-bold max-w-4xl text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-tight"
            style={{ fontFamily: "Bona Nova S, serif" }}
          >
            מסלול אישי לבחורים שרוצים ללמוד, להתחזק ולהיבנות לחיים
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
            className="mt-6 text-lg md:text-2xl text-white/90 max-w-2xl"
          >
            ללמוד בסבבה, עם חבר&apos;ה טוב. ישיבה{" "}
            <Typewriter /> בלב ירושלים.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl text-base md:text-lg font-semibold transition-transform hover:scale-105"
              style={{
                background: "var(--color-gold)",
                color: "var(--color-navy-deep)",
              }}
            >
              [ הרשם עכשיו ]
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl text-base md:text-lg font-semibold border transition-all hover:bg-white/10"
              style={{
                borderColor: "rgba(255,255,255,0.6)",
                color: "#ffffff",
                background: "transparent",
              }}
            >
              [ מה מתאים לך? ]
            </motion.button>
          </motion.div>
        </motion.div>

        {/* SCROLL INDICATOR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
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

/* ---------------------------------------------
   MARQUEE SECTION
--------------------------------------------- */
function MarqueeSection() {
  const line1 = "ללמוד בלב ירושלים – ולהשפיע על לב ירושלים • להוביל ולהמריא • ";
  const line2 = "תורה, חסידות וכלים לחיים — עד להקמת בית יהודי חסידי • להתעלות ולהתקדם • ";

  return (
    <section className="relative w-full py-10 overflow-hidden" style={{ background: "var(--color-navy)" }}>
      <div className="relative flex overflow-hidden mb-4">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-2xl md:text-4xl font-bold px-4"
              style={{ fontFamily: "Bona Nova S, serif", color: "var(--color-gold-light)" }}
            >
              {line1}
            </span>
          ))}
        </motion.div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="text-2xl md:text-4xl font-bold px-4"
              style={{ fontFamily: "Bona Nova S, serif", color: "rgba(255,255,255,0.85)" }}
            >
              {line2}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------------------
   BENTO GRID SECTION (THE PATHS) - staggered
--------------------------------------------- */
const gridContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function BentoGridSection() {
  const cards = [
    {
      number: "01",
      title: "המסלול הלימודי המלא – שנתיים",
      desc: "לימוד תורה וחסידות, עבודת ה', סדר יום ישיבתי, ליווי אישי והכנה מעשית ורוחנית להמשך החיים.",
    },
    {
      number: "02",
      title: "חצי יום לימוד וחצי יום עבודה – 3 שנים",
      desc: "לשלב בין מסגרת ישיבתית משמעותית לחיים מעשיים. בניית אחריות אישית, יציבות והכנה לחיי נישואין.",
    },
    {
      number: "03",
      title: "המסלול האקסטרני",
      desc: "ללמוד בישיבה ולהמשיך להתגורר בבית. חברותות קבועות, השתתפות בהתוועדויות ובחיי החברה החסידית.",
    },
    {
      number: "04",
      title: "מסלול השלוחים",
      desc: "לימוד פרטני עם בחורים למדנים שהגיעו מ-770. ליווי אישי שעוזר להשתלב, להתקדם ולבנות הרגלי לימוד.",
    },
  ];

  return (
    <section
      className="relative w-full py-24 md:py-32 px-6 md:px-12"
      style={{ background: "var(--color-cream)" }}
    >
      <div className="max-w-6xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold mb-6"
          style={{ color: "var(--color-navy)" }}
        >
          מסלול שמתאים לרמה, ליכולות ולמטרות שלך.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{ color: "rgba(15, 37, 69, 0.75)" }}
        >
          צוות חינוכי מנוסה וליווי אישי לאורך הדרך. לימוד פרטני אחד על אחד עם בוגרי ישיבות חב״ד.
        </motion.p>
      </div>

      <motion.div
        variants={gridContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {cards.map((card) => (
          <TiltCard key={card.number} card={card} />
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------------------------------------
   3D TILT CARD (Spring Physics)
--------------------------------------------- */
function TiltCard({
  card,
}: {
  card: { number: string; title: string; desc: string };
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div variants={gridItemVariants} style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.97 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: "var(--color-navy)",
        }}
        className="relative rounded-[10px] p-8 md:p-10 min-h-[280px] flex flex-col justify-between cursor-pointer overflow-hidden no-select-card"
      >
        <div
          className="absolute -top-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(201,162,75,0.15) 0%, transparent 70%)",
          }}
        />

        <motion.div
          style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
          className="relative z-10"
        >
          <span
            className="text-5xl md:text-6xl font-bold block mb-6"
            style={{ color: "var(--color-gold)", fontFamily: "Bona Nova S, serif" }}
          >
            {card.number}
          </span>
          <h3
            className="text-xl md:text-2xl font-bold text-white mb-4"
            style={{ fontFamily: "Bona Nova S, serif" }}
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
}

/* ---------------------------------------------
   FAQ SECTION - staggered
--------------------------------------------- */
const faqContainerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "איך נראית הפנימייה?",
      a: "פנימייה מרווחת, חדרים ממוזגים, מיטה וארון אישי לכל בחור ליצירת מקום נעים וביתי. מקווה טהרה חדש ומשופץ נמצא ממש בתוך הקמפוס.",
    },
    {
      q: "מה לגבי ארוחות?",
      a: "שלוש ארוחות מסודרות ביום. טבח צמוד מכין ארוחת בוקר עשירה, וארוחות צהריים וערב חמות ומבושלות, כדי שתהיה פנוי באמת ללימוד.",
    },
    {
      q: "מה האווירה החברתית בישיבה?",
      a: "אווירה חסידית, חיה ונושמת. התוועדויות, שבתות משותפות, יציאה למבצעים, וקשר אישי בגובה העיניים עם הצוות והשלוחים.",
    },
  ];

  return (
    <section
      className="relative w-full py-24 md:py-32 px-6 md:px-12"
      style={{ background: "var(--color-cream-blue)" }}
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
          style={{ color: "var(--color-navy)" }}
        >
          מה שחשוב לדעת
        </motion.h2>

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
      </div>
    </section>
  );
}

function FaqItem({
  item,
  isOpen,
  onClick,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      variants={faqItemVariants}
      className="rounded-[10px] overflow-hidden no-select-card"
      style={{
        boxShadow: "0 8px 30px rgba(15, 37, 69, 0.1)",
      }}
    >
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between gap-4 px-6 md:px-8 py-6 text-right"
        style={{ background: "var(--color-navy)" }}
      >
        <span
          className="text-lg md:text-xl font-bold text-white"
          style={{ fontFamily: "Bona Nova S, serif" }}
        >
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold"
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
                className="text-base md:text-lg leading-relaxed"
                style={{ color: "var(--color-navy)" }}
              >
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------------------------------------
   REGISTRATION SECTION (with auto-focus + checkmark)
--------------------------------------------- */
function RegistrationSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phone: "",
    track: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [phoneComplete, setPhoneComplete] = useState(false);

  const trackSelectRef = useRef<HTMLSelectElement>(null);

  const tracks = [
    "המסלול הלימודי המלא – שנתיים",
    "חצי יום לימוד וחצי יום עבודה – 3 שנים",
    "המסלול האקסטרני",
    "מסלול השלוחים",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length === 10) {
        setPhoneComplete(true);
        // Auto-focus the next field (track select)
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
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({ fullName: "", age: "", phone: "", track: "" });
      setPhoneComplete(false);

      setTimeout(() => {
        setShowToast(false);
      }, 3500);
    }, 1800);
  };

  return (
    <section
      className="relative w-full py-24 md:py-32 px-6 md:px-12"
      style={{ background: "#fbf3df" }}
    >
      <div className="max-w-3xl mx-auto text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-bold mb-6"
          style={{ color: "var(--color-navy)" }}
        >
          המקום שלך לפרוץ, להתקדם ולבנות את העתיד שלך.
        </motion.h2>
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

      <motion.form
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto rounded-[10px] p-8 md:p-12 flex flex-col gap-6"
        style={{
          background: "#ffffff",
          boxShadow: "0 10px 40px rgba(201, 162, 75, 0.25)",
          border: "1px solid rgba(201, 162, 75, 0.3)",
        }}
      >
        <FormField
          label="שם מלא"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          type="text"
          required
        />
        <FormField
          label="גיל"
          name="age"
          value={formData.age}
          onChange={handleChange}
          type="number"
          required
        />
        <FormField
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
            className="text-sm md:text-base font-semibold"
            style={{ color: "var(--color-navy)" }}
          >
            המסלול שמעניין אותך
          </label>
          <select
            ref={trackSelectRef}
            name="track"
            value={formData.track}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg text-[16px] outline-none transition-colors"
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
          className="mt-4 w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] disabled:opacity-80"
          style={{
            background: "var(--color-navy)",
            color: "var(--color-gold-light)",
          }}
        >
          {isSubmitting ? (
            <>
              <span
                className="inline-block w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "var(--color-gold-light)", borderTopColor: "transparent" }}
              />
              שולח...
            </>
          ) : (
            "[ שלח פרטים ]"
          )}
        </motion.button>
      </motion.form>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 40, x: "-50%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-28 left-1/2 z-[200] px-6 py-4 rounded-xl flex items-center gap-3"
            style={{
              background: "var(--color-navy)",
              color: "var(--color-gold-light)",
              boxShadow: "0 10px 40px rgba(15, 37, 69, 0.4)",
              border: "1px solid var(--color-gold)",
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: "var(--color-gold-light)" }}
            />
            <span className="font-semibold text-base">הפרטים בדרך אלינו</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FormField({
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  required?: boolean;
  showCheck?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-sm md:text-base font-semibold"
        style={{ color: "var(--color-navy)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 rounded-lg text-[16px] outline-none transition-colors"
          style={{
            border: "2px solid var(--color-gold)",
            color: "var(--color-navy)",
            background: "#fffdf7",
          }}
        />
        <AnimatePresence>
          {showCheck && (
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "#2e9e5b" }}
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
    </div>
  );
}

/* ---------------------------------------------
   FOOTER (minimal, sits above the Dock, not blocky)
--------------------------------------------- */
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full pt-14 pb-32 px-6 text-center flex flex-col items-center gap-3"
      style={{ background: "var(--color-navy)" }}
    >
      <p
        className="text-base md:text-lg font-semibold"
        style={{ color: "#ffffff", fontFamily: "Bona Nova S, serif" }}
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
   WHATSAPP FLOATING BUTTON (Shared Layout Magic)
--------------------------------------------- */
function WhatsAppFloatingButton({ isAtBottom }: { isAtBottom: boolean }) {
  return (
    <AnimatePresence>
      {!isAtBottom && (
        <motion.a
          href="https://wa.me/972000000000"
          target="_blank"
          rel="noopener noreferrer"
          layoutId="whatsapp-morph"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed z-[90] flex items-center justify-center rounded-full no-select-card"
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
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
   BOTTOM DOCK (replaces standard footer)
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
    >
      <div
        className="flex items-center gap-1 md:gap-2 px-4 py-3 rounded-3xl w-full max-w-md justify-between no-select-card"
        style={{
          background: "rgba(15, 37, 69, 0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(15, 37, 69, 0.3)",
        }}
      >
        {/* Item 1 (Rightmost): ייעוץ - WhatsApp morph target */}
        <DockItem label="ייעוץ">
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

        {/* Item 2: לגלות עוד - Compass, bounces every 10s */}
        <DockItem label="לגלות עוד">
          <motion.div
            animate={bounce ? { y: [0, -8, 0, -4, 0] } : { y: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="w-9 h-9 flex items-center justify-center text-2xl"
          >
            🧭
          </motion.div>
        </DockItem>

        {/* Item 3 (Center): בית - Prominent Gold Circle */}
        <div className="flex flex-col items-center gap-1 -mt-6">
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "var(--color-gold)",
              boxShadow: "0 6px 20px rgba(201, 162, 75, 0.6)",
              border: "3px solid var(--color-cream)",
            }}
          >
            <HomeIcon color="var(--color-navy-deep)" />
          </motion.div>
          <span className="text-[11px] font-semibold" style={{ color: "var(--color-gold-light)" }}>
            בית
          </span>
        </div>

        {/* Item 4: מהפעילות */}
        <DockItem label="מהפעילות">
          <div className="w-9 h-9 flex items-center justify-center">
            <ActivityIcon />
          </div>
        </DockItem>

        {/* Item 5 (Leftmost): חנות */}
        <DockItem label="חנות">
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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1 flex-1"
    >
      {children}
      <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
        {label}
      </span>
    </motion.button>
  );
}

/* ---------------------------------------------
   DOCK ICONS
--------------------------------------------- */
function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
      <path d="M9.5 20v-5.5h5V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
