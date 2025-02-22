import { stripe } from "~/utilities/stripe";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { getTargetInvoice, setInvoice } from "~/server/db/queries";
import { InvoicesInterface } from "~/server/db/type";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    const stripeSignature = (await headers()).get('stripe-signature');
    event = stripe.webhooks.constructEvent(
      await request.text(),
      stripeSignature as string,
      process.env.STRIPE_INVOICE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    if (err! instanceof Error) console.log(err);
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      {message: `Webhook Error: ${errorMessage}`},
      {status: 400}
    );
  }

  const permittedEvents: string[] = [
    'checkout.session.completed',
    'payment.'
  ];

  let data;

  if (permittedEvents.includes(event.type)) {
    // console.log(event.data);
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session
    
          const oldInvoice = await getTargetInvoice(data.metadata!.id!);
          console.log(data);
    
          const invoice: InvoicesInterface = {
            ...oldInvoice!,
            stripePaymentId: data.payment_intent as string,
            status: 'paid'
          };
    
          const result = await setInvoice(invoice);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {message: 'Webhook handler failed'},
        {status: 500}
      );
    }
  }

  return NextResponse.json({message: 'Received'}, {status: 200});
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      Allow: "POST",
    },
  });
}

// webhook for testing
// stripe login
// stripe listen --forward-to localhost:3000/api/stripe/webhook/invoice
// stripe trigger payment_intent.succeeded