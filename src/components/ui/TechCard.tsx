import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface TechCardProps {
  children: React.ReactNode;
  className?: string;
  /** Spotlight color on hover — default neon-cyan */
  spotlightColor?: string;
  /** Disable hover lift/scale */
  flat?: boolean;
}

export function TechCard({
  children,
  className = "",
  spotlightColor = "rgba(0,255,255,0.07)",
  flat = false,
}: TechCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      whileHover={flat ? {} : { y: -5 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-card/60 backdrop-blur-sm ${className}`}
    >
      {/* Mouse-tracking spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />

      {/* Border glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          boxShadow: hovering
            ? `inset 0 0 0 1px rgba(0,255,255,0.15), 0 0 25px rgba(0,255,255,0.08)`
            : "none",
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/** TechCard variant with magenta spotlight */
export function TechCardMagenta(props: Omit<TechCardProps, "spotlightColor">) {
  return <TechCard {...props} spotlightColor="rgba(255,51,153,0.07)" />;
}
