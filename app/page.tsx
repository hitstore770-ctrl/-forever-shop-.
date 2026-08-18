"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { User, Plus, Minus, ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  FLOATING MASCOT                                                    */
/* ------------------------------------------------------------------ */
function FloatingMascot() {
  const { scrollY, scrollYProgress } = useScroll();
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [showBubble, setShowBubble] = useState(false);
  const [imgError, setImgError] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastY.current) {
      setDirection("down");
    } else if (latest < lastY.current) {
      setDirection("up");
    }
    lastY.current = latest;
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowBubble(latest >= 0.9);
  });

  return (
    <div className="fixed bottom-8 left-8 z-50 flex flex-col items-center pointer-events-none select-none">
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
