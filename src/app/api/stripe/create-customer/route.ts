import { NextResponse } from "next/server";
import { stripe } from '~/utilities/stripe';

export async function POST(request: Request) {
  const { name, email } = await request.json();

  try {
    const customer = await stripe.customers.create({
      name: name,
      email: email
    });

    const id = customer.id // this is the stripe id

    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}


// Can you add this snippet when you create the customer
// It will create a Stripe customer inside of Stripe so we can send them an invoice
// This will return the Stripe customer id so we can place into the db

// const stripeCustomer = await fetch('api/stripe/create-customer', {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     name: `${basicParse.data.firstName} ${basicParse.data.lastName}`,
//     email: basicParse.data.email,
//   }),
// }).then(r => r.json()).then(r => r.response);
// if (!stripeCustomer.ok) throw new Error("Failed to add customer to Stripe");

// to get the id, call: stripeCustomer.id