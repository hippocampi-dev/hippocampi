import "~/styles/globals.css"
import { Inter } from "next/font/google"
import { Header } from "~/components/ui/Header"
import type React from "react" // Added import for React
import { SessionProvider } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hippocampi - Digital Care Platform for Chemo Brain Treatment",
  description: "Connecting cancer patients experiencing chemo brain with specialized care teams.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}