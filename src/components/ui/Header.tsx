"use client"
import Link from "next/link"
import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Hippocampi
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition duration-300">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition duration-300">
              Contact Us
            </Link>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  )
}

