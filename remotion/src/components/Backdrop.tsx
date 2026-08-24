import { AbsoluteFill, useCurrentFrame } from "remotion";
import { palette } from "../theme";

/** Persistent layer: living navy gradient + drifting geometry + grain lines. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 900;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.navyDeep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at ${
            22 + Math.sin(frame * 0.006) * 12
          }% ${18 + Math.cos(frame * 0.005) * 10}%, ${palette.navySoft} 0%, ${
            palette.navy
          } 45%, ${palette.navyDeep} 100%)`,
        }}
      />
      {/* green light bloom */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(55% 45% at ${
            82 - t * 24
          }% ${76 + Math.sin(frame * 0.009) * 6}%, rgba(53,162,44,0.34) 0%, rgba(53,162,44,0) 65%)`,
        }}
      />
      {/* diagonal ribbon */}
      <div
        style={{
          position: "absolute",
          left: -240,
          top: 120 + Math.sin(frame * 0.008) * 26,
          width: 1700,
          height: 150,
          background:
            "linear-gradient(90deg, rgba(246,244,239,0) 0%, rgba(246,244,239,0.06) 40%, rgba(53,162,44,0.16) 100%)",
          transform: `rotate(-24deg) translateX(${-120 + t * 240}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -300,
          top: 720 - Math.cos(frame * 0.007) * 30,
          width: 1700,
          height: 90,
          background:
            "linear-gradient(90deg, rgba(53,162,44,0.14) 0%, rgba(246,244,239,0.05) 55%, rgba(246,244,239,0) 100%)",
          transform: `rotate(-24deg) translateX(${140 - t * 260}px)`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(78% 78% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
