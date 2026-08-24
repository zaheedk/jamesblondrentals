import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const palette = {
  navy: "#101B45",
  navyDeep: "#080F2B",
  navySoft: "#1B2A61",
  green: "#35A22C",
  greenSoft: "#5FC455",
  cream: "#F6F4EF",
  creamDim: "rgba(246,244,239,0.66)",
};

/** Default entrance: rise + fade + de-blur. Smooth spring, no bounce. */
export const useEnter = (delay = 0, distance = 46) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200, mass: 0.8 },
    durationInFrames: 26,
  });
  return {
    opacity: p,
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
    filter: `blur(${interpolate(p, [0, 1], [12, 0])}px)`,
  };
};

/** Accent entrance for hero moments: scale overshoot. */
export const useAccent = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.9 },
  });
  return {
    opacity: interpolate(p, [0, 0.35], [0, 1], { extrapolateRight: "clamp" }),
    transform: `scale(${interpolate(p, [0, 1], [0.86, 1])})`,
  };
};

/** Slow drift so nothing is ever perfectly still. */
export const useDrift = (amplitude = 8, speed = 0.018, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame * speed + phase) * amplitude;
};

/** Ken Burns push for photography. */
export const useKenBurns = (from = 1.06, to = 1.16, duration = 170) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, duration], [from, to], {
    extrapolateRight: "clamp",
  });
};
