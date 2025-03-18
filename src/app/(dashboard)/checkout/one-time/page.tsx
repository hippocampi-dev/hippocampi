'use client'

import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
const priceID = 'price_1QnrfxDOGzHyZjJng2sXhkSq'

export default function Checkout() {
  const handleCheckout = async (priceId: string) => {
    const stripe = await stripePromise;
    
    try {
      const { sessionId } = await fetch('/api/create-checkout-sessions/one-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      }).then(res => res.json());

      const result = await stripe!.redirectToCheckout({ sessionId });
      
      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div>
      <h1>Stripe Checkout (One-time)</h1>
      <button onClick={() => handleCheckout(priceID)}>Checkout</button>
    </div>
  );
}