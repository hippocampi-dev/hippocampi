import { NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring',
    });

    // Type guard to ensure price.product exists and is valid
    const validateProduct = (product: unknown): product is Stripe.Product => {
      return (
        product !== null &&
        product !== undefined &&
        typeof product === 'object' &&
        'id' in product &&
        'name' in product &&
        'description' in product
      );
    };

    const plans = prices.data.map(price => {
      // Check if price.product exists and is valid
      if (!validateProduct(price.product)) {
        throw new Error('Invalid product data received from Stripe');
      }

      return {
        id: price.id,
        name: price.product.name,
        description: price.product.description,
        price: price.unit_amount,
        interval: price.recurring!.interval,
        price_id: price.id,
      };
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching subscription plans' },
      { status: 500 }
    );
  }
}