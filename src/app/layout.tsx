import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Nextjs Boilerplate",
  description: "Nextjs boilerplate with NextAuth, Drizzle, Postgres, and Stripe",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <SessionProvider>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
}
