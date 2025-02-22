"use client"

import { motion } from "motion/react"
import { Header } from "~/components/ui/Header"

export default function Contact() {
  return (
    <>
    <Header />
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

        <div className="max-w-2xl mx-auto">
          <motion.form
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </div>
          </motion.form>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Alternative Contact Methods</h2>
            <p className="text-lg text-gray-700 mb-2">Email: info@hippocampi.com</p>
            <p className="text-lg text-gray-700 mb-2">Phone: +1 (555) 123-4567</p>
            <div className="mt-4">
              <a href="#" className="text-blue-600 hover:text-blue-800 mr-4">
                LinkedIn
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800 mr-4">
                Twitter
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800">
                Facebook
              </a>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Interested in Partnering?</h2>
            <p className="text-lg text-gray-700 mb-4">
              We're always looking for innovative partners to help us improve cognitive care for cancer patients. If
              you're an investor, healthcare provider, or potential collaborator, we'd love to hear from you.
            </p>
            <a
              href="mailto:partnerships@hippocampi.com"
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Contact Our Partnership Team
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

