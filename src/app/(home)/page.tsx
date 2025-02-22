import Image from "next/image";
import { Brain, Info, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Footer from "~/components/ui/Footer";
import { Header } from "~/components/ui/Header";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">
            Post-Chemo care, personalized for you!
          </h1>
          <p className="mb-8 text-xl md:text-2xl">
            Customized cognitive and mental healthcare begins here.
          </p>
          <Button asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <p className="mb-6 text-xl">
            Bringing modern healthcare solutions to chemobrain
          </p>
          <p className="mx-auto mb-8 max-w-3xl text-lg">
            Life after cancer is never the same. Over compensation in the work
            force and a decline in cognitive abilities is never easy, so we seek
            to invigorate our patients, instilling hopefulness and information
            with peak efficiency and expertise.
          </p>
          <Button asChild>
            <Link href="/about">Learn More About Our Mission</Link>
          </Button>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="mb-12 text-center text-3xl font-bold">
            What We Offer
          </h2>

          {/* Accessibility */}
          <div className="mb-20">
            <div className="flex flex-col items-center md:flex-row">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <Image
                  src="/Accessibility-card.png"
                  alt="Accessibility"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <Brain className="mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-4 text-2xl font-bold">
                  "To get in touch with a good psychologist somewhere along the
                  way, is just a matter of luck."
                </h3>
                <p className="mb-4 text-lg">
                  We integrate over 5 different practitioners to provide a
                  holistic and articulate analysis of your situation. Our
                  integrative oncological approach ensures you receive
                  comprehensive care tailored to your unique needs.
                </p>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mb-20">
            <div className="flex flex-col items-center md:flex-row-reverse">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <Image
                  src="/Knowledgeissecurity.jpg"
                  alt="Information"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:pr-12">
                <Info className="mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-4 text-2xl font-bold">
                  "Knowledge is security"
                </h3>
                <p className="mb-4 text-lg">
                  Knowing what is happening to you isn't a service, it's a
                  right. We're focusing our funds into the forefront of AI,
                  equipping you for your consultations, future, and proper
                  decision making. Our large language model attends to your user
                  information, complemented by our research blogs.
                </p>
                <p className="mb-4 text-lg">
                  Allocentrically, we provide research and spread awareness to
                  employers, family members, and the general population. This
                  means greater connections with those who matter most, as well
                  as access to shared experiences in our community-based healing
                  approach.
                </p>
              </div>
            </div>
          </div>

          {/* Efficiency */}
          <div className="mb-20">
            <div className="flex flex-col items-center md:flex-row">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <Image
                  src="/stateofthearttechnology.png"
                  alt="Efficiency"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <Zap className="mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-4 text-2xl font-bold">
                  "Leveraging state-of-the-art technology"
                </h3>
                <p className="mb-4 text-lg">
                  We automate all the insurance coding and billing for you.
                  Where it once took months, you can now get a consultation
                  booked within weeks, or days. And soon at no cost.
                </p>
                <p className="mb-4 text-lg">
                  For doctors, that means no more organizational obstacles---
                  you can focus on your expertise and we handle the rest.
                </p>
              </div>
            </div>
          </div>

          {/* Future Goals */}
          <div>
            <div className="flex flex-col items-center md:flex-row-reverse">
              <div className="mb-8 md:mb-0 md:w-1/2">
                <Image
                  src="/futuregoals.webp"
                  alt="Future Goals"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2 md:pr-12">
                <TrendingUp className="mb-4 h-12 w-12 text-blue-600" />
                <h3 className="mb-4 text-2xl font-bold">
                  "The next big name in healthcare."
                </h3>
                <p className="mb-4 text-lg">
                  We are researching predictive screening and genome encoding,
                  to discount the exorbitant medical prices you currently face.
                  We are gaining momentum, following the pendulum of this
                  ever-growing industry in service to society.
                </p>
                <Button asChild>
                  <Link href="/about#upcoming-implementations">
                    Upcoming Implementations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
}
