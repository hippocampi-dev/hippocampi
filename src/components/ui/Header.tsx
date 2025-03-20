"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { DropdownMenuSeparator, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuItem } from "./dropdown-menu";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="w-screen bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-1 text-2xl font-bold text-blue-600">
            Hippocampi
          </Link>
          <div className="hidden flex-1 justify-center items-center space-x-4 md:flex gap-2">
            {/* <Link href="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Home
            </Link> */}
            <Link
              href="/about"
              className="text-gray-700 transition duration-300 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 transition duration-300 hover:text-blue-600"
            >
              Contact
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="text-gray-700 transition-colors hover:text-primary cursor-pointer">
                  Legal
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href="/legal/terms-of-use" className="w-full">
                    Terms of Use
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/legal/privacy-policy" className="w-full">
                    Privacy Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/legal/nondiscrimination-notice" className="w-full">
                    Nondiscrimination
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-1 justify-end space-x-2">
            {session && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  asChild
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/auth/check-mfa">Login</Link>
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={
                  session
                    ? () => signOut({ redirect: true, callbackUrl: "/" })
                    : () => redirect("/portal")
                }
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {session ? `Sign Out` : `Sign Up`}
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>
    </header>
  );
}
