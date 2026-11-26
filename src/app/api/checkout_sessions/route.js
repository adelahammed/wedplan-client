import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/core/server";

export async function POST(req) {
  const userSession = await getSession();

  if (!userSession?.user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const role = (userSession.user.role || "").toLowerCase();
  if (role !== "vendor") {
    return NextResponse.json(
      { error: "Only verified vendors are authorized to purchase vendor subscriptions." },
      { status: 403 }
    );
  }

  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    let plan = "Platinum Signature";
    let amount = "150.00";
    try {
      const formData = await req.formData();
      if (formData.get("plan")) plan = formData.get("plan");
      if (formData.get("amount")) amount = formData.get("amount");
    } catch {}

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1Uf2sPCFBtYANc11UsFaw8Wo",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession.user.email,
      metadata: {
        userId: userSession.user.id || "",
        email: userSession.user.email || "",
        plan,
        amount,
      },
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel?session_id={CHECKOUT_SESSION_ID}&canceled=true`,
      integration_identifier: "wedplan-subscription",
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
