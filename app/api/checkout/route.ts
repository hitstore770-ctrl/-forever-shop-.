import { NextResponse } from "next/server";

// Mock payment-gateway "session create" endpoint — simulates the first leg
// of an Israeli payment gateway integration (e.g. Tranzila/Cardcom/Grow),
// where you create a transaction server-side and get back a URL to redirect
// the donor to. There's no real gateway behind this yet: the "paymentUrl" is
// our own mock terminal page (app/checkout/mock-gateway), which simulates
// the approve/decline step before app/api/checkout/confirm finalizes it.
//
// TODO: once a real gateway is chosen, this is where you'd call its
// "create transaction" API with the amount + a callback URL, and return
// *their* hosted payment page URL instead of our mock one.

type CartItemInput = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type CheckoutRequestBody = {
  items: CartItemInput[];
  donorName: string;
};

function isValidItems(items: unknown): items is CartItemInput[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number" &&
        item.quantity > 0,
    )
  );
}

export async function POST(request: Request) {
  let body: Partial<CheckoutRequestBody>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  if (!isValidItems(body.items)) {
    return NextResponse.json({ error: "עגלת התרומות ריקה או לא תקינה" }, { status: 400 });
  }

  // Recompute the total server-side rather than trusting a client-sent figure.
  const amount = body.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const transactionId = `tx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  return NextResponse.json({
    transactionId,
    amount,
    paymentUrl: `/checkout/mock-gateway?tx=${transactionId}`,
  });
}
