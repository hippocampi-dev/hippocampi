import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { id } = await request.json(); // id of invoice obj from db
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.CONSULTATION_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${request.headers.get('origin')}/dashboard/patient`,
    cancel_url: `${request.headers.get('origin')}/dashboard/patient/invoices`, // url to payments
    metadata: { id: id }
  });

  return NextResponse.json({ sessionId: session.id })
}