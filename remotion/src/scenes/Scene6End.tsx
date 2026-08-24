import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { palette, useAccent, useDrift, useEnter } from "../theme";
import { Headline, Logo, body } from "../components/ui";

export const Scene6End: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useAccent(4);
  const url = useEnter(52, 30);
  const phone = useEnter(64, 24);
  const drift = useDrift(7, 0.02);
  const sweep = interpolate(frame, [30, 90], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{ padding: 86, justifyContent: "center", alignItems: "center", textAlign: "center" }}
    >
      <div style={{ ...logo, transform: `${logo.transform} translateY(${drift}px)` }}>
        <Logo width={430} />
      </div>

      <div style={{ height: 60 }} />

      <Headline
        delay={26}
        size={88}
        lines={["List your", <span key="v" style={{ color: palette.greenSoft }}>vehicle today.</span>]}
      />

      <div
        style={{
          ...url,
          marginTop: 44,
          fontFamily: body,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 1,
          color: palette.cream,
          background: palette.green,
          padding: "22px 46px",
          borderRadius: 999,
          boxShadow: "0 28px 60px rgba(53,162,44,0.38)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        jamesblond.co.nz/list-your-vehicle
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 160,
            left: `${-30 + sweep * 130}%`,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
            transform: "skewX(-18deg)",
          }}
        />
      </div>

      <div
        style={{
          ...phone,
          marginTop: 30,
          fontFamily: body,
          fontWeight: 500,
          fontSize: 32,
          color: palette.creamDim,
        }}
      >
        Or call 0800 525 663 · No joining fee · Revenue share
      </div>
    </AbsoluteFill>
  );
};
