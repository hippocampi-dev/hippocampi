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
            At Hippocampi, we take care of all your administrative tasks. 
            <span className="text-darkAccent">We free up your time so you can focus on what matters most: your patients' health.</span>
          </p>
        </section>

        <section className="w-full px-[72px] py-16 flex flex-col gap-36">
          <div className="w-full flex justify-between gap-8">
            <h2 ref={h2Ref} className="w-1/3 text-5xl font-light">
              From the patient to their insurance, we take care of it all.
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
              {accordian.map((item, index) => (
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

const accordian = [
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
    task: "Marketing Management",
    description:
      "Overseeing all marketing efforts to attract new patients and maintain a strong professional presence.",
  },
  {
    task: "Strategic Partnerships",
    description:
      "Building relationships with top cancer centers like MD Anderson to improve referrals and collaboration opportunities.",
  },
  {
    task: "Advertising Strategy and Execution",
    description:
      "Handling all advertising campaigns to boost awareness and reputation in the healthcare industry.",
  },
  {
    task: "Patient Outreach and Acquisition",
    description:
      "Implementing targeted strategies to connect doctors with patients who need specialized care.",
  },
  // {
  //   task: "Compliance and Regulation Assistance",
  //   description:
  //     "Ensuring all billing, coding, and marketing activities align with medical industry regulations and best practices.",
  // },
  // {
  //   task: "Revenue Cycle Optimization",
  //   description:
  //     "Enhancing financial efficiency by reducing claim denials, improving payment collection, and maximizing revenue.",
  // },
  // {
  //   task: "Brand Development for Doctors and Practices",
  //   description:
  //     "Crafting a strong professional image through personalized branding, online presence, and reputation management.",
  // },
  {
    task: "Reducing Non-Clinical Workload",
    description:
      "Taking over administrative, marketing, and advertising tasks so doctors can focus entirely on patient care.",
  },
];