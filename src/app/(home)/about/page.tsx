'use client'

import Link from "next/link"
import { Header } from "~/components/ui/Header"

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
    <>
    <Header />
    
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to HippoCampi</h1>

        <blockquote className="border-l-4 border-blue-500 pl-4 mb-8 italic text-gray-700">
          "As soon as all blood counts were good, eh, on we go, back to living a normal life. Working full time. But now
          I'm at home. Simply, because I was completely drained."
          <footer className="text-sm mt-2">
            - Klaver et al, 2019.
            <Link
              href="https://www.researchgate.net/publication/337497205_Cancer-related_cognitive_problems_at_work_experiences_of_survivors_and_professionals"
              target="_blank"
              className="text-blue-600 hover:underline ml-1"
            >
              Klaver research article about cancer related cognitive impairment
            </Link>
          </footer>
        </blockquote>

        <p className="mb-6 text-gray-800 leading-relaxed">
          This breaks our hearts—seeing a survivor finally beat cancer, only to have their dreams of a normal life
          stolen by its lasting impairments. It's why this story and others inspire our mission at HippoCampi to tackle
          the devastating realities of cognitive and mental decline in cancer patients and survivors.
        </p>

        <p className="mb-6 text-gray-800 leading-relaxed">
          To address these challenges, we are building a digital platform that connects patients with comprehensive care
          teams who design personalized treatment plans in just 1-2 weeks, ensuring patients get the care they
          desperately need, when they need it the most.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700">
            At HippoCampi, we're dedicated to improving the lives of cancer patients and survivors by addressing
            cognitive and mental decline through personalized care and innovative digital solutions.
          </p>
        </div>
      </main>
    </div>
    </>
  )
}

