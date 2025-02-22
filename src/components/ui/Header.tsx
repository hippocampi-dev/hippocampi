"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "~/components/ui/button"

export function Header() {
  const {data: session} = useSession();

  return (
    <header className="bg-white shadow-md w-screen">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600 flex-1">
            Hippocampi
          </Link>
          <div className="hidden md:flex space-x-4 flex-1 justify-center">
            {/* <Link href="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Home
            </Link> */}
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Contact
            </Link>
          </div>
          <div className="flex space-x-2 flex-1 justify-end">
            {session && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={session ? () => signOut({ redirect: true, callbackUrl: "/" }) : () => redirect("/sign-up")}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {session ? `Sign Out` : `Sign Up`}
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>
    </header>
  )
}

