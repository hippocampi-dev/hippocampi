import { stripe } from "~/utilities/stripe";
import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { getDoctorSubscription, setDoctorSubscription } from "~/server/db/queries";
import { DoctorSubscriptionsInterface } from "~/server/db/type";

export async function POST(request: NextRequest) {
  const body = await request.text();
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
      // console.log(session)
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const rawSubscription = JSON.parse(session.metadata!.subscription!); // all strings
      console.log(rawSubscription)
      const filteredSubscription: DoctorSubscriptionsInterface = {
        ...rawSubscription,
        startDate: rawSubscription.startDate ? new Date(rawSubscription.startDate) : null,
        cancelDate: rawSubscription.cancelDate ? new Date(rawSubscription.cancelDate) : null,
        created_at: new Date(rawSubscription.created_at),
        updated_at: new Date(rawSubscription.updated_at)
      }
      const id = filteredSubscription.doctorId as "string"

      const params: DoctorSubscriptionsInterface = {
        ...filteredSubscription,
        doctorId: id,
        stripeCustomerId: session.customer! as string,
        subscriptionId: subscription.id,
        status: 'subscribed',
        startDate: !filteredSubscription?.startDate ? new Date(subscription.start_date * 1000) : filteredSubscription.startDate,
      }

      setDoctorSubscription(id, params);
    }
    else if (event.type === 'customer.subscription.updated') {
      const session = event.data.object;
      const subscription = await getDoctorSubscription('string', session.customer as string)
      const canceledAt = session.canceled_at!;

      if (canceledAt) { // if user canceled subscription
        setDoctorSubscription(subscription?.doctorId as 'string', {
          ...subscription!,
          cancelDate: new Date(session.canceled_at! * 1000),
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
    }

    return NextResponse.json({ status: 'Success',  event: event.type });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 'Failed',  error });
  }
}

// webhook for testing
// stripe listen --forward-to localhost:3000/api/stripe/webhook/subscription
// stripe trigger payment_intent.succeeded