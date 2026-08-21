"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { HOME_VIDEO } from "@/lib/home-data";

// The payoff on the other side of the door. The last frames of the canvas
// sequence wash out to pearl, and this section opens on the same pearl, so the
// two read as one continuous move rather than two stacked blocks.
//
// Playback is tap-to-start rather than autoplay: the poster is all that loads
// up front (preload="none"), so arriving on the home page over cellular does
// not quietly pull down a video. The <video> element is only given its source
// after the first tap, which also satisfies iOS's user-gesture requirement.

const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function VideoReveal() {
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const handlePlay = () => {
    setHasStarted(true);
    // Wait for the source to be attached by the re-render before playing.
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => {
        /* autoplay policies / unsupported source — controls remain available */
      });
    });
  };

  return (
    <section className="relative bg-linear-to-b from-pearl to-white px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: EASE_LUX }}
          className="text-center"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-copper-600 uppercase">
            מעבר לדלת
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-navy-950 sm:text-5xl">
            {HOME_VIDEO.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-navy-900/60 sm:text-lg">
            {HOME_VIDEO.description}
          </p>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE_LUX, delay: 0.1 }}
          className="relative mt-10 aspect-video w-full overflow-hidden rounded-3xl bg-navy-950 shadow-lux-lg sm:mt-14"
        >
          {hasStarted && HOME_VIDEO.src ? (
            <video
              ref={videoRef}
              src={HOME_VIDEO.src}
              poster={HOME_VIDEO.poster}
              controls
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={HOME_VIDEO.src ? handlePlay : undefined}
              disabled={!HOME_VIDEO.src}
              aria-label={HOME_VIDEO.src ? `נגן את ${HOME_VIDEO.title}` : "הסרטון טרם הועלה"}
              className="group relative h-full w-full cursor-pointer disabled:cursor-default"
            >
              {HOME_VIDEO.poster ? (
                // eslint-disable-next-line @next/next/no-img-element -- poster is a plain decorative still; next/image adds nothing here
                <img
                  src={HOME_VIDEO.poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,var(--color-navy-700),var(--color-navy-950))]" />
              )}

              <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-lux-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="ms-1 h-8 w-8 text-navy-900"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-white/80">
                  {HOME_VIDEO.src ? "הקש לצפייה" : "הסרטון יעלה בקרוב"}
                </span>
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
