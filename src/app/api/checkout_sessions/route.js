import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSession } from "@/lib/core/server";

export async function POST() {
  const userSession = await getSession();

  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: "price_1Uf2sPCFBtYANc11UsFaw8Wo",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userSession?.user.email,

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel?canceled=true`,
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
