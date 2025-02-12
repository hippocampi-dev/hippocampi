// app/how-it-works/page.tsx
import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-16 px-4 md:px-20 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">How It Works</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
          <img src="/icons/referral.svg" alt="Post-Chemo Referral" className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Post-Chemo Referral</h2>
          <p className="text-center text-gray-600">
            Oncology centers refer patients directly to our platform.
          </p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
          <img src="/icons/assessment.svg" alt="AI-Driven Cognitive Assessment" className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">AI-Driven Cognitive Assessment</h2>
          <p className="text-center text-gray-600">
            Our platform screens patients with personalized cognitive assessments.
          </p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
          <img src="/icons/care-team.svg" alt="Personalized Care Team" className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Personalized Care Team</h2>
          <p className="text-center text-gray-600">
            We match patients with expert neuropsychologists, oncologists, and more.
          </p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center p-6 bg-white rounded-lg shadow">
          <img src="/icons/virtual-support.svg" alt="Ongoing Virtual Support" className="h-16 w-16 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ongoing Virtual Support</h2>
          <p className="text-center text-gray-600">
            Continuous tracking and cognitive therapy to ensure progress.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
