import "server-only";
import { getZmanimJson } from "kosher-zmanim";

// Halachic times ("זמני היום") are computed for the yeshiva's location —
// עיה"ק ירושלים — not the visitor's, since the sedarim happen at the yeshiva.
// kosher-zmanim is a pure-JS port of KosherJava: no API key, no network call,
// just an astronomical calculation, so this works fully server-side/offline.
const JERUSALEM = {
  latitude: 31.7683,
  longitude: 35.2137,
  elevation: 754,
  timeZoneId: "Asia/Jerusalem",
} as const;

// The curated set we surface, in day order, with Hebrew labels.
const SELECTED: { key: string; label: string }[] = [
  { key: "AlosHashachar", label: "עלות השחר" },
  { key: "Sunrise", label: "הנץ החמה" },
  { key: "SofZmanShmaGRA", label: 'סוף זמן ק"ש (גר"א)' },
  { key: "SofZmanTfilaGRA", label: 'סוף זמן תפילה (גר"א)' },
  { key: "Chatzos", label: "חצות היום" },
  { key: "MinchaGedola", label: "מנחה גדולה" },
  { key: "PlagHamincha", label: "פלג המנחה" },
  { key: "Sunset", label: "שקיעה" },
  { key: "Tzais", label: "צאת הכוכבים" },
];

export type Zman = { key: string; label: string; time: string };
export type ZmanimToday = { date: string; hebrewWeekday: string; items: Zman[] };

// Today's date in Jerusalem as YYYY-MM-DD, independent of the server's own
// timezone (Vercel runs UTC — near midnight that would otherwise be the wrong
// day).
function jerusalemDateISO(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

// Format an ISO instant to "HH:mm" wall-clock in Jerusalem.
function toJerusalemHHmm(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function getJerusalemZmanim(now: Date = new Date()): ZmanimToday {
  const date = jerusalemDateISO(now);
  const json = getZmanimJson({ date, ...JERUSALEM });
  const basic = (json.BasicZmanim ?? {}) as Record<string, string | null>;

  const items: Zman[] = SELECTED.flatMap(({ key, label }) => {
    const iso = basic[key];
    return iso ? [{ key, label, time: toJerusalemHHmm(iso) }] : [];
  });

  const hebrewWeekday = new Intl.DateTimeFormat("he-IL", {
    timeZone: "Asia/Jerusalem",
    weekday: "long",
  }).format(now);

  return { date, hebrewWeekday, items };
}
