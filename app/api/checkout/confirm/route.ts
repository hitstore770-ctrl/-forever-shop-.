import { NextResponse } from "next/server";
import { addDonation } from "@/lib/admin-data";
import { notifyAdminOfDonation } from "@/lib/whatsapp-notify";

// Mock payment-gateway "webhook" — simulates the callback a real gateway
// would hit once the donor approves payment on its hosted page. Called by
// our mock terminal (app/checkout/mock-gateway) after the donor clicks
// "אשר תשלום". A real integration would verify the gateway's signature here
// before trusting the payload; this endpoint trusts it since it's mock-only.

type CartItemInput = {
  title: string;
  price: number;
  quantity: number;
};

type ConfirmRequestBody = {
  items: CartItemInput[];
  donorName: string;
};

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

export async function POST(request: Request) {
  let body: Partial<ConfirmRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "אין פריטים לאישור" }, { status: 400 });
  }

  const amount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tier = body.items.map((item) => `${item.title} (×${item.quantity})`).join(", ");
  const donation = {
    date: formatDate(new Date()),
    donorName: body.donorName?.trim() || "אנונימי",
    tier,
    amount,
    status: "שולם" as const,
  };

  await addDonation(donation);
  await notifyAdminOfDonation(donation);

  return NextResponse.json({ success: true });
}
