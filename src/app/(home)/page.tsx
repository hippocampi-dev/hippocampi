import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ArrowRight, Brain, ChevronRight, Calendar, Network, ClipboardCheck } from "lucide-react";
import { Header } from "~/components/ui/Header";
import Footer from "~/components/ui/Footer";
import { Card, CardContent, CardDescription, CardHeader } from "~/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1">
        <section className="relative min-h-screen h-screen w-full overflow-hidden px-9 py-6">
          <div className="flex flex-col justify-center relative w-full h-full px-[72px]">
            <div className="absolute inset-0 z-0 w-auto rounded-3xl overflow-hidden bg-black">
              <Image
                src="https://images.unsplash.com/photo-1582848892052-9f53255f9747?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Neural synapse background"
                fill
                className="object-cover opacity-75"
                priority
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div> */}
            </div>

            <div className="flex flex-col justify-center gap-6 z-10">
              <h1 className="font-light tracking-tighter text-7xl w-1/2 text-white">
                Chemobrain care
                personalized for you
              </h1>
              <Button size={'md'}>
                <Link href="/portal">Book a consultation</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full h-[70vh] flex justify-center items-center px-48">
          <p className="text-5xl font-light">
            The first telehealth platform that connects patients with specialized cognitive and mental care.
            <br></br>
            <span className="text-darkAccent">Shorter wait times. Personalized treatment. Accessible care.</span>
          </p>
        </section>

        <section className="w-full px-9 py-6">
          <div className="w-full h-full p-16 bg-lightAccent rounded-3xl flex flex-col gap-16">
            <div className="flex">
              <p className="text-5xl font-light flex-1">
                A new
                <br></br>
                <span className="text-darkAccent">health platform</span>
              </p>
              <div className="flex-1">
                <p className="text-darkAccent">Transform your cancer care journey.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="relative aspect-square rounded-3xl flex flex-col bg-white">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-sky-100 p-6 rounded-full">
                      <feature.icon className="h-20 w-20 text-primary" />
                    </div>
                  </div>

                  <div className="mt-auto p-4 text-center">
                    <p className="text-base text-darkAccent">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative min-h-screen h-screen w-full overflow-hidden px-9 py-6">
          <div className="flex flex-col relative w-full h-full">
            <div className="absolute inset-0 z-0 w-auto rounded-3xl overflow-hidden bg-black">
              <Image
                src="https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Neural synapse background"
                fill
                className="object-cover opacity-70"
                priority
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div> */}
            </div>

            <div className="flex flex-col h-full justify-between gap-6 z-10 p-12">
              <h1 className="font-light tracking-tighter text-7xl w-1/2 text-white">
                Join our integrative
                care network
              </h1>
              <div className="flex gap-6">
                <Button size={'md'}>
                  <Link href="/portal">For Patients</Link>
                </Button>
                <Button variant={"light"} size={'md'}>
                  <Link href="/portal/doctor-login">For Providers</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

const features = [
  {
    title: "Timely Appointments",
    description: "Appointments within 7 to 14 days.",
    icon: Calendar,
  },
  {
    title: "AI Screening",
    description: "AI driven chemo-brain screening.",
    icon: Brain,
  },
  {
    title: "Care Network",
    description: "A comprehensive care network.",
    icon: Network,
  },
  {
    title: "Administrative Efficiency",
    description: "Eliminating administrative burdens.",
    icon: ClipboardCheck,
  },
]