// /app/components/Hero.tsx
"use client";

import { Button } from "~/components/ui/button"; // shadcn button
import { lusitana } from "~/components/ui/fonts";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20 text-white text-center">
      <h1 className={`${lusitana.className} text-5xl font-bold mb-4`}>
        Hippocampi
      </h1>
      <p className="text-xl mb-8">
        Digital care platform for chemo brain treatment and support
      </p>
      <Button variant="default" size="lg" onClick={() => window.location.href = "/signup"}>
        Request a Demo
      </Button>
    </section>
  );
}
