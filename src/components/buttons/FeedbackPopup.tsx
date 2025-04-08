"use client"

import { useState, useEffect } from "react"
import { X, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"

interface FeedbackPopupProps {
  feedbackUrl: string
}

export function FeedbackPopup({ feedbackUrl }: FeedbackPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { status } = useSession()

  // Check if popup should be shown based on localStorage and session changes
  useEffect(() => {
    const shouldShowPopup = localStorage.getItem("feedbackPopupDismissed") !== "true"
    if (shouldShowPopup) {
      // Add a delay to show the popup
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [status]) // Re-run when auth status changes

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem("feedbackPopupDismissed", "true")
  }

  const handleClick = () => {
    window.open(feedbackUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-5 right-5 z-50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="relative">
            {/* Main button and expanded content container */}
            <motion.div
              className="flex items-center"
              initial={false}
              animate={isExpanded ? "expanded" : "collapsed"}
              variants={{
                collapsed: { width: "auto" },
                expanded: { width: "auto" }
              }}
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              {/* Expanded content first in DOM for proper z-index layering */}
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    className="bg-white shadow-md py-3 px-4 flex items-center overflow-hidden rounded-2xl"
                    initial={{ opacity: 0, width: 0, x: 20 }}
                    animate={{ 
                      opacity: 1, 
                      width: "215px",
                      x: 0 
                    }}
                    exit={{ 
                      opacity: 0, 
                      width: 0, 
                      x: 20, 
                      transition: { duration: 0.2 } 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 30
                    }}
                  >
                    <div className="flex items-center whitespace-nowrap w-full justify-between">
                      <motion.button
                        className="p-1 mr-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                        onClick={handleDismiss}
                        aria-label="Dismiss feedback popup"
                      >
                        <X size={14} className="text-gray-500" />
                      </motion.button>
                      
                      <p className="text-sm font-medium flex-1 truncate">Share your feedback</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Button - always visible */}
              <motion.button
                className="h-12 w-12 rounded-full shadow-md bg-[var(--primary)] flex items-center justify-center flex-shrink-0 cursor-pointer relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                aria-label="Open feedback form"
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </motion.button>
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-[var(--primary-light)] w-12 h-12"
              initial={{ opacity: 0.3, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                repeatType: "loop",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
