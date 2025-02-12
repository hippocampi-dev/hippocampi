import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { priceId } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${request.headers.get('origin')}/checkout/cancel`,
  });

  return NextResponse.json({ sessionId: session.id })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      Allow: "POST",
    },
  });
}