import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { Header } from "~/components/ui/Header";
import type React from "react"; // Added import for React
import { SessionProvider } from "next-auth/react";
import { Toaster } from "~/components/ui/toaster";
import { ToastProvider } from "./contexts/ToastContext";
import { FeedbackPopup } from "~/components/buttons/FeedbackPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hippocampi - Digital Care Platform for Chemo Brain Treatment",
  description:
    "Connecting cancer patients experiencing chemo brain with specialized care teams.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ToastProvider>
          <SessionProvider>
            <main>{children}</main>
            <Toaster />
            <FeedbackPopup feedbackUrl="https://forms.gle/QfDjcHj3pEkCL2X1A" />
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
