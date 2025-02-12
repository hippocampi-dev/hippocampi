// /app/components/ui/shared/Header.tsx
"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
      <Link href="/">
        <h1 className="text-2xl font-bold text-blue-600">Hippocampi</h1>
      </Link>
      <nav className="space-x-4">
        <Link href="/about">About Us</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/features">Features</Link>
        <Link href="/why-choose-us">Why Choose Us</Link>
        <Link href="/testimonials">Testimonials</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
}
