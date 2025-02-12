"use client"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Digital Care Platform for Chemo Brain Treatment and Support
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Empowering cancer patients with innovative cognitive care solutions
            </p>
            <Link
              href="/about"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-blue-100 transition duration-300"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Welcome to Hippocampi</h2>
          <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
            At Hippocampi, we're revolutionizing the way cancer patients manage chemo brain symptoms. Our digital
            platform connects patients with specialized care teams, providing personalized support and innovative
            treatments to improve cognitive function and quality of life.
          </p>
        </div>
      </section>
    </div>
  )
}

