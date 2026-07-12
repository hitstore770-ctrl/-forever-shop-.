import { NextResponse } from "next/server";
import { getJerusalemZmanim } from "@/lib/zmanim";

// Always compute fresh for the current Jerusalem day — never cache at build.
export const dynamic = "force-dynamic";

// Public endpoint: today's halachic times for Jerusalem. Keeps the zmanim
// library (and Luxon) out of the client bundle — the browser just fetches
// this small JSON.
export async function GET() {
  try {
    return NextResponse.json(getJerusalemZmanim());
  } catch (error) {
    console.error("Failed to compute zmanim", error);
    return NextResponse.json({ error: "לא הצלחנו לחשב את זמני היום." }, { status: 500 });
  }
}
