// app/layout.tsx
import "~/styles/globals.css"
import { Inter } from "next/font/google";
import Header from "~/components/ui/Header";
import Footer from "~/components/ui/Footer";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hippocampi | Telehealth MSO for Chemo Brain",
  description:
    "Digital care platform for chemo brain treatment and support. Personalized cognitive care for cancer survivors.",
  openGraph: {
    title: "Hippocampi",
    description:
      "Revolutionizing Cancer Recovery with personalized cognitive care powered by AI.",
    url: "https://hippocampi.com",
    images: ["/images/background-hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
