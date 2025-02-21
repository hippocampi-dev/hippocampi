"use client"

import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { loadStripe } from '@stripe/stripe-js';
import Loading from "../loading/page";

// Define types for your plans
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  price_id: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const features = [
  "Full support on administrative tasks",
  "Steady stream of new patients",
  "Competitive reinburstment rates",
];

export default function SubscriptionPlans() {
  const [loading, setLoading] = useState<boolean>(false)
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    // Fetch subscription plans from your API
    fetch('/api/stripe/subscription-plans')
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    const stripe = await stripePromise;
    
    try {
      const { sessionId } = await fetch('/api/stripe/create-checkout-sessions/subscription', {
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
      console.error('Subscription failed:', error);
    }
  };

  if (plans.length === 0) {
    return <Loading />
  }

  return (
    <div className="w-full">
      {plans.map((plan) => (
        <Card key={plan.id} className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">
              {plan.name}
            </CardTitle>
            <CardDescription>
              <span className="text-6xl">
                ${plan.price / 100}
              </span> / month
              </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleSubscribe(plan.id)} disabled={loading}>
              {loading ? "Processing..." : "Subscribe"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}