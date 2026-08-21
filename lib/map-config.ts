// Real, verified-by-address Jerusalem coordinates used by the neighbourhood
// map (components/map/JerusalemMap.tsx). Nothing here is decorative: every
// point is a real place, so the map can stay honest while looking designed.
//
// NOTE: YESHIVA is placed at the yeshiva's street address (Yavetz 8, central
// Jerusalem). If the exact entrance differs, adjust lat/lng here only — the
// map, the route lines and the "open in Maps" links all read from this file.

export type MapPointKind = "yeshiva" | "place";

export type MapPoint = {
  id: string;
  label: string;
  note: string;
  lat: number;
  lng: number;
  kind: MapPointKind;
};

export const YESHIVA_ADDRESS = "יעבץ 8, מרכז ירושלים";

export const MAP_POINTS: MapPoint[] = [
  {
    id: "yeshiva",
    label: "הישיבה",
    note: "יעבץ 8 — סמטה שקטה בלב מרכז העיר, דקות הליכה מכל דבר.",
    lat: 31.7817,
    lng: 35.2158,
    kind: "yeshiva",
  },
  {
    id: "zion",
    label: "כיכר ציון",
    note: "המדרחוב והכיכר — שם יוצאים לפעילות ולריקודים.",
    lat: 31.7810,
    lng: 35.2189,
    kind: "place",
  },
  {
    id: "machane",
    label: "מחנה יהודה",
    note: "השוק — עשר דקות ברגל, הכי חי בעיר לפני שבת.",
    lat: 31.7852,
    lng: 35.2122,
    kind: "place",
  },
  {
    id: "light-rail",
    label: "הרכבת הקלה",
    note: "תחנת יפו מרכז — הדרך הנוחה להגיע מכל העיר.",
    lat: 31.7833,
    lng: 35.2166,
    kind: "place",
  },
  {
    id: "kotel",
    label: "הכותל",
    note: "רבע שעה נסיעה או הליכה דרך העיר העתיקה.",
    lat: 31.7767,
    lng: 35.2345,
    kind: "place",
  },
];

// Bounding box that comfortably contains every point above.
export const MAP_BOUNDS = { north: 31.7895, south: 31.7735, west: 35.2085, east: 35.2385 };

export function mapsLink(point: MapPoint) {
  return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
}
