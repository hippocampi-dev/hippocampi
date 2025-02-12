// app/call-to-action/page.tsx
"use client";

import { Button } from "~/components/ui/button";
import { lusitana } from "~/components/ui/fonts";

export default function CallToAction() {
  return (
    <section className="bg-indigo-600 py-16 text-center text-white">
      <h2 className={`${lusitana.className} text-3xl font-bold mb-4`}>
        Ready to Transform Your Recovery?
      </h2>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        Whether you are a patient seeking cognitive care or a doctor looking to partner with us, Hippocampi is here to revolutionize chemo brain treatment.
      </p>
      <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-4 md:space-y-0">
        <Button onClick={() => window.location.href = "/signup"} variant="default" size="lg">
          Schedule a Consultation
        </Button>
        <Button onClick={() => window.location.href = "/partnership"} variant="outline" size="lg">
          Partner With Us
        </Button>
      </div>
      {/* Pricing section could be included here as an adaptive component based on user role */}
    </section>
  );
}
