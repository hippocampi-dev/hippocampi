import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { ArrowRight, Brain, ChevronRight } from "lucide-react";
import { Header } from "~/components/ui/Header";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section with Synapse Background */}
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/highresneuronbackground.jpeg"
              alt="Neural synapse background"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 pt-24 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="animate-fade-in text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Transform Your Cancer Journey
                  </h1>
                  <div className="animate-grow-width h-1 w-24 rounded-full bg-primary"></div>
                  <Button
                    size="lg"
                    className="animate-fade-in-up mt-4 w-fit transition-all duration-300 hover:scale-105"
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
                  </Button>
                </div>
              </div>

              {/* Staggered and Offset Cards */}
              <div className="animate-fade-in-up relative h-[500px] w-full">
                <div className="animate-float absolute right-0 top-0 h-[300px] w-[80%] overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:-translate-y-2 hover:translate-x-2">
                  <Image
                    src="/HeroPatient.png
"
                    alt="Innovative healthcare platform"
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className="animate-float absolute right-24 top-24 h-[300px] w-[80%] overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Image
                    src="/aiChat.png?height=600&width=800"
                    alt="Patient-centered care"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Overview Section */}
        <section id="platform" className="w-full bg-muted/50 py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
              <h2 className="animate-fade-in text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Explore our inventive health platform
              </h2>
              <p className="animate-fade-in-up text-muted-foreground md:text-lg">
                We connect patients with specialized cognitive and mental care
                today, while developing solutions that empower doctors and
                patients to navigate tomorrow's challenges together. Here are 4
                important keystones of our company:
              </p>
            </div>
          </div>
        </section>

        {/* AI Screening Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="animate-slide-in-left space-y-4">
                <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  For Patients
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  AI driven chemo-brain and depression screening
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  Experience our streamlined assessment process—report personal
                  information, complete cancer-specific mental and cognitive
                  health tests (FACT COG + HADS), and receive automatic
                  referrals to appropriate care providers in 1-2 weeks, instead
                  of up to 90 days.
                </p>
              </div>
              <div className="animate-slide-in-right relative h-[400px]">
                <div className="animate-float absolute left-0 top-0 h-[250px] w-[80%] overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:-translate-y-2 hover:translate-x-2">
                  <Image
                    src="/PlaceholderInfo.png?height=500&width=800"
                    alt="AI-driven screening process"
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className="animate-float absolute left-8 top-8 h-[250px] w-[80%] overflow-hidden rounded-lg shadow-xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Image
                    src="/Assessment.png?height=500&width=800"
                    alt="Mental health assessment"
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className="animate-float absolute left-16 top-16 h-[250px] w-[80%] overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Image
                    src="/landingSurvey.png?height=500&width=800"
                    alt="Personalized care recommendations"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Care Network Section */}
        <section className="w-full bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col space-y-10">
              <div className="animate-fade-in-up relative h-[400px] w-full overflow-hidden rounded-xl">
                <Image
                  src="/HeroPatient.png?height=800&width=1600"
                  alt="Comprehensive care network"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
              </div>
              <div className="animate-fade-in mx-auto max-w-3xl space-y-4 text-center">
                <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  For Patients
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Comprehensive Care Network
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  Post-chemotherapy challenges REQUIRES robust, comprehensive
                  care. We connect you with a personalized team of oncologists,
                  neuropsychiatrists, integrative medicine specialists, and
                  speech pathologists—all accessible through our upcoming app
                  featuring both group and private messaging capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Administrative Burdens Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="animate-slide-in-left relative h-[400px]">
                <div
                  className="animate-float absolute right-8 top-8 h-[250px] w-[80%] overflow-hidden rounded-lg shadow-xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Image
                    src="/Invoices.PNG?height=500&width=800"
                    alt="AI-powered paperwork automation"
                    fill
                    className="object-cover"
                  />
                </div>
                <div
                  className="animate-float absolute right-16 top-16 h-[250px] w-[80%] overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Image
                    src="/ViewPatientInformation.PNG?height=500&width=800"
                    alt="Efficient healthcare management"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="animate-slide-in-right space-y-4">
                <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  For Providers
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Eliminating Administrative Burdens for Care Providers
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  Doctors, we've got you covered! Hippocampi eliminates
                  administrative burdens through our dedicated billing and
                  coding teams today, while developing specialized AI to
                  automate cancer-related paperwork tomorrow—letting you focus
                  entirely on patient care.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Acquisition Section */}
        <section className="w-full bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="animate-slide-in-left space-y-4">
                <div className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  For Providers
                </div>
                <h3 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                  Streamlining Patient Acquisition
                </h3>
                <p className="text-muted-foreground md:text-lg">
                  We connect doctors with patients by handling all marketing
                  efforts and building strategic referral partnerships, starting
                  with smaller cancer centers before expanding to major
                  institutions (MD Anderson), ensuring every chemotherapy
                  patient receives immediate referrals to your specialized care.
                </p>
              </div>
              <div className="animate-slide-in-right relative h-[400px]">
                <div
                  className="animate-float absolute left-16 top-16 h-[250px] w-[80%] overflow-hidden rounded-lg shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:translate-x-2"
                  style={{ animationDelay: "0.4s" }}
                >
                  <Image
                    src="/ZoomLink.PNG?height=500&width=800"
                    alt="Patient referral system"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          id="contact"
          className="w-full bg-gradient-to-b from-background to-muted py-20 md:py-32"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="animate-fade-in mx-auto flex max-w-3xl flex-col items-center justify-center space-y-8 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to transform cancer care together?
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Join our network of patients and providers creating a new
                standard for post-chemotherapy cognitive and mental health care.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="transition-all duration-300 hover:scale-105"
                >
                  For Patients
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-300 hover:scale-105"
                >
                  For Providers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-background py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">Hippocampi</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming cognitive and mental health care for cancer
                patients through innovation and compassion.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Our Approach
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Research
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Technology
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Team
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Hippocampi, Inc. All rights
              reserved.
            </p>
            <div className="mt-4 flex gap-4 md:mt-0">
              <Link
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
