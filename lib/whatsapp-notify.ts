import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/site-config";
import type { DonationRecord } from "@/lib/admin-data";

// Server-only. Notifies the admin's WhatsApp (WHATSAPP_NUMBER from
// site-config, currently 055-688-3418) the moment a
// dedication is paid for, so staff don't have to keep refreshing the admin
// panel to catch new donations.
//
// TODO: point WHATSAPP_WEBHOOK_URL at a real WhatsApp Business API provider
// (e.g. Twilio, MessageBird, or Meta's Cloud API) once credentials exist.
// Until then this just logs what *would* be sent.
const WHATSAPP_WEBHOOK_URL = process.env.WHATSAPP_WEBHOOK_URL;

export async function notifyAdminOfDonation(donation: Omit<DonationRecord, "id">): Promise<void> {
  const message = [
    "🎉 הקדשה חדשה התקבלה!",
    `תורם: ${donation.donorName}`,
    `סוג: ${donation.tier}`,
    `סכום: ₪${donation.amount}`,
    `תאריך: ${donation.date}`,
  ].join("\n");

  if (!WHATSAPP_WEBHOOK_URL) {
    console.log(`[WhatsApp webhook placeholder] Would notify ${WHATSAPP_DISPLAY} (${WHATSAPP_NUMBER}):\n${message}`);
    return;
  }

  try {
    await fetch(WHATSAPP_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: WHATSAPP_NUMBER, message }),
    });
  } catch (error) {
    // A failed notification shouldn't fail the checkout — the donation is
    // already saved by this point, so just log it for follow-up.
    console.error("Failed to notify WhatsApp bot of new donation.", error);
  }
}
