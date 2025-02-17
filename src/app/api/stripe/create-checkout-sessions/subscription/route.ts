import Stripe from "stripe";
import { NextResponse } from "next/server";
import { DoctorSubscriptionsInterface } from "~/server/db/type";
import { getDoctorSubscription } from "~/server/db/queries";
import { getUserId } from "~/utilities/get-user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { priceId } = await request.json();

  const id = await getUserId() as "string";
  const metadata = await getDoctorSubscription(id);

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      subscription: JSON.stringify(metadata)
    },
    success_url: `${request.headers.get('origin')}/dashboard/doctor`,
    cancel_url: `${request.headers.get('origin')}/checkout/subscription`,
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