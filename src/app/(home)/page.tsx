import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ArrowRight, Brain, ChevronRight } from "lucide-react";
import { Header } from "~/components/ui/Header";
import Footer from "~/components/ui/Footer";

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
            Our telehealth platform connects patients with specialized cognitive and mental care.
            <br></br>
            <span className="text-darkAccent">Short wait times. Smart assessment. Integrated care team.</span>
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
                <p className="text-darkAccent">Long-term care. Preventative care. For a healthier life.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-end flex-1 bg-lightShade p-6 aspect-square rounded-2xl">
                <p className="text-lg/7">Appointments within 7 to 14 days, always on time.</p>
              </div>
              <div className="flex items-end flex-1 bg-lightShade p-6 aspect-square rounded-2xl">
                <p className="text-lg/7">AI driven cognitive assessments</p>
              </div>
              <div className="flex items-end flex-1 bg-lightShade p-6 aspect-square rounded-2xl">
                <p className="text-lg/7">Insurance Assistance</p>
              </div>
              <div className="flex items-end flex-1 bg-lightShade p-6 aspect-square rounded-2xl">
                <p className="text-lg/7">Certified specialized physicians</p>
              </div>
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
