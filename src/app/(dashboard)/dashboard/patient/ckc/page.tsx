"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Knowledge node data
const knowledgeNodes = [
  {
    id: "understanding-crci",
    title: "Understanding CRCI",
    description: "Learn about Cancer-Related Cognitive Impairment",
    color: "bg-blue-500",
    path: "/dashboard/patient/ckc/understanding-crci"
  },
  {
    id: "tracking-communication",
    title: "Tracking & Communication",
    description: "How to track and communicate about cognitive changes",
    color: "bg-purple-500",
    path: "/dashboard/patient/ckc/tracking-communication"
  },
  {
    id: "brain-sharp",
    title: "Keeping Your Brain Sharp",
    description: "Strategies to maintain cognitive function",
    color: "bg-green-500",
    path: "/dashboard/patient/ckc/brain-sharp"
  },
  {
    id: "relationships",
    title: "Feelings & Relationships",
    description: "How CRCI affects your emotions and connections",
    color: "bg-amber-500",
    path: "/dashboard/patient/ckc/relationships"
  },
  {
    id: "research-treatment",
    title: "Research & Treatment",
    description: "Latest research and treatment options",
    color: "bg-rose-500",
    path: "/dashboard/patient/ckc/research-treatment"
  }
];

export default function CKCHomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Curated Knowledge Center</h1>
        <motion.p 
          className="text-xl text-gray-600"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut" 
          }}
        >
          How might we inform you today?
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {knowledgeNodes.map((node, index) => (
          <motion.div
            key={node.id}
            className={`${node.color} rounded-2xl p-6 shadow-lg cursor-pointer text-white 
                        hover:shadow-xl transition-all duration-300 w-64 h-64 flex flex-col justify-center`}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            animate={{ 
              y: [0, (index % 2 === 0 ? 5 : -5), 0],
              rotate: [(index % 2 === 0 ? -0.5 : 0.5), 0, (index % 2 === 0 ? -0.5 : 0.5)]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + index * 0.5,
              ease: "easeInOut" 
            }}
            onClick={() => router.push(node.path)}
          >
            <h3 className="text-xl font-bold mb-2">{node.title}</h3>
            <p className="text-white/90">{node.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
