import Stripe from "stripe";
import { getStripeSecretKey } from "~/env";

export const stripe = new Stripe(getStripeSecretKey(), {
  apiVersion: '2025-01-27.acacia',
  typescript: true
});