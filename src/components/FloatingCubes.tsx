import { useMemo } from "react";

/**
 * Animated floating cubes background.
 * Renders ~30 absolutely-positioned divs with CSS keyframe animations.
 * Zero JS on animation thread — all GPU-composited via transform/opacity.
 */

const CUBE_COUNT = 28;
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
  return Array.from({ length: CUBE_COUNT }, (_, i) => {
    const size = 14 + rand() * 50;
    const color = COLORS[Math.floor(rand() * COLORS.length)];
    return {
      id: i,
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
  });
}

export function FloatingCubes() {
  const cubes = useMemo(() => generateCubes(), []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {cubes.map((c) => (
        <div
          key={c.id}
          className="absolute will-change-transform"
          style={{
            width: c.size,
            height: c.size,
            left: c.left,
            top: c.top,
            backgroundColor: c.color.bg,
            boxShadow: c.color.shadow,
            borderRadius: c.borderRadius,
            animation: `cube-drift ${c.duration}s ease-in-out ${c.delay}s infinite`,
            ["--drift-x" as string]: `${c.driftX}px`,
            ["--drift-y" as string]: `${c.driftY}px`,
            ["--rotate" as string]: `${c.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
