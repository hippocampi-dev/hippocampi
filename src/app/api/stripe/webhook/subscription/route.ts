import { stripe } from "~/utilities/stripe";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { getDoctorSubscription, setDoctorSubscription } from "~/server/db/queries";
import { DoctorSubscriptionsInterface } from "~/server/db/type";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    const stripeSignature = (await headers()).get('stripe-signature');
    event = stripe.webhooks.constructEvent(
      await request.text(),
      stripeSignature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
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
    'customer.subscription.updated',
  ];

  let data;
  let subscription;

  if (permittedEvents.includes(event.type)) {
    // console.log(event.data);
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session;
          subscription = await stripe.subscriptions.retrieve(data.subscription as string);
          const rawSubscription = JSON.parse(data.metadata!.subscription!); // all strings

          const filteredSubscription: DoctorSubscriptionsInterface = {
            ...rawSubscription,
            startDate: rawSubscription.startDate ? new Date(rawSubscription.startDate) : null,
            cancelDate: rawSubscription.cancelDate ? new Date(rawSubscription.cancelDate) : null,
          };
          const id = filteredSubscription.doctorId as "string";
        
          const params: DoctorSubscriptionsInterface = {
            ...filteredSubscription,
            doctorId: id,
            stripeCustomerId: data.customer! as "string",
            subscriptionId: subscription.id as "string",
            status: 'subscribed',
            startDate: !filteredSubscription?.startDate ? new Date(subscription.start_date * 1000) : filteredSubscription.startDate,
          };
        
          const result = await setDoctorSubscription(id, params);
          break;
        case 'customer.subscription.updated':
          data = event.data.object;
          subscription = await getDoctorSubscription('string', data.customer as string)
          const canceledAt = data.canceled_at!;
        
          if (canceledAt) { // if user canceled subscription
            setDoctorSubscription(subscription?.doctorId as 'string', {
              ...subscription!,
              cancelDate: new Date(data.canceled_at! * 1000),
              status: 'unsubscribed'
            });
          }
          else {
            setDoctorSubscription(subscription?.doctorId as 'string', {
              ...subscription!,
              cancelDate: null,
              status: 'subscribed'
            });
          }
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
// stripe listen --forward-to localhost:3000/api/stripe/webhook/subscription
// stripe trigger payment_intent.succeeded