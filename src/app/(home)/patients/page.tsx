import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "~/components/ui/Footer";

export default function PatientsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <main>
        <div className="relative flex flex-col items-center min-h-[200vh] w-full">
          <section className="relative z-[2] flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-primary text-white">
            <div className="relative text-9xl font-light flex flex-col justify-center items-center gap-6 pb-9 mb-6">
              <span>How</span>
              <span>Hippocampi</span>
              <span>Works</span>
            </div>
            <h4 className="text-2xl/8 text-white">A better approach to chemo brain care.</h4>
          </section>

          <section className="sticky top-0 flex flex-col items-center justify-center mt-[-100vh] min-h-screen w-full">
            <div className="flex flex-col items-center justify-center min-h-full w-full">
              <p className="lg:max-w-[72rem] text-7xl font-light leading-tight text-center">At Hippocampi, the <span className="text-primary">journey to chemo brain care</span> is powered by <span className="text-primary">AI technology</span> and <span className="text-primary">personalized care.</span></p>
            </div>
            <div className="h-[calc(50vh-180px)] absolute bottom-0">
              <div className="absolute h-full w-[16px] bg-[url('/home/dot.svg')] bg-repeat-y bg-contain right-[-8px]"></div>
            </div>
          </section>
        </div>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <h4 className="text-lg/7">How it works</h4>
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">It starts with <br></br><span className="text-primary">your health</span></h2>
                <p>
                  Tell us about your health history, symptoms, and treatment preferences by filling out a simple digital health assessment. 
                  <br></br><br></br>
                  This information forms the foundation of your personalized care journey.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
          {/* <div>
            <Image
              src={'/home/Image Placeholder.png'}
              alt="placeholder"
              priority
              width={9999}
              height={9999}
              className="object-cover aspect-[4/5] md:w-[20rem]"
            />
          </div> */}
        </section>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">
                  Sent <span className="text-primary">safely</span>
                  <br></br>
                  and <span className="text-primary">securely</span>
                  </h2>
                <p>
                  Your medical information is securely processed and reviewed within our encrypted platform to ensure privacy and compliance with the highest healthcare standards.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
        </section>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">
                  Refered to the
                  <br></br>
                  <span className="text-primary">right specialist</span>
                  </h2>
                <p>
                  Our advanced AI model reviews your responses and refers you to the right specialist—whether it’s a Neurologist, Speech Pathologist, Oncologist, or Integrative Medical Physician.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
        </section>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">Connect with a specialist, <br></br><span className="text-primary">faster</span></h2>
                <p>
                  On average, patients have to 34-90 days before seeing a specialist. 
                  <br></br><br></br>
                  With Hippocampi, you can be connected to the right provider within 1-2 weeks, significantly reducing wait times and accelerating your path to treatment.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
        </section>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">
                  A personalized
                  <br></br>
                  <span className="text-primary">care plan</span>
                  </h2>
                <p>
                  Based on your unique medical profile, your physician will create a tailored treatment plan to support cognitive function and overall well-being.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
        </section>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">
                  Seamless <span className="text-primary">access</span>
                  <br></br>
                  to <span className="text-primary">treatment</span>
                  </h2>
                <p>
                  Your provider may recommend cognitive therapy, lifestyle modifications, or medication. From the comfort of you own home, you easily have access to world class treatment.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
        </section>

        <section className="flex flex-col justify-start items-center gap-8 text-center min-h-screen w-full relative mt-8 bg-white">
          <div className="flex flex-col justify-center items-center items w-full z-10">
            <FogUp />
            <div className="flex flex-col justify-center items-center bg-white gap-6 pb-9">
              <div className="flex flex-col gap-4 md:w-[430px]">
                <h2 className="text-5xl font-light">
                  Ongoing support,
                  <br></br>
                  <span className="text-primary">anytime, anywhere</span>
                  </h2>
                <p>
                  Stay connected with your healthcare team through the Hippocampi platform. Message your doctors, schedule follow-ups, and access educational resources designed to help you take control of your cognitive health.
                </p>
              </div>
            </div>
            <FogDown />
          </div>
          <Dots />
        </section>

        <section className="flex flex-col items-center justify-center w-full text-center relative pb-[20vh]">
          <FogUp />
          <p className="text-7xl font-light leading-tight w-3/4">
            AI-driven <span className="text-primary">precision and expert care</span>, connecting chemo brain patients with the right specialists, <span className="text-primary">faster than ever.</span>
            <br></br><br></br>
            That's the future of <span className="text-primary">personalized digital healthcare.</span>
          </p>
        </section>

        <section className="w-full flex flex-col justify-center items-center pt-24 pb-36 text-primary rounded-[4rem] shadow-[0_-10px_60px_0_rgba(0,0,0,0.12)]">
          <div className="md:w-[700px] w-full flex flex-col gap-16">
            <h2 className="text-5xl/8 font-light text-primary">Join the care network</h2>
            <div className="flex flex-col gap-3 w-full">
              <CustomLink href="/portal/patient-login" text="For chemo brain patients" />
              <CustomLink href="/portal/doctor-login" text="For healthcare providers" />
              <CustomLink href="/contact" text="General contact" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Dots() {
  return (
    <div className="absolute h-full w-[16px] bg-[url('/home/dot.svg')] bg-repeat-y bg-contain"></div>
  )
}

function FogUp() {
  return (
    <div className="h-[7.5rem] w-full absolute top-[-7.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgb(255,255,255)_100%)]"></div>
  )
}

function FogDown() {
  return (
  <div className="h-[7.5rem] w-full relative bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgb(255,255,255)_100%)]"></div>
  )
}

function CustomLink({ href, text }: { href: string; text: string }) {
  return (
    <div className="relative w-full border-b border-current pb-6">
      <Link href={href} className="text-5xl/8 font-light flex items-center">
        <span>{text}</span>
        <ArrowRight className="ml-4 h-8 w-8" />
      </Link>
    </div>
  )
}