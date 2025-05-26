import { motion } from "framer-motion";

export function LoadingSpinner({ size = "medium", text = "Loading..." }) {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`border-t-2 border-primary rounded-full ${sizes[size as keyof typeof sizes]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function LoadingScreen({ text = "Loading..." }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
}