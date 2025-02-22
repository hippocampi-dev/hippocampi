"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { Header } from "~/components/ui/Header"
import Image from "next/image"

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Header />
      <section className="h-full flex gap-16 py-6 px-[5%]">
        <div className="container mx-auto flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Post-chemo care, quick and personalized
          </h1>
          <p className="text-xl md:text-2xl mb-8 w-4/5">
            Customized cognitive and mental healthcare begins here
          </p>
          <Link
            href="/about"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-500 transition duration-300 w-fit"
          >
            Learn More
          </Link>
        </div>
        <div className="flex-1 object-cover flex justify-center items-center">
          <Image
            className="w-2/3"
            alt="hippocampi-hero"
            width={9999}
            height={9999}
            src={'/hero.avif'}
          />
        </div>
      </section>
    </div>
  )
}