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
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <section className="mb-32">
          <h1 className="text-5xl font-bold text-gray-900 mb-12 text-center animate-fade-in">Our Mission</h1>
          <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16 relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Post-Chemo Care, Quick and Personalized.</h2>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Our cancer care systems demand immediate transformation, as its impact reaches far beyond a single tumor.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed">
              Hippocampi leads this innovation by prioritizing personalized care, pioneering the first-ever platform
              connecting cancer patients suffering cognitive and mental impairments with readily available healthcare
              providers.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-5xl font-bold text-gray-900 mb-16 text-center animate-fade-in">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in-stagger">
            {teamMembers.map((member, index) => (
              <div
                key={member.name}
                className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Link href={member.link} className="block relative h-[400px] overflow-hidden" target="_blank">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 opacity-0 hover:opacity-100 flex items-end justify-center pb-6">
                    <span className="text-white text-lg font-semibold bg-blue-600 px-4 py-2 rounded-full">
                      View Profile
                    </span>
                  </div>
                </Link>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-lg font-medium text-blue-600 mb-4">{member.role}</p>
                  <p className="text-gray-700 text-base line-clamp-4">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

