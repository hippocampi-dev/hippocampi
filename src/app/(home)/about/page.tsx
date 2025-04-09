import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "~/components/ui/card"
import Footer from "~/components/ui/Footer"
import { Header } from "~/components/ui/Header"

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
        <section className="bg-white border-t border-black mx-[72px] mt-[20vh] pt-[20vh] pb-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-6xl font-light tracking-tight mb-4">The Founding Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our team has been working closely together for the last year. Our unique blend of skills is the blueprint for what we aim for at Hippocampi: patient recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="transition-all duration-200 hover:shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                    <p className="text-slate-600 mb-4">{member.title}</p>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">Education:</span> {member.university}
                      </div>
                      <div>
                        <span className="font-semibold">Experience:</span> {member.experience}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

const teamMembers = [
  {
    name: "Tej Patel",
    title: "Chief Executive Officer",
    university: "UC Berkeley, Neuroscience and Business",
    experience: "Neurosurgery Research @ Cedars Sinai",
  },
  {
    name: "Kenan Blair",
    title: "Chief Technology Officer",
    university: "Purdue University",
    experience: "Computational Neuroscience @ UCLA",
  },
  {
    name: "Michael Isayan",
    title: "Chief Operating Officer",
    university: "Harvard, Economics and Government",
    experience: "Executive Producer @ TEDxNHHS Youth",
  },
  {
    name: "Hriday Meka",
    title: "Chief Financial Officer",
    university: "Yale, Economics and Biomedical Engineering",
    experience: "Leukemia Research @ City of Hope",
  },
  {
    name: "Travis Dao",
    title: "Chief Software Architect",
    university: "UC San Diego, Computer Science",
    experience: "Lead Developer @ SATSummit",
  },
  {
    name: "Kshitij Purani",
    title: "Head of Product",
    university: "UC Berkeley, Molecular Biology",
    experience: "Telemedicine Research @ IEEE EMBS",
  },
]