import { stripe } from '~/utilities/stripe';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json(); // id of invoice obj from db
  // console.log(body)
  
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ['card'],
    line_items: [
      {
        price: body.priceId,
        quantity: 1,
      },
    ],
    success_url: `${request.headers.get('origin')}/dashboard/patient`,
    cancel_url: `${request.headers.get('origin')}/dashboard/patient/invoices`, // url to payments
    metadata: { id: body.id }
  });

  return NextResponse.json({ sessionId: session.id })
}