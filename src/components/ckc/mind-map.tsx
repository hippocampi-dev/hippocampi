"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

// Knowledge node data - same as on homepage
const knowledgeNodes = [
  {
    id: "understanding-crci",
    title: "Understanding CRCI",
    color: "bg-blue-500",
    path: "/dashboard/ckc/understanding-crci"
  },
  {
    id: "tracking-communication",
    title: "Tracking & Communication",
    color: "bg-purple-500",
    path: "/dashboard/ckc/tracking-communication"
  },
  {
    id: "brain-sharp",
    title: "Keeping Your Brain Sharp",
    color: "bg-green-500",
    path: "/dashboard/ckc/brain-sharp"
  },
  {
    id: "relationships",
    title: "Feelings & Relationships",
    color: "bg-amber-500",
    path: "/dashboard/ckc/relationships"
  },
  {
    id: "research-treatment",
    title: "Research & Treatment",
    color: "bg-rose-500",
    path: "/dashboard/ckc/research-treatment"
  }
];

// Define connections between nodes
const connections = [
  { from: "understanding-crci", to: "tracking-communication" },
  { from: "understanding-crci", to: "brain-sharp" },
  { from: "understanding-crci", to: "research-treatment" },
  { from: "tracking-communication", to: "relationships" },
  { from: "brain-sharp", to: "research-treatment" },
  { from: "relationships", to: "brain-sharp" },
];

// Calculate node positions in a circular arrangement
const calculateNodePositions = (containerWidth: number, containerHeight: number) => {
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = Math.min(containerWidth, containerHeight) * 0.35;
  
  const positions: Record<string, {x: number, y: number}> = {};
  
  knowledgeNodes.forEach((node, index) => {
    const angle = (index / knowledgeNodes.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positions[node.id] = {x, y};
  });
  
  return positions;
};

interface MindMapProps {
  currentNodeId: string;
  className?: string;
}

export function MindMap({ currentNodeId, className = "" }: MindMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, {x: number, y: number}>>({});
  const [containerSize, setContainerSize] = useState({ width: 300, height: 300 });
  const router = useRouter();

  useEffect(() => {
    const updatePositions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        setNodePositions(calculateNodePositions(width, height));
      }
    };

    // Initial calculation
    updatePositions();
    
    // Update on resize
    window.addEventListener('resize', updatePositions);
    return () => window.removeEventListener('resize', updatePositions);
  }, []);

  const handleNodeClick = (path: string) => {
    router.push(path);
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden rounded-lg bg-gray-50 border ${className}`}>
      {/* Connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((connection, index) => {
          const fromPos = nodePositions[connection.from];
          const toPos = nodePositions[connection.to];
          
          if (!fromPos || !toPos) return null;
          
          return (
            <motion.line
              key={`${connection.from}-${connection.to}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke={connection.from === currentNodeId || connection.to === currentNodeId ? "#000" : "#ccc"}
              strokeWidth={connection.from === currentNodeId || connection.to === currentNodeId ? 2 : 1}
              strokeDasharray={connection.from !== currentNodeId && connection.to !== currentNodeId ? "5,5" : ""}
            />
          );
        })}
      </svg>
      
      {/* Nodes */}
      {Object.keys(nodePositions).length > 0 && knowledgeNodes.map((node) => {
        const position = nodePositions[node.id];
        if (!position) return null;
        
        const isActive = node.id === currentNodeId;
        
        return (
          <motion.div
            key={node.id}
            className={`absolute ${node.color} rounded-full shadow cursor-pointer
                      flex items-center justify-center p-1 text-white text-xs font-medium
                      ${isActive ? 'ring-2 ring-offset-2 ring-black z-10' : 'opacity-90'}`}
            style={{
              left: position.x,
              top: position.y,
              width: isActive ? '80px' : '60px',
              height: isActive ? '80px' : '60px',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              y: [0, isActive ? 0 : (Math.random() > 0.5 ? 5 : -5), 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2 + Math.random() * 2,
              ease: "easeInOut"
            }}
            onClick={() => handleNodeClick(node.path)}
            whileHover={{ scale: 1.1 }}
          >
            <div className="text-center px-1">
              {node.title.split(' ')[0]}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
