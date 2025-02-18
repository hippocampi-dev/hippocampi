import { stripe } from "~/utilities/stripe";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { getTargetInvoice, setInvoice } from "~/server/db/queries";
import { InvoicesInterface } from "~/server/db/type";

export async function POST(request: NextRequest) {
  const body = await request.text(); // pass id
  const signature = request.headers.get("Stripe-Signature") as string;

  try {
    let event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // console.log('event', event)

    // console.log('session', session);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const oldInvoice = await getTargetInvoice(session.metadata!.id!)

      const invoice: InvoicesInterface = {
        ...oldInvoice!,
        status: 'paid'
      };

      setInvoice(invoice);
    }

    return NextResponse.json({ status: 'Success',  event: event.type });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 'Failed',  error });
  }
}

// webhook for testing
// stripe login
// stripe listen --forward-to localhost:3000/api/stripe/webhook/invoice
// stripe trigger payment_intent.succeeded