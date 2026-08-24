import { AbsoluteFill, Sequence } from "remotion";
import { palette, useDrift, useEnter } from "../theme";
import { Headline, Kicker, Photo, body } from "../components/ui";

export const Scene1Hook: React.FC = () => {
  const drift = useDrift(10, 0.02);
  const sub = useEnter(46, 30);

  return (
    <AbsoluteFill style={{ padding: 86, justifyContent: "flex-end" }}>
      <div
        style={{
          position: "absolute",
          right: -110,
          top: 58,
          width: 760,
          transform: `translateY(${drift}px)`,
        }}
      >
        <Photo src="south-auckland-cargo-van-fleet.jpg" height={560} radius={40} tilt={-2.5} />
      </div>

      <Sequence from={0}>
        <div style={{ position: "absolute", left: 86, bottom: 210 }}>
          <Kicker delay={4}>Vehicle owners · New Zealand</Kicker>
          <div style={{ height: 26 }} />
          <Headline
            delay={14}
            size={104}
            lines={["Your van", <span key="a" style={{ color: palette.greenSoft }}>sits idle</span>, "5 days a week."]}
          />
        </div>
      </Sequence>

      <div
        style={{
          ...sub,
          position: "absolute",
          left: 90,
          bottom: 108,
          fontFamily: body,
          fontSize: 34,
          fontWeight: 500,
          color: palette.creamDim,
          maxWidth: 720,
        }}
      >
        Every idle day is revenue you never billed.
      </div>
    </AbsoluteFill>
  );
};
