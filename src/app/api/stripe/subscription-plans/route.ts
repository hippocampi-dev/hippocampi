import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Plan } from '~/components/subscription-plans/SubscriptionPlans';
import { getUserRole } from '~/server/db/queries';
import { getUserId } from '~/utilities/getUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define feature arrays at the top level
const featuresPatient = [
  "Patient Features 1",
  "Patient Features 2",
  "Patient Features 3",
];

const featuresDoctors = [
  "Full support on administrative tasks",
  "Steady stream of new patients",
  "Competitive reinburstment rates",
];

export async function GET() {
  try {
    const userId = await getUserId() as 'string';
    const userRole = await getUserRole(userId);
    
    // Determine product ID based on role
    const productId = userRole?.userRole === 'doctor'
      ? 'prod_RhGDXvJrHUDpcj'
      : 'prod_Rp2PpooYhjF3rK';
      
    const features = userRole?.userRole === 'doctor' ? featuresDoctors : featuresPatient;
    // console.log(productId)

    // Get plans for the correct product
    const plans = await stripe.plans.list({
      active: true,
      product: productId
    });

    // Map plans synchronously and await inside the mapping function
    const formattedPlans = await Promise.all(
      plans.data.map(async (plan) => {
        const product = await stripe.products.retrieve(plan.product as string);
        return {
          id: plan.id,
          name: product.name,
          description: product.description!,
          price: plan.amount!,
          interval: plan.interval,
          plan_id: plan.id,
          features
        } as Plan;
      })
    );

    // console.log(formattedPlans);
    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching subscription plans' },
      { status: 500 }
    );
  }
}