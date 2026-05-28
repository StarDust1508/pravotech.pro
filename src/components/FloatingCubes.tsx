import { useMemo, useState, useEffect } from "react";

/**
 * Animated floating cubes background.
 * Renders absolutely-positioned divs with CSS keyframe animations.
 * Zero JS on animation thread — all GPU-composited via transform/opacity.
 *
 * Optimizations:
 * - Lazy init: cubes render after mount (don't block initial paint)
 * - prefers-reduced-motion: static translucent cubes, no animation
 * - will-change: transform on animated cubes only
 * - Reduced count (18) — removed smallest/least-visible cubes
 */

const CUBE_COUNT = 18;
const MIN_SIZE = 18; // filter out tiny cubes below this threshold

const COLORS = [
  { bg: "hsl(180 100% 50% / 0.06)", shadow: "0 0 20px hsl(180 100% 50% / 0.15)" },
  { bg: "hsl(180 100% 50% / 0.04)", shadow: "0 0 15px hsl(180 100% 50% / 0.10)" },
  { bg: "hsl(320 100% 60% / 0.06)", shadow: "0 0 20px hsl(320 100% 60% / 0.15)" },
  { bg: "hsl(320 100% 60% / 0.04)", shadow: "0 0 15px hsl(320 100% 60% / 0.10)" },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

interface Cube {
  id: number;
  size: number;
  left: string;
  top: string;
  color: typeof COLORS[number];
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
  rotate: number;
  borderRadius: string;
}

function generateCubes(): Cube[] {
  const rand = seededRandom(42);
  const candidates: Cube[] = [];

  // Generate the same sequence as before (seed=42) but keep only larger cubes
  for (let i = 0; candidates.length < CUBE_COUNT; i++) {
    const size = 14 + rand() * 50;
    const color = COLORS[Math.floor(rand() * COLORS.length)];
    const cube: Cube = {
      id: candidates.length,
      size,
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      color,
      delay: rand() * -25,
      duration: 18 + rand() * 20,
      driftX: (rand() - 0.5) * 120,
      driftY: (rand() - 0.5) * 80,
      rotate: (rand() - 0.5) * 180,
      borderRadius: rand() > 0.7 ? "50%" : `${2 + rand() * 4}px`,
    };
    // Skip tiny cubes — they add GPU load without visible impact
    if (size < MIN_SIZE) continue;
    candidates.push(cube);
  }

  return candidates;
}

/** Detect prefers-reduced-motion at module level (static, no listener needed) */
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function FloatingCubes() {
  // Lazy init: don't render cubes during SSR / initial paint
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const cubes = useMemo(() => generateCubes(), []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {cubes.map((c) => (
        <div
          key={c.id}
          className="absolute"
          style={
            prefersReducedMotion
              ? {
                  width: c.size,
                  height: c.size,
                  left: c.left,
                  top: c.top,
                  backgroundColor: c.color.bg,
                  boxShadow: c.color.shadow,
                  borderRadius: c.borderRadius,
                  opacity: 0.5,
                }
              : {
                  width: c.size,
                  height: c.size,
                  left: c.left,
                  top: c.top,
                  backgroundColor: c.color.bg,
                  boxShadow: c.color.shadow,
                  borderRadius: c.borderRadius,
                  willChange: "transform",
                  animation: `cube-drift ${c.duration}s ease-in-out ${c.delay}s infinite`,
                  ["--drift-x" as string]: `${c.driftX}px`,
                  ["--drift-y" as string]: `${c.driftY}px`,
                  ["--rotate" as string]: `${c.rotate}deg`,
                }
          }
        />
      ))}
    </div>
  );
}
