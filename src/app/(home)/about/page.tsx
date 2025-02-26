import Link from "next/link";
import React from "react";
import { Header } from "~/components/ui/Header";

const teamMembers = [
  {
    name: "Tej",
    role: "CEO",
    description:
      "Tej spearheads our market research and business development, ensuring that our vision aligns with the evolving needs of the healthcare sector.",
    image: "/images/tej.jpg",
  },
  {
    name: "Kshitj",
    role: "CMO",
    description:
      "Kshitj brings a wealth of healthcare experience, driving our strategic initiatives and ensuring that our patient outreach is both empathetic and effective.",
    image: "/images/kshitj.jpg",
  },
  {
    name: "Kenan Blair",
    role: "Head of AI & Web Development",
    description:
      "With a background in SaaS and Django-based backend development, Kenan leads our AI efforts and develops computational models that power our personalized care platform.",
    image: "/images/kenan.jpg",
  },
  {
    name: "Hriday",
    role: "CFO",
    description:
      "Hriday manages our financial strategy, ensuring that our growth is sustainable and that every dollar is invested to improve patient care.",
    image: "/images/hriday.jpg",
  },
  {
    name: "Travis Dao",
    role: "CTO",
    description:
      "Travis is responsible for our technical infrastructure and product innovation, driving our mission to provide an intuitive, secure, and powerful platform for healthcare providers and patients alike.",
    image: "/images/travis.jpg",
  },
];

export default function AboutPage() {
  return (
    <div>
      <Header />
      {/* Company Overview */}
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto max-w-3xl px-4 py-16">
          <h1 className="mb-8 text-4xl font-bold text-gray-900">
            Welcome to HippoCampi
          </h1>
          <blockquote className="mb-8 border-l-4 border-blue-500 pl-4 italic text-gray-700">
            "As soon as all blood counts were good, eh, on we go, back to living
            a normal life. Working full time. But now I'm at home. Simply,
            because I was completely drained."
            <footer className="mt-2 text-sm">
              - Klaver et al, 2019.
              <Link
                href="https://www.researchgate.net/publication/337497205_Cancer-related_cognitive_problems_at_work_experiences_of_survivors_and_professionals"
                target="_blank"
                className="ml-1 text-blue-600 hover:underline"
              >
                Klaver research article about cancer related cognitive
                impairment
              </Link>
            </footer>
          </blockquote>
          <p className="mb-6 leading-relaxed text-gray-800">
            This breaks our hearts—seeing a survivor finally beat cancer, only
            to have their dreams of a normal life stolen by its lasting
            impairments. It's why this story and others inspire our mission at
            HippoCampi to tackle the devastating realities of cognitive and
            mental decline in cancer patients and survivors.
          </p>
          <p className="mb-6 leading-relaxed text-gray-800">
            To address these challenges, we are building a digital platform that
            connects patients with comprehensive care teams who design
            personalized treatment plans in just 1-2 weeks, ensuring patients
            get the care they desperately need, when they need it the most.
          </p>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">
              Our Mission
            </h2>
            <p className="text-gray-700">
              At HippoCampi, we're dedicated to improving the lives of cancer
              patients and survivors by addressing cognitive and mental decline
              through personalized care and innovative digital solutions.
            </p>
          </div>
        </main>
      </div>

      {/* Our Team Section */}
      <section id="our-team" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-4xl font-semibold">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="mb-4 h-32 w-32 rounded-full object-cover"
                />
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="mb-2 font-medium text-blue-600">{member.role}</p>
                <p className="text-gray-700">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
