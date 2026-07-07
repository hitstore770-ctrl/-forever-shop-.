import type { Metadata } from "next";
import { Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_NAME } from "@/lib/site-config";

// Frank Ruhl Libre gives the site a traditional, authentic Hebrew-book feel.
const frankRuhlLibre = Frank_Ruhl_Libre({
  variable: "--font-frank-ruhl",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "אתר הישיבה — לימוד, הצטרפות, פעילויות ותרומות.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${frankRuhlLibre.variable} h-full antialiased`}>
      {/*
        Phase 1 skeleton only. Future additions to this layout will likely include:
        - A FirebaseProvider / auth context wrapper (once Firebase is wired up)
        - A global toast/notification provider
        - Analytics scripts (e.g. Google Analytics, Meta Pixel)
      */}
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
