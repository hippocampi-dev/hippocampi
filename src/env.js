import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    // Production
    DATABASE_URL_PROD: z.string().url(),
    SUPABASE_PROJECT_URL_PROD: z.string().url(),
    SUPABASE_API_KEY_PROD: z.string(),
    SUPABASE_SERVICE_KEY_PROD: z.string(),
    STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_PROD: z.string(),
    STRIPE_INVOICE_WEBHOOK_SECRET_PROD: z.string(),
    STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_PROD: z.string(),
    STRIPE_SECRET_KEY_PROD: z.string(),
    
    // Development
    DATABASE_URL_DEV: z.string().url(),
    SUPABASE_PROJECT_URL_DEV: z.string().url(),
    SUPABASE_API_KEY_DEV: z.string(),
    SUPABASE_SERVICE_KEY_DEV: z.string(),
    STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_DEV: z.string(),
    STRIPE_INVOICE_WEBHOOK_SECRET_DEV: z.string(),
    STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_DEV: z.string(),
    STRIPE_SECRET_KEY_DEV: z.string(),

    // Actual
    // DATABASE_URL: z.string().url().optional(),
    // SUPABASE_PROJECT_URL: z.string().url().optional(),
    // SUPABASE_API_KEY: z.string().optional(),
    // SUPABASE_SERVICE_KEY: z.string().optional(),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    // Production
    DATABASE_URL_PROD: process.env.DATABASE_URL_PROD,
    SUPABASE_PROJECT_URL_PROD: process.env.SUPABASE_PROJECT_URL_PROD,
    SUPABASE_API_KEY_PROD: process.env.SUPABASE_API_KEY_PROD,
    SUPABASE_SERVICE_KEY_PROD: process.env.SUPABASE_SERVICE_KEY_PROD,
    STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_PROD: process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_PROD,
    STRIPE_INVOICE_WEBHOOK_SECRET_PROD: process.env.STRIPE_INVOICE_WEBHOOK_SECRET_PROD,
    STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_PROD: process.env.STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_PROD,
    STRIPE_SECRET_KEY_PROD: process.env.STRIPE_SECRET_KEY_PROD,

    // Development
    DATABASE_URL_DEV: process.env.DATABASE_URL_DEV,
    SUPABASE_PROJECT_URL_DEV: process.env.SUPABASE_PROJECT_URL_DEV,
    SUPABASE_API_KEY_DEV: process.env.SUPABASE_API_KEY_DEV,
    SUPABASE_SERVICE_KEY_DEV: process.env.SUPABASE_SERVICE_KEY_DEV,
    STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_DEV: process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_DEV,
    STRIPE_INVOICE_WEBHOOK_SECRET_DEV: process.env.STRIPE_INVOICE_WEBHOOK_SECRET_DEV,
    STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_DEV: process.env.STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_DEV,
    STRIPE_SECRET_KEY_DEV: process.env.STRIPE_SECRET_KEY_DEV,

    // Actual
    // DATABASE_URL: process.env.DATABASE_URL,
    // SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL,
    // SUPABASE_API_KEY: process.env.SUPABASE_API_KEY,
    // SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,

    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

// Helper function to get the appropriate database URL based on environment
export function getDatabaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return env.DATABASE_URL_PROD;
  } else {
    return env.DATABASE_URL_DEV;
  }
}

export function getSupabaseProjectUrl() {
  if (process.env.NODE_ENV === "production") {
    return env.SUPABASE_PROJECT_URL_PROD;
  } else {
    return env.SUPABASE_PROJECT_URL_DEV;
  }
}
export function getSupabaseApiKey() {
  if (process.env.NODE_ENV === "production") {
    return env.SUPABASE_API_KEY_PROD;
  } else {
    return env.SUPABASE_API_KEY_DEV;
  }
}
export function getSupabaseServiceKey() {
  if (process.env.NODE_ENV === "production") {
    return env.SUPABASE_SERVICE_KEY_PROD;
  } else {
    return env.SUPABASE_SERVICE_KEY_DEV;
  }
}

export function getStripeSubscriptionWebhookSecret() {
  if (process.env.NODE_ENV === "production") {
    return env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_PROD;
  } else {
    return env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET_DEV;
  }
}
export function getStripeInvoiceWebhookSecret() {
  if (process.env.NODE_ENV === "production") {
    return env.STRIPE_INVOICE_WEBHOOK_SECRET_PROD;
  } else {
    return env.STRIPE_INVOICE_WEBHOOK_SECRET_DEV;
  }
}
export function getStripeDoctorSubscriptionProductId() {
  if (process.env.NODE_ENV === "production") {
    return env.STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_PROD;
  } else {
    return env.STRIPE_DOCTOR_SUBSCRIPTION_PRODUCT_ID_DEV;
  }
}
export function getStripeConsultationPriceID() {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_STRIPE_CONSULTATION_PRICE_ID_PROD;
  } else {
    return process.env.NEXT_PUBLIC_STRIPE_CONSULTATION_PRICE_ID_DEV;
  }
}
export function getStripePublishableKey() {
  if (process.env.NODE_ENV === "production") {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD;
  } else {
    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_DEV;
  }
}
export function getStripeSecretKey() {
  if (process.env.NODE_ENV === "production") {
    return env.STRIPE_SECRET_KEY_PROD;
  } else {
    return env.STRIPE_SECRET_KEY_DEV;
  }
}