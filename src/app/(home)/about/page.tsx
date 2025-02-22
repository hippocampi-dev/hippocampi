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
      <section id="company-overview" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-center text-4xl font-bold">
            About HippoCampi
          </h1>
          <p className="mb-4 text-lg">
            HippoCampi is at the forefront of digital healthcare, specializing
            in transforming the lives of cancer survivors battling cognitive
            decline—commonly known as chemo brain. Our platform connects
            patients directly with a dedicated care team of neuropsychologists,
            oncologists, speech therapists, and integrative medicine physicians.
          </p>
          <p className="mb-4 text-lg">
            Inspired by insights from research such as that by Klaver et al.,
            which underscores the tragic gap in addressing cognitive challenges,
            our mission is clear. We bridge this gap with compassion,
            state-of-the-art technology, and an unwavering commitment to every
            patient’s journey toward recovery.
          </p>
          <p className="text-lg">
            From automating medical billing and insurance processes to offering
            a seamless referral system between hospitals and specialists, we are
            redefining what it means to provide holistic post-chemotherapy care.
          </p>
        </div>
      </section>

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
