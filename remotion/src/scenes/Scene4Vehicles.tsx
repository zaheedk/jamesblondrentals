import { AbsoluteFill } from "remotion";
import { palette, useDrift, useEnter } from "../theme";
import { Headline, Kicker, Photo, body, display } from "../components/ui";

const types = ["Cargo vans", "Furniture trucks", "Utes", "Trailers", "Minibuses", "Tippers"];

const Chip: React.FC<{ label: string; delay: number; i: number }> = ({ label, delay, i }) => {
  const style = useEnter(delay, 26);
  const drift = useDrift(4, 0.024, i);
  return (
    <div
      style={{
        ...style,
        transform: `${style.transform} translateY(${drift}px)`,
        fontFamily: display,
        fontWeight: 700,
        fontSize: 34,
        color: palette.cream,
        padding: "18px 30px",
        borderRadius: 999,
        border: `1px solid ${i % 2 === 0 ? "rgba(53,162,44,0.65)" : "rgba(246,244,239,0.22)"}`,
        background: i % 2 === 0 ? "rgba(53,162,44,0.16)" : "rgba(246,244,239,0.05)",
      }}
    >
      {label}
    </div>
  );
};

export const Scene4Vehicles: React.FC = () => {
  const note = useEnter(74, 24);
  return (
    <AbsoluteFill style={{ padding: 82 }}>
      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <Photo src="truck-open-doors-loading-boxes.jpg" delay={4} height={300} radius={30} />
        </div>
        <div style={{ width: 300 }}>
          <Photo
            src="12-seater-van-auckland-sky-tower.jpg"
            delay={14}
            height={300}
            radius={30}
            kenBurns={[1.1, 1.22]}
          />
        </div>
      </div>

      <div style={{ marginTop: 52 }}>
        <Kicker delay={22}>Wanted nationwide</Kicker>
        <div style={{ height: 20 }} />
        <Headline delay={28} size={82} lines={["The vehicles", "we need most."]} />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginTop: 36,
          maxWidth: 900,
        }}
      >
        {types.map((t, i) => (
          <Chip key={t} label={t} i={i} delay={40 + i * 4} />
        ))}

      </div>

      <div
        style={{
          ...note,
          marginTop: 34,
          fontFamily: body,
          fontSize: 30,
          fontWeight: 500,
          color: palette.creamDim,
          maxWidth: 800,
        }}
      >
        Auckland · Wellington · Christchurch · Hamilton
      </div>
    </AbsoluteFill>
  );
};
