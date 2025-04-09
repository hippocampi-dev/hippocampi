"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordian";
import { Button } from "~/components/ui/button";
import Footer from "~/components/ui/Footer";
import { Header } from "~/components/ui/Header";

export default function ProviderPage() {
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const [h2Height, setH2Height] = useState(0)

  useEffect(() => {
    if (h2Ref.current) {
      const updateHeight = () => {
        setH2Height(h2Ref.current?.offsetHeight || 0)
      }

      // Initial measurement
      updateHeight()

      // Update on resize
      window.addEventListener("resize", updateHeight)

      return () => {
        window.removeEventListener("resize", updateHeight)
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main>
        <section className="relative min-h-screen h-screen w-full overflow-hidden px-9 py-6">
          <div className="flex gap-3 h-full">
            <div className="flex-1 w-3/4 bg-primary rounded-3xl flex flex-col gap-12 justify-center p-32">
              <div className="flex flex-col gap-6">
                <h4 className="text-lg/7 text-white">Join Hippocampi</h4>
                <h1 className="text-7xl font-light text-white">The medical practice of your dreams</h1>
              </div>
              <Button size={'md'} variant={'light'}>
                <Link href={'/portal/doctor-login'}>
                  Let's talk
                </Link>
              </Button>
            </div>
            <Image 
              src={'https://images.unsplash.com/photo-1666214277657-e60f05c40b04?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
              alt={''}
              priority
              width={9999}
              height={9999}
              className="object-cover rounded-3xl w-1/4"
            />
          </div>
        </section>

        <section className="w-full h-[70vh] flex justify-center items-center px-48">
          <p className="text-5xl font-light">
            At Hippocampi, we take care of all your administrative tasks, freeing up your time so you can do what matters most: 
            <span className="text-darkAccent">your patients' health.</span>
          </p>
        </section>

        <section className="w-full px-[72px] py-16 flex flex-col gap-36">
          <div className="w-full flex justify-between gap-8">
            <h2 ref={h2Ref} className="w-1/3 text-5xl font-light">
              From scheduling to insurance to advertisement, we take care of it all.
            </h2>
            <div className="relative overflow-hidden rounded-xl" style={{ height: `${h2Height}px`, width: `${h2Height * 4 / 3}px` }}>
              <Image
                src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Neural synapse background"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h4 className="text-lg/7">What we take care of</h4>
            <Accordion type="single" collapsible className="w-full">
              {accordion.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="py-8">
                  <AccordionTrigger className="text-left text-5xl font-light">
                    <div className="flex items-center">
                      <span className="w-[180px]">{String(index + 1).padStart(2, "0")}</span>
                      <span>{item.task}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-lg/7">{item.description}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="relative min-h-screen h-screen w-full overflow-hidden px-9 py-16">
          <div className="flex flex-col relative w-full h-full">
            <div className="absolute inset-0 z-0 w-auto rounded-3xl overflow-hidden bg-black">
              <Image
                src="https://images.unsplash.com/photo-1612531386530-97286d97c2d2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Neural synapse background"
                fill
                className="object-cover opacity-70"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div> */}
            </div>

            <div className="flex h-full justify-between items-end gap-6 z-10 p-12">
              <h1 className="font-light tracking-tighter text-6xl w-1/2 text-white">
                Helping doctors focus
                on patient recovery
              </h1>
              <div className="flex gap-6">
                <Button variant={"light"} size={'md'}>
                  <Link href="/portal/doctor-login">Let's talk</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
const accordion = [
  {
    task: "Billing and Coding Support",
    description:
      "Dedicated teams manage medical billing and coding to ensure accurate claims and timely reimbursements.",
  },
  {
    task: "AI-Powered Paperwork Automation",
    description:
      "Developing AI solutions to streamline cancer-related documentation, reducing administrative time for doctors.",
  },
  {
    task: "Comprehensive Administrative Support",
    description:
      "Handling scheduling, credentialing, insurance onboarding, customer support, and claim denial management to eliminate administrative burdens.",
  },
  {
    task: "Patient Acquisition - Marketing",
    description:
      "Managing all advertising and marketing efforts to build the practice and increase patient flow.",
  },
  {
    task: "Strategic Partnerships",
    description:
      "Building partnerships with cancer centers, non-profits, and organizations to create referral pathways for specialized care.",
  }
];