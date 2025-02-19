'use client'

import Image from "next/image"
import { motion } from "motion/react"

const teamMembers = [
  {
    name: "Dr. Jane Doe",
    role: "Founder & CEO",
    bio: "Neuroscientist with 15 years of experience in cognitive research.",
  },
  {
    name: "John Smith",
    role: "CTO",
    bio: "Healthcare technology expert with a background in AI and machine learning.",
  },
  {
    name: "Dr. Emily Chen",
    role: "Chief Medical Officer",
    bio: "Oncologist specializing in chemo brain and cognitive impairments.",
  },
]

const milestones = [
  { year: "2022", achievement: "Completed database setup and authentication system" },
  { year: "2023", achievement: "Integrated Stripe payments and launched early outreach campaigns" },
  { year: "2024", achievement: "Partnered with major cancer centers for pilot programs" },
]

export default function About() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center">About Hippocampi</h1>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700">
            Hippocampi is dedicated to connecting cancer patients experiencing chemo brain with specialized care teams.
            Our long-term vision includes partnerships with leading cancer centers, launching a cutting-edge research
            lab, and developing proprietary AI software to revolutionize cognitive care for cancer patients.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Image
                  src={`/placeholder.svg?height=150&width=150`}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Progress & Milestones</h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full mr-4">{milestone.year}</div>
                <p className="text-lg">{milestone.achievement}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Scientific Basis & Market Opportunity</h2>
          <p className="text-lg text-gray-700 mb-4">
            Our approach is grounded in rigorous scientific research, utilizing standardized cognitive assessments such
            as the Montreal Cognitive Assessment, PHQ-9, and GAD-7 to provide accurate and personalized care.
          </p>
          <p className="text-lg text-gray-700">
            With an increasing number of cancer survivors experiencing chemo brain, the market potential for our
            solution is substantial. Our revenue model includes partnerships with healthcare providers,
            direct-to-consumer subscriptions, and potential licensing of our AI technology.
          </p>
        </section>
      </div>
    </div>
  )
}

