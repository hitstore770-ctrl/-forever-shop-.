"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MAP_BOUNDS, MAP_POINTS, type MapPoint } from "@/lib/map-config";

// Hand-drawn-feeling map of the yeshiva's corner of Jerusalem. Deliberately
// not an embedded Google map: a plain SVG built from the real coordinates in
// lib/map-config.ts, so it costs nothing to load, works offline and matches
// the site's paper-and-marker language. Pins fade in one after another, and
// tapping a pin shows a short note about the place.

const W = 1000;
const HEIGHT = 620;
const PAD = 70;

function project(point: { lat: number; lng: number }) {
  const x =
    PAD + ((MAP_BOUNDS.east - point.lng) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * (W - PAD * 2);
  const y =
    PAD + ((MAP_BOUNDS.north - point.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * (HEIGHT - PAD * 2);
  return { x, y };
}

export default function JerusalemMap() {
  const [activeId, setActiveId] = useState("yeshiva");
  const yeshiva = MAP_POINTS.find((p) => p.kind === "yeshiva") as MapPoint;
  const active = MAP_POINTS.find((p) => p.id === activeId) ?? yeshiva;
  const origin = project(yeshiva);

  return (
    <div>
      <div className="relative border-2 border-black bg-cream shadow-brutal">
        <svg
          viewBox={`0 0 ${W} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label="מפת הסביבה של הישיבה במרכז ירושלים"
        >
          {/* paper grid */}
          <g stroke="currentColor" className="text-navy-900/10">
            {Array.from({ length: 11 }).map((_, i) => (
              <line key={`v${i}`} x1={(W / 10) * i} y1={0} x2={(W / 10) * i} y2={HEIGHT} strokeWidth="1" />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={(HEIGHT / 6) * i} x2={W} y2={(HEIGHT / 6) * i} strokeWidth="1" />
            ))}
          </g>

          {/* walking lines from the yeshiva to every other point */}
          {MAP_POINTS.filter((p) => p.kind !== "yeshiva").map((p, i) => {
            const to = project(p);
            const isActive = p.id === activeId;
            return (
              <motion.line
                key={p.id}
                x1={origin.x}
                y1={origin.y}
                x2={to.x}
                y2={to.y}
                stroke="currentColor"
                className={isActive ? "text-copper-600" : "text-navy-900/25"}
                strokeWidth={isActive ? 3 : 2}
                strokeDasharray="9 9"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: "easeOut" }}
              />
            );
          })}

          {MAP_POINTS.map((p, i) => {
            const { x, y } = project(p);
            const isYeshiva = p.kind === "yeshiva";
            const isActive = p.id === activeId;
            const r = isYeshiva ? 17 : 12;
            return (
              <motion.g
                key={p.id}
                initial={{ opacity: 0, y: -14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.13, ease: "easeOut" }}
                onClick={() => setActiveId(p.id)}
                className="cursor-pointer"
              >
                {isActive && <circle cx={x} cy={y} r={r + 12} className="fill-copper-400/35" />}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  className={isYeshiva ? "fill-copper-400" : isActive ? "fill-navy-900" : "fill-white"}
                  stroke="black"
                  strokeWidth="3"
                />
                {isYeshiva && (
                  <path
                    d={`M${x - 7} ${y + 4} L${x} ${y - 6} L${x + 7} ${y + 4} Z`}
                    fill="black"
                  />
                )}
                <text
                  x={x}
                  y={y + r + 26}
                  textAnchor="middle"
                  className={isActive ? "fill-navy-950" : "fill-navy-900/80"}
                  style={{ fontSize: 26, fontWeight: 600 }}
                >
                  {p.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* tap targets that double as a legend — keyboard reachable, unlike the SVG */}
      <div className="mt-4 flex flex-wrap gap-2">
        {MAP_POINTS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            aria-pressed={p.id === activeId}
            className={`min-h-11 border-2 border-black px-3 py-1.5 text-sm font-semibold transition-all ${
              p.id === activeId
                ? "bg-navy-900 text-cream shadow-brutal"
                : "bg-white text-navy-900 hover:bg-cream-dark"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="mt-4 border-r-4 border-copper-500 pr-4 text-base text-navy-800">
        <span className="font-semibold text-navy-950">{active.label}:</span> {active.note}
      </p>
    </div>
  );
}
