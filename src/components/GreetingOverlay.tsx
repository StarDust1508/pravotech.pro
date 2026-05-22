import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.4 },
  },
  exit: { opacity: 0, transition: { duration: 0.6, delay: 0.3 } },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

interface GreetingOverlayProps {
  name: string;
  show: boolean;
  onDone: () => void;
}

export function GreetingOverlay({ name, show, onDone }: GreetingOverlayProps) {
  const text = `Здравствуйте, ${name}`;

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/85 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          {/* Ambient glows */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-neon-cyan/[0.08] blur-[150px]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full bg-neon-magenta/[0.06] blur-[120px] translate-x-20 translate-y-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />

          {/* Text reveal */}
          <motion.h1
            className="relative font-display text-4xl md:text-6xl lg:text-7xl font-black text-center px-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {Array.from(text).map((ch, i) => (
              <motion.span
                key={i}
                variants={letterVariants}
                className={`inline-block ${
                  i >= text.indexOf(",") + 2 ? "text-neon-cyan" : ""
                }`}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtle line under text */}
          <motion.div
            className="h-[2px] mt-6 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"
            initial={{ width: 0 }}
            animate={{ width: "16rem" }}
            transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
