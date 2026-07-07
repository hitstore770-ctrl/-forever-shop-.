"use client";

import { motion } from "framer-motion";
import { MessageIcon } from "@/components/icons";
import { DoodleTape, DoodleBoldArrow } from "@/components/doodles";
import { WHATSAPP_DISPLAY, buildWhatsAppLink } from "@/lib/site-config";

// Jagged top/bottom edges via clip-path, like a page torn off a notepad.
// box-shadow doesn't follow clip-path, so the hard offset shadow below uses
// filter: drop-shadow instead, which does.
const TORN_PAPER_CLIP =
  "polygon(0% 2%, 4% 0%, 9% 3%, 14% 0%, 19% 2%, 24% 0%, 29% 3%, 34% 0%, 39% 2%, 44% 0%, 49% 3%, 54% 0%, 59% 2%, 64% 0%, 69% 3%, 74% 0%, 79% 2%, 84% 0%, 89% 3%, 94% 0%, 100% 2%, 100% 98%, 96% 100%, 91% 97%, 86% 100%, 81% 98%, 76% 100%, 71% 97%, 66% 100%, 61% 98%, 56% 100%, 51% 97%, 46% 100%, 41% 98%, 36% 100%, 31% 97%, 26% 100%, 21% 98%, 16% 100%, 11% 97%, 6% 100%, 0% 98%)";

// "Massive" WhatsApp CTA styled like an urgent note torn off a pad and
// pinned up — jagged edges, a rotation, tape at both corners.
export default function WhatsAppUrgentNote() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto max-w-3xl"
      style={{ filter: "drop-shadow(10px 10px 0 #000)" }}
    >
      <DoodleTape className="pointer-events-none absolute -top-3 right-8 z-10 h-8 w-28 -rotate-6 text-copper-300 sm:right-16" />
      <DoodleTape className="pointer-events-none absolute -bottom-3 left-8 z-10 hidden h-8 w-28 rotate-6 text-copper-300 sm:left-16 sm:block" />
      <DoodleBoldArrow className="pointer-events-none absolute -top-14 -left-6 hidden h-16 w-16 -rotate-45 text-navy-900/50 lg:block" />

      <div
        className="border-4 border-black bg-copper-400 px-8 py-14 text-center sm:px-16 sm:py-20"
        style={{ clipPath: TORN_PAPER_CLIP }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] text-navy-950/70 uppercase">דחוף? כתבו לנו עכשיו</p>

        <h2 className="mt-4 text-4xl leading-[0.95] font-semibold text-navy-950 uppercase sm:text-6xl">
          דברו איתנו
          <br />
          בוואטסאפ
        </h2>

        <p className="mt-6 font-mono text-3xl font-semibold tracking-widest text-navy-950 sm:text-5xl" dir="ltr">
          {WHATSAPP_DISPLAY}
        </p>

        <a
          href={buildWhatsAppLink("שלום, אשמח לקבל פרטים נוספים")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 border-4 border-black bg-navy-900 px-8 py-4 text-lg font-semibold text-cream uppercase shadow-brutal transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-brutal-none"
        >
          <MessageIcon className="h-6 w-6" />
          פתחו שיחה
        </a>
      </div>
    </motion.div>
  );
}
