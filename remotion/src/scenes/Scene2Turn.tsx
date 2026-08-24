import { AbsoluteFill } from "remotion";
import { palette, useAccent, useEnter } from "../theme";
import { Headline, Kicker, Photo, body } from "../components/ui";

export const Scene2Turn: React.FC = () => {
  const badge = useAccent(56);
  const sub = useEnter(40, 30);

  return (
    <AbsoluteFill style={{ padding: 86 }}>
      <div style={{ marginTop: 24 }}>
        <Kicker delay={2}>List your vehicle</Kicker>
        <div style={{ height: 24 }} />
        <Headline
          delay={10}
          size={92}
          lines={["Put it to work.", <span key="c" style={{ color: palette.greenSoft }}>Earn monthly.</span>]}
        />

        <div
          style={{
            ...sub,
            marginTop: 26,
            fontFamily: body,
            fontSize: 34,
            fontWeight: 500,
            color: palette.creamDim,
            maxWidth: 780,
          }}
        >
          You keep the asset. We bring the renters and run the rental.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          bottom: 96,
          height: 400,
        }}
      >
        <Photo src="list-your-vehicle-hero.jpg" delay={26} height={400} radius={38} />
        <div
          style={{
            ...badge,
            position: "absolute",
            right: -14,
            top: -40,

            background: palette.green,
            color: palette.cream,
            fontFamily: body,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "16px 28px",
            borderRadius: 999,
            boxShadow: "0 22px 50px rgba(53,162,44,0.4)",
          }}
        >
          No joining fee
        </div>
      </div>
    </AbsoluteFill>
  );
};
