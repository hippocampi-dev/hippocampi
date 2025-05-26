"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "~/server/db";
import { blogPosts } from "~/server/db/schema/cms";

// Define BlogPost type based on database schema
type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  published: boolean;
  tags: string[] | null;
};

// Define a palette of distinct colors for nodes
const nodeColors = [
  "bg-blue-500",    // Blue
  "bg-purple-500",  // Purple
  "bg-green-500",   // Green
  "bg-amber-500",   // Amber
  "bg-rose-500",    // Rose
  "bg-red-500",     // Red
  "bg-indigo-500",  // Indigo
  "bg-emerald-500", // Emerald
  "bg-yellow-500",  // Yellow
  "bg-sky-500",     // Sky
  "bg-pink-500",    // Pink
  "bg-orange-500",  // Orange
  "bg-teal-500",    // Teal
  "bg-violet-500",  // Violet
  "bg-lime-500",    // Lime
  "bg-cyan-500",    // Cyan
  "bg-fuchsia-500", // Fuchsia
  "bg-slate-500",   // Slate
  "bg-stone-500",   // Stone
  "bg-neutral-500" // Neutral
];

// Function to get a distinct color for each node
const getDistinctColor = (index: number) => {
  // Use modulo to cycle through colors if there are more nodes than colors
  return nodeColors[index % nodeColors.length];
};

export default function CKCHomePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [blogNodes, setBlogNodes] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Fetch blog posts from the database
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        const data = await response.json();
        setBlogNodes(data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Generate positions for nodes in a more evenly distributed circular pattern
  const generateNodePositions = (count: number) => {
    const positions = [];
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    const centerX = 0;
    const centerY = 0;
    
    if (count === 0) return positions;
    
    // For a single node, place it at the center
    if (count === 1) {
      positions.push({ x: centerX, y: centerY });
      return positions;
    }
    
    // For multiple nodes, distribute them evenly around a circle
    const angleStep = (2 * Math.PI) / count;
    
    for (let i = 0; i < count; i++) {
      // Calculate angle based on position in array for even distribution
      const angle = i * angleStep;
      
      // Add slight random variation to make it look more natural
      // but maintain overall even distribution
      const jitter = (Math.random() - 0.5) * 0.2; // Small random offset
      const adjustedRadius = radius * (0.9 + Math.random() * 0.2); // Slight radius variation
      
      // Convert to cartesian coordinates
      const x = centerX + adjustedRadius * Math.cos(angle + jitter);
      const y = centerY + adjustedRadius * Math.sin(angle + jitter);
      
      positions.push({ x, y });
    }
    
    return positions;
  };

  if (!isMounted) {
    return null; // Prevent hydration errors
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const nodePositions = generateNodePositions(blogNodes.length);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12 z-10"
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

      <div className="relative w-full h-[600px] max-w-6xl mx-auto flex items-center justify-center">
        {/* Connection lines between nodes */}
        <svg className="absolute w-full h-full" style={{ pointerEvents: 'none' }}>
          {blogNodes.map((_, i) => (
            blogNodes.slice(i + 1).map((_, j) => {
              const probability = 0.3; // 30% chance of drawing a connection
              if (Math.random() > probability) return null;
              
              const sourcePos = nodePositions[i];
              const targetPos = nodePositions[i + j + 1];
              
              return (
                <motion.line
                  key={`line-${i}-${i+j+1}`}
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="rgba(200, 200, 200, 0.3)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 1 }}
                />
              );
            })
          ))}
        </svg>
        
        {/* Blog nodes */}
        {blogNodes.map((node, index) => {
          const position = nodePositions[index];
          // Use distinct color assignment instead of tag-based
          const nodeColor = getDistinctColor(index);
          const nodeSize = 90; // Fixed size for all nodes
          
          return (
            <motion.div
              key={node.id}
              className={`${nodeColor} rounded-full shadow-lg cursor-pointer text-white 
                          hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center
                          absolute`}
              style={{
                width: `${nodeSize}px`,
                height: `${nodeSize}px`,
                zIndex: 5
              }}
              initial={{ x: position.x, y: position.y, opacity: 0 }}
              animate={{ 
                x: position.x, 
                y: position.y,
                opacity: 1,
                scale: [0.9, 1.02, 0.98, 1]
              }}
              whileHover={{ 
                scale: 1.15,
                zIndex: 10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
              }}
              drag
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
              dragElastic={0.2}
              onClick={() => router.push(`/dashboard/patient/ckc/${node.slug}`)}
            >
              <div className="p-2 text-center">
                <h3 className="text-sm font-bold mb-1 line-clamp-2">{node.title}</h3>
              </div>
              
              {/* Tooltip that appears on hover */}
              <motion.div
                className="absolute bg-white text-gray-800 p-3 rounded-lg shadow-xl w-48 z-20 pointer-events-none"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileHover={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'none' }}
              >
                <h4 className="font-bold text-sm">{node.title}</h4>
                {node.summary && <p className="text-xs mt-1">{node.summary}</p>}
                {node.tags && node.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 px-1 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
