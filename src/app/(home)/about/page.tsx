import Image from "next/image"
import Link from "next/link"
import Footer from "~/components/ui/Footer"
import { Header } from "~/components/ui/Header"

const teamMembers = [
  {
    name: "Tej Patel",
    role: "CEO",
    description:
      "Tej's experience in neuroscience research and AI-driven diagnostics, developed during his leadership of machine learning projects at Cedars Sinai's Neurosurgery Department and Cleveland Clinic's Neuroradiology Department, enables him to spearhead Hippocampi's market research and business development, ensuring the company's vision remains aligned with healthcare's evolving needs.",
    image: "/team/tej.png",
    link: "https://www.linkedin.com/in/tej-patel-873b952a8/",
  },
  {
    name: "Kshitij Purani",
    role: "CMO",
    description:
      "Kshitij brings a wealth of healthcare experience, driving our strategic initiatives and ensuring that our patient outreach is both empathetic and effective.",
    image: "/team/kshitij.png",
    link: "https://www.linkedin.com/in/kshitij-purani-285661289/",
  },
  {
    name: "Kenan Blair",
    role: "Head of AI & Web Development",
    description:
      "With a background in SaaS and Django-based backend development, Kenan leads our AI efforts and develops computational models that power our personalized care platform.",
    image: "/team/kenan.png",
    link: "#",
  },
  {
    name: "Hriday Meka",
    role: "CFO",
    description:
      "Hriday manages our financial strategy, ensuring that our growth is sustainable and that every dollar is invested to improve patient care.",
    image: "/team/hriday.png",
    link: "https://www.linkedin.com/in/hridaymeka/",
  },
  {
    name: "Travis Dao",
    role: "CTO",
    description:
      "Travis is responsible for our technical infrastructure and product innovation, driving our mission to provide an intuitive, secure, and powerful platform for healthcare providers and patients alike.",
    image: "/team/travis.png",
    link: "https://www.linkedin.com/in/travis-dao-40b998325/",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="">
        <section className="w-full px-9 relative flex flex-col items-center gap-24">
          <div className="h-[80vh] flex justify-center items-center">
            <p className="text-5xl font-light w-3/5">
              How you heal shapes how you live.<br></br>
              <span className="text-darkAccent">Connecting with the right care shouldn’t be a struggle.</span>
              <br></br><br></br>
              We normalize the challenges, innovate the solutions, and tailor the healthcare experience to you.
            </p>
          </div>

          <Image
            src="https://images.unsplash.com/photo-1665686377065-08ba896d16fd?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Neural synapse background"
            width={9999}
            height={9999}
            className="object-cover rounded-3xl"
            priority
          />

          <div className="flex flex-col w-3/5 gap-8">
            <p className="text-5xl font-light">
              Your health is personal.
              <span className="text-darkAccent"> Now, so is your care.</span>
            </p>
            <p>Treatment at Hippocampi include connecting you with specialized physicians through our digital health platform, ensuring you get expert care tailored to your needs. Whether you're exploring cutting-edge treatments or established therapies, our specialists assess your symptoms and health history one-on-one to create a personalized care plan. And support doesn’t stop there—through our platform, you can connect with your care team, access resources, and manage your treatment anytime. Because here, your recovery is our priority.</p>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full flex justify-evenly pt-36 py-24">
          <div className="flex flex-col gap-12 w-[30vw]">
            <div className="flex flex-col gap-3">
              <h2 className="text-4xl">Meet the team</h2>
              <p>Our team has been working closely together for the last year. Our unique blend of skills is the blueprint for what we aim for at Hippocampi: patient recovery.</p>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <Image
                src="/team/tej.png"
                alt="Neural synapse background"
                width={9999}
                height={9999}
                className="object-cover rounded-3xl aspect-[3/4] bg-lightAccent"
                priority
              />
              <div>
                <h2 className="text-2xl">Tej Patel</h2>
                <p>Co-Founder and CEO</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <Image
                src="/team/hriday.png"
                alt="Neural synapse background"
                width={9999}
                height={9999}
                className="object-cover rounded-3xl aspect-[3/4] bg-lightAccent"
                priority
              />
              <div>
                <h2 className="text-2xl">Hriday Meka</h2>
                <p>Head of Growth</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12 w-[30vw]">
            <div className="flex flex-col gap-6 w-full">
              <Image
                src="/team/kenan.png"
                alt="Neural synapse background"
                width={9999}
                height={9999}
                className="object-cover rounded-3xl aspect-[3/4] bg-lightAccent"
                priority
              />
              <div>
                <h2 className="text-2xl">Kenan Blair</h2>
                <p>Co-Founder and CTO</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <Image
                src="/team/travis.png"
                alt="Neural synapse background"
                width={9999}
                height={9999}
                className="object-cover rounded-3xl aspect-[3/4] bg-lightAccent"
                priority
              />
              <div>
                <h2 className="text-2xl">Travis Dao</h2>
                <p>Chief Software Architect</p>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <Image
                src="/team/kshitij.png"
                alt="Neural synapse background"
                width={9999}
                height={9999}
                className="object-cover rounded-3xl aspect-[3/4] bg-lightAccent"
                priority
              />
              <div>
                <h2 className="text-2xl">Kshitij Purani</h2>
                <p>Head of Product</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

