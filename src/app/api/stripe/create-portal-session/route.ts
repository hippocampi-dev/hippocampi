// only for subscriptions

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDoctorSubscription } from '~/server/db/queries';
import { getUserId } from '~/utilities/get-user';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    // Get the customer ID from your database based on the authenticated user
    const id = await getUserId() as 'string';
    const subscription = await getDoctorSubscription(id);
    const customerId = subscription?.stripeCustomerId as string; // Replace with actual customer ID retrieval logic

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.headers.get('origin')}/dashboard/doctor/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating portal session' }, { status: 500 });
  }
}