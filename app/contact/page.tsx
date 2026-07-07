import type { Metadata } from "next";
import PagePlaceholder from "@/components/PagePlaceholder";
import { WHATSAPP_DISPLAY } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "צור קשר",
};

// Contact page.
// Planned for a later phase:
// - A contact form (likely posting to a Firebase Function or a form service)
// - Embedded map (e.g. Google Maps) once the physical address is available
export default function ContactPage() {
  return (
    <PagePlaceholder title="צור קשר" description={`ניתן ליצור קשר גם בוואטסאפ: ${WHATSAPP_DISPLAY}`} />
  );
}
