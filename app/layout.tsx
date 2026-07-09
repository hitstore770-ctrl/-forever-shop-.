import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GlobalDoodleField from "@/components/GlobalDoodleField";
import BrandToaster from "@/components/ui/BrandToaster";
import { SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site-config";

// Assistant is a clean, modern Hebrew/Latin sans-serif — lighter and more
// legible than a traditional serif, aimed at a younger audience.
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

// NEXT_PUBLIC_SITE_URL should be set to the real production domain once
// deployed — it's what turns the relative OG/Twitter image paths below into
// the absolute URLs social platforms require. Falls back to localhost so
// local builds don't warn.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_TITLE,
    locale: "he_IL",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a4a88",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <GlobalDoodleField />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BrandToaster />
      </body>
    </html>
  );
}
