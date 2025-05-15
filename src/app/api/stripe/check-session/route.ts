import { NextResponse } from 'next/server';
import { stripe } from '~/utilities/stripe';

export async function POST(request: Request) {
  const { sessionId } = await request.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log(session)
    if (session.payment_status === 'paid') {
      console.log('payment success, doing db stuff');
      // Update your database to mark the user as subscribed
      // await updateUserSubscriptionStatus(session.client_reference_id, 'active');
    }

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}