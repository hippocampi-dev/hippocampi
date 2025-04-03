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
    <header className="w-screen">
      <nav className="mx-auto px-[5%] py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-1 text-2xl text-primary">
            Hippocampi
          </Link>
          <div className="hidden flex-1 justify-center items-center space-x-4 md:flex gap-2">
            {/* <Link href="/" className="text-gray-700 hover:text-primary transition duration-300">
              Home
            </Link> */}
            <Link
              href="/about"
              className="text-gray-700 transition duration-300 hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/patients"
              className="text-gray-700 transition duration-300 hover:text-primary"
            >
              Patients
            </Link>
            <Link
              href="/providers"
              className="text-gray-700 transition duration-300 hover:text-primary"
            >
              Providers
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="text-gray-700 transition-colors hover:text-primary cursor-pointer text-lg">
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
            <Link
              href="/contact"
              className="text-gray-700 transition duration-300 hover:text-primary"
            >
              Contact
            </Link>
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
                  className="border-primary text-primary hover:bg-blue-50 py-2 px-6"
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
                className="py-2 px-6"
              >
                {session ? `Sign Out` : `Get started`}
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>
    </header>
  );
}
